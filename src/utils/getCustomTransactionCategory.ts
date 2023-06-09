import type { CCTransaction } from "../types";
import { getTransactionValue } from "./getTransactionValue";
import { config } from "../config";

const { descriptionToCategoryMap } = config;
const descriptionsToMatch = Object.keys(descriptionToCategoryMap);

export const getCustomTransactionCategory = (
  transaction: CCTransaction
): string => {
  // 1. check if description matches any keys in descriptionToCategoryMap; use the corresponding custom categories
  for (let i = 0; i < descriptionsToMatch.length; i++) {
    if (
      getTransactionValue(transaction, "description")
        .toLowerCase()
        .includes(descriptionsToMatch[i].toLowerCase())
    ) {
      return descriptionToCategoryMap[descriptionsToMatch[i]];
    }
  }

  // 2. if no custom category is found, use the default category
  return getTransactionValue(transaction, "category");
};
