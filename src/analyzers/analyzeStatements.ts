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

interface ProjectedPaycheck {
  description: string;
  label: string;
  estimatedAmount: number;
  frequencyInDays: number;
  paycheckTransactions: CCTransaction[];
}

// The string key is the category name
type ExpenseCategories = Record<string, CategorySummary>;

interface TransactionSummary {
  expenseCategories: ExpenseCategories;
  recurringTransactions: RecurringTransaction[];
  net: number;
  unpaidRecurringEstimate: number;
  projectedPaychecks: ProjectedPaycheck[];
  projectedIncome: number;
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

const getUpdatedPaychecks = (
  projectedPaychecks: ProjectedPaycheck[],
  transaction: CCTransaction
): ProjectedPaycheck[] => {
  const updatedPaychecks = [...projectedPaychecks];
  const paycheckIndex = updatedPaychecks.findIndex((paycheck) => {
    return getTransactionValue(transaction, "description")
      .toLowerCase()
      .includes(paycheck.description.toLowerCase());
  });

  if (paycheckIndex !== -1) {
    updatedPaychecks[paycheckIndex].paycheckTransactions.push(transaction);
  }

  return updatedPaychecks;
};

const getDaysInMonth = (month: number, year: number): number => {
  // Create a new Date object for the next month's first day
  const nextMonth = new Date(year, month, 1);

  // Subtract 1 day from the next month's first day
  nextMonth.setDate(nextMonth.getDate() - 1);

  // The resulting date will be the last day of the desired month
  return nextMonth.getDate();
};

const getProjectedIncome = (
  projectedPaychecks: ProjectedPaycheck[]
): number => {
  // for each paycheck in projectedPaychecks, get the most recent paycheck transaction
  // compute how many additional projectedPaychecks will be received this month
  // add total to totalProjectedIncome
  let projectedIncome = 0;

  projectedPaychecks.forEach((paycheck) => {
    let mostRecentPaycheckTransaction: CCTransaction | undefined;

    const paycheckTransactions = paycheck.paycheckTransactions;
    paycheckTransactions.forEach((transaction) => {
      if (
        mostRecentPaycheckTransaction === undefined ||
        getTransactionValue(transaction, "postDate") >
          getTransactionValue(mostRecentPaycheckTransaction, "postDate")
      ) {
        mostRecentPaycheckTransaction = transaction;
      }
    });

    // For now, if no paycheck transactions are found, make one up
    if (mostRecentPaycheckTransaction === undefined) {
      mostRecentPaycheckTransaction = {
        [config.transactionKeys.postDate[0]]: "01/01/2023",
      };
    }

    // based on the computed mostRecentPaycheckTransaction, determine how many more
    // projectedPaychecks will be received this month. Add the total to projectedIncome
    if (mostRecentPaycheckTransaction !== undefined) {
      const [month, day, year] = getTransactionValue(
        mostRecentPaycheckTransaction,
        "postDate"
      ).split("/");
      const mostRecentPayDay = Number(day);
      const daysInMonth = getDaysInMonth(Number(month), Number(year));

      let nextPayDay = mostRecentPayDay + paycheck.frequencyInDays;
      while (nextPayDay <= daysInMonth) {
        projectedIncome += paycheck.estimatedAmount;
        nextPayDay += paycheck.frequencyInDays;
      }
    }
  });

  return projectedIncome;
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
  let projectedPaychecks: ProjectedPaycheck[] = config.paychecks.map(
    (paycheckConf) => {
      return {
        ...paycheckConf,
        paycheckTransactions: [],
      };
    }
  );

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

      // TODO: getUpdatedRecurringTransactions
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

      projectedPaychecks = getUpdatedPaychecks(projectedPaychecks, transaction);
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
    projectedPaychecks,
    projectedIncome: getProjectedIncome(projectedPaychecks),
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
  console.log("Projected Transactions");
  logLineBreak("large");
  console.log(
    `${"Label".padEnd(colWidth)}${"Amount".padStart(colWidth)}${"Day".padStart(
      colWidth
    )}`
  );
  logLineBreak("large");
};

const logPorjectionSummary = (transactionSummary: TransactionSummary): void => {
  const {
    recurringTransactions,
    unpaidRecurringEstimate,
    net,
    projectedIncome,
  } = transactionSummary;
  logRecurringTransactionTableHeader();
  recurringTransactions.forEach((recTransaction) => {
    logFormattedRecurringTransaction(recTransaction);
  });
  logLineBreak("large");
  logFormattedLineItem("Proj. Bills", -1 * unpaidRecurringEstimate, true);
  logFormattedLineItem("Proj. Income", projectedIncome, true); // TODO: add income
  logLineBreak("small");
  logFormattedLineItem(
    "Proj. Net",
    net + projectedIncome - unpaidRecurringEstimate,
    true
  );
  logLineBreak("large");
};

const logAnalysisSummary = (
  transactionSummary: TransactionSummary,
  showTransactions: boolean
): void => {
  console.log("\n");
  logCategorySummary(transactionSummary, showTransactions);
  console.log("\n");
  logPorjectionSummary(transactionSummary);
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
