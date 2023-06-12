import type { CSVTransaction } from "../types";
import { parseCSV } from "./";

export const loadConcatenatedStatements = async (
  filePaths: string[]
): Promise<CSVTransaction[]> => {
  let transactions: CSVTransaction[] = [];

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    console.log(`loading ${filePath}...`);
    const parsedStatement: CSVTransaction[] = await parseCSV<CSVTransaction>(
      filePath
    );
    transactions = [...transactions, ...parsedStatement];
  }

  return transactions;
};
