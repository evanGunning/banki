import type { CCTransaction, RecurringTransaction } from "../types";
import type { CLIOptions } from "../cli";
import {
  logLineBreak,
  logFormattedLineItem,
  logFormattedRecurringTransaction,
  colWidth,
} from "../utils/consoleLogUtils";
import { findCSVsFromDirectory } from "../utils/findCSVsFromDirectory";
import { loadConcatenatedStatements } from "../utils/loadConcatenatedStatements";
import { shouldIgnoreTransaction } from "../utils/shouldIgnoreTransaction";
import { getCustomTransactionCategory } from "../utils/getCustomTransactionCategory";
import { getTransactionValue } from "../utils/getTransactionValue";
import { config } from "../config";

interface CategorySummary {
  amount: number;
  transactions: CCTransaction[];
}

// The string key is the category name
type ExpenseCategories = Record<string, CategorySummary>;

interface TransactionSummary {
  expenseCategories: ExpenseCategories;
  recurringTransactions: RecurringTransaction[];
  net: number;
  unpaidRecurringEstimate: number;
}

const findRecurringTransaction = (
  recurringTransactions: RecurringTransaction[],
  curTransaction: CCTransaction
): number => {
  return recurringTransactions.findIndex((recTransaction, index) => {
    if (
      getTransactionValue(curTransaction, "description")
        .toLowerCase()
        .includes(recTransaction.description.toLowerCase())
    ) {
      return true;
    }
    return false;
  });
};

const computeTransactionSummary = (
  transactions: CCTransaction[]
): TransactionSummary => {
  const expenseCategories: ExpenseCategories = {};
  const recurringTransactions: RecurringTransaction[] =
    config.recurringTransactions.map((recTransaction) => {
      return {
        ...recTransaction,
        isPaid: false,
        actualAmount: 0,
        actualDate: "",
      };
    });

  transactions.forEach((transaction) => {
    const amount = Number(getTransactionValue(transaction, "amount"));
    const customCategory = getCustomTransactionCategory(transaction);

    if (!shouldIgnoreTransaction(transaction)) {
      // initialize category expense to 0 if undefined
      if (expenseCategories[customCategory] === undefined) {
        expenseCategories[customCategory] = {
          amount: 0,
          transactions: [],
        };
      }

      expenseCategories[customCategory].amount =
        expenseCategories[customCategory].amount + amount;
      expenseCategories[customCategory].transactions.push(transaction);

      const recurringTransactionIndex = findRecurringTransaction(
        recurringTransactions,
        transaction
      );
      if (recurringTransactionIndex !== -1) {
        recurringTransactions[recurringTransactionIndex].isPaid = true;
        recurringTransactions[recurringTransactionIndex].actualAmount = amount;
        recurringTransactions[recurringTransactionIndex].actualDate =
          getTransactionValue(transaction, "postDate");
      }
    }
  });

  const net = Object.keys(expenseCategories).reduce((acc, category) => {
    return acc + expenseCategories[category].amount;
  }, 0);

  const unpaidRecurringEstimate = recurringTransactions.reduce(
    (acc, recTransaction) => {
      if (!recTransaction.isPaid) {
        return acc + recTransaction.estimatedAmount;
      } else {
        return acc;
      }
    },
    0
  );

  return {
    net,
    expenseCategories,
    recurringTransactions,
    unpaidRecurringEstimate,
  };
};

const logCategorySummary = (
  transactionSummary: TransactionSummary,
  showTransactions: boolean
): void => {
  const { expenseCategories, net } = transactionSummary;
  console.log("Transaction Summary By Category");
  logLineBreak();
  Object.keys(expenseCategories)
    .sort()
    .forEach((category) => {
      const transactionCount = expenseCategories[category].transactions.length;
      logFormattedLineItem(
        `(${transactionCount}) ${category}`,
        expenseCategories[category].amount,
        true
      );

      if (showTransactions) {
        expenseCategories[category].transactions.forEach((transaction) => {
          logFormattedLineItem(
            `${"".padStart(4)}${getTransactionValue(
              transaction,
              "description"
            )}`,
            Number(getTransactionValue(transaction, "amount"))
          );
        });
      }
    });
  logLineBreak("small");
  logFormattedLineItem("Net", net, true);
  logLineBreak("small");
};

const logRecurringTransactionTableHeader = (): void => {
  console.log("Recurring Transactions");
  logLineBreak("large");
  console.log(
    `${"Label".padEnd(colWidth)}${"Amount".padStart(colWidth)}${"Day".padStart(
      colWidth
    )}`
  );
  logLineBreak("large");
};

const logRecurringTransactionSummary = (
  transactionSummary: TransactionSummary
): void => {
  const { recurringTransactions, unpaidRecurringEstimate, net } =
    transactionSummary;
  logRecurringTransactionTableHeader();
  recurringTransactions.forEach((recTransaction) => {
    logFormattedRecurringTransaction(recTransaction);
  });
  logLineBreak("large");
  logFormattedLineItem("Proj. Bills", -1 * unpaidRecurringEstimate, true);
  logFormattedLineItem("Proj. Income", 0, true); // TODO: add income
  logLineBreak("small");
  logFormattedLineItem("Proj. Net", net - unpaidRecurringEstimate, true);
  logLineBreak("large");
};

const logAnalysisSummary = (
  transactionSummary: TransactionSummary,
  showTransactions: boolean
): void => {
  console.log("\n");
  logCategorySummary(transactionSummary, showTransactions);
  console.log("\n");
  logRecurringTransactionSummary(transactionSummary);
};

export const analyzeStatements = async (
  cliOptions: CLIOptions
): Promise<void> => {
  const { dir, showTransactions } = cliOptions;
  const filePaths = await findCSVsFromDirectory(dir);
  if (filePaths.length === 0) {
    console.log("No statements provided.");
    return;
  }

  const transactions = await loadConcatenatedStatements(filePaths);
  const transactionSummary = computeTransactionSummary(transactions);
  logAnalysisSummary(transactionSummary, showTransactions);
};
