import type { BankiTransaction } from "../types";
import { config } from "../config";

const { categoryToDescriptionMap } = config;

const descriptionToCategoryMap: Record<string, string> = {};

Object.keys(categoryToDescriptionMap).forEach((category) => {
  categoryToDescriptionMap[category].forEach((description) => {
    descriptionToCategoryMap[description] = category;
  });
});

const descriptionsToMatch = Object.keys(descriptionToCategoryMap);

export const getCustomTransactionCategory = (
  transaction: BankiTransaction
): string => {
  // 1. check if description matches any keys in descriptionToCategoryMap; use the corresponding custom categories
  for (let i = 0; i < descriptionsToMatch.length; i++) {
    if (
      transaction.description
        .toLowerCase()
        .includes(descriptionsToMatch[i].toLowerCase())
    ) {
      return descriptionToCategoryMap[descriptionsToMatch[i]];
    }
  }

  // 2. if no custom category is found, use the default category
  return transaction.category;
};
