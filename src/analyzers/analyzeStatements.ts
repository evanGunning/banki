import type { CCTransaction, RecurringTransaction } from "../types";
import {
  logLineBreak,
  logFormattedLineItem,
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
  unpaidRecurringEstimate: number;
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
  };
};

const logCategorySummary = (transactionSummary: TransactionSummary): void => {
  const { expenseCategories, net } = transactionSummary;
  console.log("Transaction Summary By Category");
  logLineBreak();
  Object.keys(expenseCategories)
    .sort()
    .forEach((category) => {
      logFormattedLineItem(category, expenseCategories[category]);
    });
  logLineBreak("small");
  logFormattedLineItem("Net", net);
  logLineBreak("small");
};

const logRecurringTransactionTableHeader = (): void => {
  console.log("Recurring Transactions");
  logLineBreak("large");
  console.log(
    `${"Label".padEnd(20)}${"Amount".padStart(20)}${"Day".padStart(20)}`
  );
  logLineBreak("large");
};

const logRecurringTransactionSummary = (
  transactionSummary: TransactionSummary
): void => {
  const { recurringTransactions, unpaidRecurringEstimate, net } =
    transactionSummary;
  logRecurringTransactionTableHeader();
  recurringTransactions.forEach((recTransaction) => {
    logFormattedRecurringTransaction(recTransaction);
  });
  logLineBreak("large");
  logFormattedLineItem("Est. Unpaid", unpaidRecurringEstimate);
  logFormattedLineItem("Proj. Net", net - unpaidRecurringEstimate);
  logLineBreak("large");
};

const logTransactionSummary = (
  transactionSummary: TransactionSummary
): void => {
  console.log("\n");
  logCategorySummary(transactionSummary);
  console.log("\n");
  logRecurringTransactionSummary(transactionSummary);
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
