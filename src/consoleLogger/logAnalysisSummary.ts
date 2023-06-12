import type { TransactionSummary } from "../types";
import { logCategorySummary } from "./logCategorySummary";
import { logProjectionSummary } from "./logProjectionSummary";

// main export for logging
export const logAnalysisSummary = (
  transactionSummary: TransactionSummary,
  showTransactions: boolean
): void => {
  console.log("\n");
  logCategorySummary(transactionSummary, showTransactions);
  console.log("\n");
  logProjectionSummary(transactionSummary);
};
