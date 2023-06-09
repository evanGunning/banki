import type { CCTransaction } from "../types";
import { getTransactionValue } from "./getTransactionValue";

export const getCategoryForTransaction = (
  transaction: CCTransaction
): string => {
  return getTransactionValue(transaction, "category");
};
