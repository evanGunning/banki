import { parseCSV } from "./parseCSV";
import { logLineBreak, logFormattedLineItem } from "./consoleLogUtils";
import { findCSVsFromDirectory } from "./findCSVsFromDirectory";

interface CCTransaction {
  "Transaction Date": string;
  "Post Date": string;
  Description: string;
  Category: string;
  Type: string;
  Amount: string;
  Memo: string;
}

type ExpensesByCategory = Record<string, number>;

const parseConcatenatedStatements = async (
  filePaths: string[]
): Promise<CCTransaction[]> => {
  let concatenatedStatements: CCTransaction[] = [];

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    console.log(`loading ${filePath}...`);
    const parsedStatement: CCTransaction[] = await parseCSV<CCTransaction>(
      filePath
    );
    concatenatedStatements = [...concatenatedStatements, ...parsedStatement];
  }

  logLineBreak();

  return concatenatedStatements;
};

const shouldIgnoreTransaction = (description: string): boolean => {
  const ignoredTransactionStrings = [
    "payment thank you",
    "payment to chase card",
  ];

  return ignoredTransactionStrings.some((ignoredString) => {
    return description.toLowerCase().includes(ignoredString);
  });
};

export const analyzeStatements = async (dirPath: string): Promise<void> => {
  const filePaths = await findCSVsFromDirectory(dirPath);
  if (filePaths.length === 0) {
    console.log("No statements provided.");
    return;
  }

  const concatenatedStatements = await parseConcatenatedStatements(filePaths);

  const expensesByCategory: ExpensesByCategory = {};
  concatenatedStatements.forEach(({ Amount, Category, Type, Description }) => {
    const amount = Number(Amount);
    const customCategoryLabel = Category === undefined ? Type : Category;

    if (!shouldIgnoreTransaction(Description)) {
      // initialize category expense to 0 if undefined
      if (expensesByCategory[customCategoryLabel] === undefined) {
        expensesByCategory[customCategoryLabel] = 0;
      }

      expensesByCategory[customCategoryLabel] =
        expensesByCategory[customCategoryLabel] + amount;
    }
  });

  let totalExpenses = 0;

  Object.keys(expensesByCategory).forEach((category) => {
    totalExpenses += expensesByCategory[category];
    logFormattedLineItem(category, expensesByCategory[category]);
  });

  logLineBreak();
  logFormattedLineItem("Net", totalExpenses);
};
