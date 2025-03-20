import type { TransactionSummary } from "../types";
import { logLineBreak, logFormattedLineItem } from "./consoleLogUtils";
import { getCLIOptions } from "../cli";

// logger dep
export const logCategorySummary = (
  transactionSummary: TransactionSummary
): void => {
  const { showTransactions } = getCLIOptions();
  const { expenseCategories, net } = transactionSummary;
  const totalIncome = Object.values(expenseCategories).reduce(
    (acc, category) => {
      const categoryTotal = category.transactions.reduce((sum, transaction) => {
        return transaction.amount > 0 ? sum + transaction.amount : sum;
      }, 0);
      return acc + categoryTotal;
    },
    0
  );
  const totalExpenses = Object.values(expenseCategories).reduce(
    (acc, category) => {
      const categoryTotal = category.transactions.reduce((sum, transaction) => {
        return transaction.amount < 0 ? sum + transaction.amount : sum;
      }, 0);
      return acc + categoryTotal;
    },
    0
  );

  console.log("Transaction Summary By Category");
  logLineBreak();
  Object.entries(expenseCategories)
    .sort(([, a], [, b]) => a.amount - b.amount)
    .forEach(([category, categoryData]) => {
      const transactionCount = categoryData.transactions.length;
      logFormattedLineItem(
        `(${transactionCount}) ${category}`,
        categoryData.amount,
        true
      );

      if (showTransactions) {
        categoryData.transactions.forEach((transaction) => {
          logFormattedLineItem(
            `${"".padStart(4)}${transaction.description}`,
            transaction.amount
          );
        });
      }
    });
  logLineBreak("small");
  logFormattedLineItem("Income", totalIncome, true);
  logFormattedLineItem("Expenses", totalExpenses, true);
  logLineBreak("small");
  logFormattedLineItem("Net", net, true);
  logLineBreak("small");
};
