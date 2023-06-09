import type { CCTransaction } from "../types";
import { logLineBreak, logFormattedLineItem } from "../utils/consoleLogUtils";
import { findCSVsFromDirectory } from "../utils/findCSVsFromDirectory";
import { loadConcatenatedStatements } from "../utils/loadConcatenatedStatements";
import { shouldIgnoreTransaction } from "../utils/shouldIgnoreTransaction";
import { getCustomTransactionCategory } from "../utils/getCustomTransactionCategory";
import { getTransactionValue } from "../utils/getTransactionValue";

type ExpenseCategories = Record<string, number>;

interface TransactionSummary {
  expenseCategories: ExpenseCategories;
  net: number;
}

const computeTransactionSummary = (
  transactions: CCTransaction[]
): TransactionSummary => {
  const expenseCategories: ExpenseCategories = {};
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
    }
  });

  let net = 0;

  Object.keys(expenseCategories).forEach((category) => {
    net += expenseCategories[category];
  });

  return {
    net,
    expenseCategories,
  };
};

const logTransactionSummary = (
  transactionSummary: TransactionSummary
): void => {
  const { expenseCategories, net } = transactionSummary;

  Object.keys(expenseCategories)
    .sort()
    .forEach((category) => {
      logFormattedLineItem(category, expenseCategories[category]);
    });

  logLineBreak();
  logFormattedLineItem("Net", net);
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
