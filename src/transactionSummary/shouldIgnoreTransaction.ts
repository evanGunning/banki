import type { BankiTransaction } from "../types";
import { config } from "../config";

const { ignoredTransactionDescriptionSubstrs } = config;

export const shouldIgnoreTransaction = (
  transaction: BankiTransaction
): boolean => {
  try {
    const description = transaction.description.toLowerCase();

    return ignoredTransactionDescriptionSubstrs.some((ignoredString) => {
      return description.toLowerCase().includes(ignoredString);
    });
  } catch (e) {
    // if no description exists for the given key, return false (don't skip the transaction)
    return false;
  }
};
