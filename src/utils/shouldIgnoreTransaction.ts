import type { CCTransaction } from "../types";
import { getTransactionValue } from "./getTransactionValue";
import { config } from "../config";

const { ignoredTransactionDescriptionSubstrs } = config;

export const shouldIgnoreTransaction = (
  transaction: CCTransaction
): boolean => {
  try {
    const description = getTransactionValue(
      transaction,
      "description"
    ).toLowerCase();

    return ignoredTransactionDescriptionSubstrs.some((ignoredString) => {
      return description.toLowerCase().includes(ignoredString);
    });
  } catch (e) {
    // if no description exists for the given key, return false (don't skip the transaction)
    return false;
  }
};
