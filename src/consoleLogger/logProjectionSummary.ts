import type { TransactionSummary } from "../types";
import {
  logLineBreak,
  colWidth,
  logFormattedRecurringTransaction,
  logFormattedLineItem,
} from "./consoleLogUtils";

const logRecurringTransactionTableHeader = (): void => {
  console.log("Projected Transactions");
  logLineBreak("large");
  console.log(
    `${"Label".padEnd(colWidth)}${"Amount".padStart(colWidth)}${"Day".padStart(
      colWidth
    )}`
  );
  logLineBreak("large");
};

// loger dep
export const logProjectionSummary = (
  transactionSummary: TransactionSummary
): void => {
  const {
    recurringTransactions,
    unpaidRecurringEstimate,
    net,
    projectedIncome,
  } = transactionSummary;
  logRecurringTransactionTableHeader();
  recurringTransactions.forEach((recTransaction) => {
    logFormattedRecurringTransaction(recTransaction);
  });
  logLineBreak("large");
  logFormattedLineItem("Proj. Bills", unpaidRecurringEstimate, true);
  logFormattedLineItem("Proj. Income", projectedIncome, true);
  logLineBreak("small");
  logFormattedLineItem(
    "Proj. Net",
    net + projectedIncome + unpaidRecurringEstimate,
    true
  );
  logLineBreak("large");
};
