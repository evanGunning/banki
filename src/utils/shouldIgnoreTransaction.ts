import type { CCTransaction } from "../types";
import { config } from "../config";

const { ignoredTransactionDescriptionSubstrs } = config;

export const shouldIgnoreTransaction = (
  transaction: CCTransaction
): boolean => {
  try {
    const description =
      transaction[config.transactionDescriptionKey].toLowerCase();

    return ignoredTransactionDescriptionSubstrs.some((ignoredString) => {
      return description.toLowerCase().includes(ignoredString);
    });
  } catch (e) {
    // if no description exists for the given key, return false (don't skip the transaction)
    return false;
  }
};
