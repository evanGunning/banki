import { parseCSV } from "../utils/parseCSV";
import { logLineBreak } from "../utils/consoleLogUtils";

export interface CCTransaction {
  "Transaction Date": string;
  "Post Date": string;
  Description: string;
  Category: string;
  Type: string;
  Amount: string;
  Memo: string;
}

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
