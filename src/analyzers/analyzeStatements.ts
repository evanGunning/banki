import { parseCSV } from "../utils/parseCSV";
import { logLineBreak, logFormattedLineItem } from "../utils/consoleLogUtils";
import { findCSVsFromDirectory } from "../utils/findCSVsFromDirectory";

interface CCTransaction {
  "Transaction Date": string;
  "Post Date": string;
  Description: string;
  Category: string;
  Type: string;
  Amount: string;
  Memo: string;
}

type ExpenseCategories = Record<string, number>;

interface TransactionSummary {
  expenseCategories: ExpenseCategories;
  net: number;
}

const loadConcatenatedStatements = async (
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

const shouldIgnoreTransaction = (description: string): boolean => {
  const ignoredTransactionStrings = [
    "payment thank you",
    "payment to chase card",
  ];

  return ignoredTransactionStrings.some((ignoredString) => {
    return description.toLowerCase().includes(ignoredString);
  });
};

const computeTransactionSummary = (
  transactions: CCTransaction[]
): TransactionSummary => {
  const expenseCategories: ExpenseCategories = {};
  transactions.forEach(({ Amount, Category, Type, Description }) => {
    const amount = Number(Amount);
    const customCategoryLabel = Category === undefined ? Type : Category;

    if (!shouldIgnoreTransaction(Description)) {
      // initialize category expense to 0 if undefined
      if (expenseCategories[customCategoryLabel] === undefined) {
        expenseCategories[customCategoryLabel] = 0;
      }

      expenseCategories[customCategoryLabel] =
        expenseCategories[customCategoryLabel] + amount;
    }
  });

  let net = 0;

  Object.keys(expenseCategories).forEach((category) => {
    net += expenseCategories[category];
  });

  return {
    net,
    expenseCategories,
  };
};

const logTransactionSummary = (
  transactionSummary: TransactionSummary
): void => {
  const { expenseCategories, net } = transactionSummary;

  Object.keys(expenseCategories).forEach((category) => {
    logFormattedLineItem(category, expenseCategories[category]);
  });

  logLineBreak();
  logFormattedLineItem("Net", net);
};

export const analyzeStatements = async (dirPath: string): Promise<void> => {
  const filePaths = await findCSVsFromDirectory(dirPath);
  if (filePaths.length === 0) {
    console.log("No statements provided.");
    return;
  }

  const transactions = await loadConcatenatedStatements(filePaths);
  const transactionSummary = computeTransactionSummary(transactions);
  logTransactionSummary(transactionSummary);
};
