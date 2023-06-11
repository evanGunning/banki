import type { CCTransaction, RecurringTransaction } from "../types";
import {
  logLineBreak,
  logFormattedLineItem,
  logRecurringTransactionTableHeader,
  logFormattedRecurringTransaction,
} from "../utils/consoleLogUtils";
import { findCSVsFromDirectory } from "../utils/findCSVsFromDirectory";
import { loadConcatenatedStatements } from "../utils/loadConcatenatedStatements";
import { shouldIgnoreTransaction } from "../utils/shouldIgnoreTransaction";
import { getCustomTransactionCategory } from "../utils/getCustomTransactionCategory";
import { getTransactionValue } from "../utils/getTransactionValue";
import { config } from "../config";

type ExpenseCategories = Record<string, number>;

interface TransactionSummary {
  expenseCategories: ExpenseCategories;
  recurringTransactions: RecurringTransaction[];
  net: number;
}

const findRecurringTransaction = (
  recurringTransactions: RecurringTransaction[],
  curTransaction: CCTransaction
): number => {
  return recurringTransactions.findIndex((recTransaction, index) => {
    if (
      getTransactionValue(curTransaction, "description")
        .toLowerCase()
        .includes(recTransaction.description.toLowerCase())
    ) {
      return true;
    }
    return false;
  });
};

const computeTransactionSummary = (
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

  transactions.forEach((transaction) => {
    const amount = Number(getTransactionValue(transaction, "amount"));
    const customCategory = getCustomTransactionCategory(transaction);

    if (!shouldIgnoreTransaction(transaction)) {
      // initialize category expense to 0 if undefined
      if (expenseCategories[customCategory] === undefined) {
        expenseCategories[customCategory] = 0;
      }

      expenseCategories[customCategory] =
        expenseCategories[customCategory] + amount;

      const recurringTransactionIndex = findRecurringTransaction(
        recurringTransactions,
        transaction
      );
      if (recurringTransactionIndex !== -1) {
        recurringTransactions[recurringTransactionIndex].isPaid = true;
        recurringTransactions[recurringTransactionIndex].actualAmount = amount;
        recurringTransactions[recurringTransactionIndex].actualDate =
          getTransactionValue(transaction, "postDate");
      }
    }
  });

  let net = 0;

  Object.keys(expenseCategories).forEach((category) => {
    net += expenseCategories[category];
  });

  return {
    net,
    expenseCategories,
    recurringTransactions,
  };
};

const logTransactionSummary = (
  transactionSummary: TransactionSummary
): void => {
  const { expenseCategories, recurringTransactions, net } = transactionSummary;

  Object.keys(expenseCategories)
    .sort()
    .forEach((category) => {
      logFormattedLineItem(category, expenseCategories[category]);
    });

  logLineBreak();
  logFormattedLineItem("Net", net);

  logRecurringTransactionTableHeader();
  recurringTransactions.forEach((recTransaction) => {
    logFormattedRecurringTransaction(recTransaction);
  });
  logLineBreak("large");
};

export const analyzeStatements = async (dirPath: string): Promise<void> => {
  const filePaths = await findCSVsFromDirectory(dirPath);
  if (filePaths.length === 0) {
    console.log("No statements provided.");
    return;
  }

  const transactions = await loadConcatenatedStatements(filePaths);

  const transactionSummary = computeTransactionSummary(transactions);
  logTransactionSummary(transactionSummary);
};
