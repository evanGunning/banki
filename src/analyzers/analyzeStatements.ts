import type { CCTransaction } from "../types";
import { logLineBreak, logFormattedLineItem } from "../utils/consoleLogUtils";
import { findCSVsFromDirectory } from "../utils/findCSVsFromDirectory";
import { loadConcatenatedStatements } from "../utils/loadConcatenatedStatements";
import { shouldIgnoreTransaction } from "../utils/shouldIgnoreTransaction";
import { getCategoryForTransaction } from "../utils/getCategoryForTransaction";

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
    const { Amount } = transaction;
    const amount = Number(Amount);

    const customCategoryLabel = getCategoryForTransaction(transaction);

    if (!shouldIgnoreTransaction(transaction)) {
      // initialize category expense to 0 if undefined
      if (expenseCategories[customCategoryLabel] === undefined) {
        expenseCategories[customCategoryLabel] = 0;
      }

      expenseCategories[customCategoryLabel] =
        expenseCategories[customCategoryLabel] + amount;
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

  Object.keys(expenseCategories).forEach((category) => {
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
