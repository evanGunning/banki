import type { RecurringTransaction } from "../types";
import chalk from "chalk";

export const colWidth = 30;

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type LineBreakSize = "small" | "large";

export const logLineBreak = (size: LineBreakSize = "small"): void => {
  if (size === "small") {
    console.log("".padEnd(colWidth * 2, "-"));
  } else if (size === "large") {
    console.log("".padEnd(colWidth * 3, "-"));
  }
};

// Logs a line in the format of
// "label:          currencyVal"
// Intended for use in logging a summary of a transaction by category
export const logFormattedLineItem = (
  label: string,
  currencyVal: number,
  useColor: boolean = false
): void => {
  const logStr = `${label
    .concat(":")
    .slice(0, colWidth)
    .padEnd(colWidth)}${currencyFormatter
    .format(currencyVal)
    .padStart(colWidth)}`;

  if (useColor) {
    if (currencyVal < 0) {
      console.log(chalk.red(logStr));
    } else {
      console.log(chalk.green(logStr));
    }
  } else {
    console.log(logStr);
  }
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
        `${label.slice(0, colWidth).padEnd(colWidth)}${currencyFormatter
          .format(-1 * actualAmount)
          .padStart(colWidth)}${actualDate.padStart(colWidth)}`
      )
    );
  } else {
    console.log(
      chalk.red(
        `${label.slice(0, colWidth).padEnd(colWidth)}${currencyFormatter
          .format(estimatedAmount)
          .padStart(colWidth)}${estimatedDayNumber
          .toString()
          .padStart(colWidth)}`
      )
    );
  }
};
