import type { TransactionSummary } from "../types";
import { logLineBreak, logFormattedLineItem } from "./consoleLogUtils";
import { getCLIOptions } from "../cli";

// logger dep
export const logCategorySummary = (
  transactionSummary: TransactionSummary
): void => {
  const { showTransactions } = getCLIOptions();
  const { expenseCategories, net } = transactionSummary;
  console.log("Transaction Summary By Category");
  logLineBreak();
  Object.keys(expenseCategories)
    .sort()
    .forEach((category) => {
      const transactionCount = expenseCategories[category].transactions.length;
      logFormattedLineItem(
        `(${transactionCount}) ${category}`,
        expenseCategories[category].amount,
        true
      );

      if (showTransactions) {
        expenseCategories[category].transactions.forEach((transaction) => {
          logFormattedLineItem(
            `${"".padStart(4)}${transaction.description}`,
            transaction.amount
          );
        });
      }
    });
  logLineBreak("small");
  logFormattedLineItem("Net", net, true);
  logLineBreak("small");
};
