import { config } from "../config";

const { ignoredTransactionDescriptionSubstrs } = config;

export const shouldIgnoreTransaction = (description: string): boolean => {
  return ignoredTransactionDescriptionSubstrs.some((ignoredString) => {
    return description.toLowerCase().includes(ignoredString);
  });
};
