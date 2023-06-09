import type { CCTransaction } from "../types";
import { parseCSV } from "./parseCSV";
import { logLineBreak } from "./consoleLogUtils";

export const loadConcatenatedStatements = async (
  filePaths: string[]
): Promise<CCTransaction[]> => {
  let transactions: CCTransaction[] = [];

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    console.log(`loading ${filePath}...`);
    const parsedStatement: CCTransaction[] = await parseCSV<CCTransaction>(
      filePath
    );
    transactions = [...transactions, ...parsedStatement];
  }

  logLineBreak();

  return transactions;
};
