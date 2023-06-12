import { getCLIOptions } from "./cli";
import { findCSVsFromDirectory, loadConcatenatedStatements } from "./csvUtils";
import { getBankiSummary } from "./transactionSummary";
import { logBankiSummary } from "./consoleLogger";
import { serializeTransactions } from "./csvUtils/serializeTransactions";

export const banki = async (): Promise<void> => {
  const { dir } = getCLIOptions();

  const filePaths = await findCSVsFromDirectory(dir);
  if (filePaths.length === 0) {
    console.log(`No CSV files found in "${dir}". Exiting...`);
    return;
  }

  const transactions = await loadConcatenatedStatements(filePaths);
  // const bankiTransactions = serializeTransactions(transactions);
  const transactionSummary = getBankiSummary(transactions);
  logBankiSummary(transactionSummary);
};
