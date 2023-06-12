import type { CLIOptions } from "./cli";
import { findCSVsFromDirectory, loadConcatenatedStatements } from "./csvUtils";
import { logBankiSummary } from "./consoleLogger";
import { getTransactionSummary } from "./transactionSummary";

export const banki = async (cliOptions: CLIOptions): Promise<void> => {
  const { dir, showTransactions } = cliOptions;

  const filePaths = await findCSVsFromDirectory(dir);
  if (filePaths.length === 0) {
    console.log(`No CSV files found in "${dir}". Exiting...`);
    return;
  }

  const transactions = await loadConcatenatedStatements(filePaths);
  const transactionSummary = getTransactionSummary(transactions);
  logBankiSummary(transactionSummary, showTransactions);
};
