import type { TransactionSummary } from "../types";
import { logCategorySummary } from "./logCategorySummary";
import { logProjectionSummary } from "./logProjectionSummary";

// main export for logging
export const logBankiSummary = (
  transactionSummary: TransactionSummary
): void => {
  console.log("\n");
  logCategorySummary(transactionSummary);
  console.log("\n");
  logProjectionSummary(transactionSummary);
};
