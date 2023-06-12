import type {
  CCTransaction,
  TransactionSummary,
  ExpenseCategories,
  RecurringTransaction,
  ProjectedPaycheck,
} from "../types";
import { config } from "../config";
import { getTransactionValue } from "../csvUtils";
import { getCustomTransactionCategory } from "./getCustomTransactionCategory";
import { shouldIgnoreTransaction } from "./shouldIgnoreTransaction";
import { getRecurringTransaction } from "./getRecurringTransaction";
import { getUpdatedPaychecks } from "./getUpdatedPaychecks";
import { getProjectedIncome } from "./getProjectedIncome";

// summary: main export
export const getTransactionSummary = (
  transactions: CCTransaction[]
): TransactionSummary => {
  const expenseCategories: ExpenseCategories = {};
  const recurringTransactions: RecurringTransaction[] =
    config.recurringTransactions.map((recTransaction) => {
      return {
        ...recTransaction,
        isPaid: false,
        actualAmount: 0,
        actualDate: "",
      };
    });
  let projectedPaychecks: ProjectedPaycheck[] = config.paychecks.map(
    (paycheckConf) => {
      return {
        ...paycheckConf,
        paycheckTransactions: [],
      };
    }
  );

  transactions.forEach((transaction) => {
    const amount = Number(getTransactionValue(transaction, "amount"));
    const customCategory = getCustomTransactionCategory(transaction);

    if (!shouldIgnoreTransaction(transaction)) {
      // initialize category expense to 0 if undefined
      if (expenseCategories[customCategory] === undefined) {
        expenseCategories[customCategory] = {
          amount: 0,
          transactions: [],
        };
      }

      expenseCategories[customCategory].amount =
        expenseCategories[customCategory].amount + amount;
      expenseCategories[customCategory].transactions.push(transaction);

      // TODO: getUpdatedRecurringTransactions
      const recurringTransactionIndex = getRecurringTransaction(
        recurringTransactions,
        transaction
      );
      if (recurringTransactionIndex !== -1) {
        recurringTransactions[recurringTransactionIndex].isPaid = true;
        recurringTransactions[recurringTransactionIndex].actualAmount = amount;
        recurringTransactions[recurringTransactionIndex].actualDate =
          getTransactionValue(transaction, "postDate");
      }

      projectedPaychecks = getUpdatedPaychecks(projectedPaychecks, transaction);
    }
  });

  const net = Object.keys(expenseCategories).reduce((acc, category) => {
    return acc + expenseCategories[category].amount;
  }, 0);

  const unpaidRecurringEstimate = recurringTransactions.reduce(
    (acc, recTransaction) => {
      if (!recTransaction.isPaid) {
        return acc + recTransaction.estimatedAmount;
      } else {
        return acc;
      }
    },
    0
  );

  return {
    net,
    expenseCategories,
    recurringTransactions,
    unpaidRecurringEstimate,
    projectedPaychecks,
    projectedIncome: getProjectedIncome(projectedPaychecks),
  };
};
