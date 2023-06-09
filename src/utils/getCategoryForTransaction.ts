import type { CCTransaction } from "../types";

export const getCategoryForTransaction = (
  transaction: CCTransaction
): string => {
  const { Category, Type } = transaction;

  return Category === undefined ? Type : Category;
};
