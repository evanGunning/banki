import { parseCSV } from "./parseCSV";
import { logLineBreak, logFormattedLineItem } from "./consoleLogUtils";

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
    const parsedStatement: CCTransaction[] = await parseCSV<CCTransaction>(
      filePath
    );
    concatenatedStatements = [...concatenatedStatements, ...parsedStatement];
  }

  return concatenatedStatements;
};

export const analyzeCCStatement = async (
  filePaths: string[]
): Promise<void> => {
  if (filePaths.length === 0) {
    console.log("No statements provided.");
    return;
  }

  const concatenatedStatements = await parseConcatenatedStatements(filePaths);

  const expensesByCategory: ExpensesByCategory = {};
  concatenatedStatements.forEach(({ Amount, Category, Description }) => {
    const amount = Number(Amount);

    if (!Description.toLocaleLowerCase().includes("payment thank you")) {
      // initialize category expense to 0 if undefined
      if (expensesByCategory[Category] === undefined) {
        expensesByCategory[Category] = 0;
      }

      expensesByCategory[Category] = expensesByCategory[Category] + amount;
    }
  });

  let totalExpenses = 0;

  Object.keys(expensesByCategory).forEach((category) => {
    totalExpenses += expensesByCategory[category];
    logFormattedLineItem(category, expensesByCategory[category]);
  });

  logLineBreak();
  logFormattedLineItem("Total Expenses", totalExpenses);
};
