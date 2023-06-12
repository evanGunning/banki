import type { CLIOptions } from "./cli";
import { findCSVsFromDirectory, loadConcatenatedStatements } from "./csvUtils";
import { logAnalysisSummary } from "./consoleLogger";
import { getTransactionSummary } from "./transactionSummary";

export const banki = async (cliOptions: CLIOptions): Promise<void> => {
  const { dir, showTransactions } = cliOptions;
  const filePaths = await findCSVsFromDirectory(dir);
  if (filePaths.length === 0) {
    console.log("No statements provided.");
    return;
  }

  const transactions = await loadConcatenatedStatements(filePaths);
  const transactionSummary = getTransactionSummary(transactions);
  logAnalysisSummary(transactionSummary, showTransactions);
};
