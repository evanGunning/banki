import type { RecurringTransaction } from "../types";
import chalk from "chalk";

const maxLabelLength = 18;
const colWidth = 20;

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type LineBreakSize = "small" | "large";

export const logLineBreak = (size: LineBreakSize = "small"): void => {
  if (size === "small") {
    console.log("".padEnd(40, "-"));
  } else if (size === "large") {
    console.log("".padEnd(60, "-"));
  }
};

// Logs a line in the format of
// "label:          currencyVal"
// Intended for use in logging a summary of a transaction by category
export const logFormattedLineItem = (
  label: string,
  currencyVal: number
): void => {
  console.log(
    `${label
      .concat(":")
      .slice(0, maxLabelLength)
      .padEnd(colWidth)}${currencyFormatter
      .format(currencyVal)
      .padStart(colWidth)}`
  );
};

export const logRecurringTransactionTableHeader = (): void => {
  logLineBreak("large");
  console.log("Recurring Transactions");
  logLineBreak("large");
  console.log(
    `${"Label".padEnd(20)}${"Amount".padStart(20)}${"Day".padStart(20)}`
  );
  logLineBreak("large");
};

export const logFormattedRecurringTransaction = (
  recTransaction: RecurringTransaction
): void => {
  const {
    label,
    isPaid,
    estimatedAmount,
    estimatedDayNumber,
    actualAmount,
    actualDate,
  } = recTransaction;

  if (isPaid) {
    console.log(
      chalk.green(
        `${label.slice(0, maxLabelLength).padEnd(colWidth)}${currencyFormatter
          .format(actualAmount)
          .padStart(colWidth)}${actualDate.padStart(colWidth)}`
      )
    );
  } else {
    console.log(
      chalk.red(
        `${label.slice(0, maxLabelLength).padEnd(colWidth)}${currencyFormatter
          .format(estimatedAmount)
          .padStart(colWidth)}${estimatedDayNumber
          .toString()
          .padStart(colWidth)}`
      )
    );
  }
};
