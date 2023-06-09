import type { CCTransaction } from "../types";
import { config } from "../config";

type TransactionKey = "description" | "amount" | "category";

export const getTransactionValue = (
  transaction: CCTransaction,
  key: TransactionKey
): string => {
  const keySet = config.transactionKeys[key];

  for (let i = 0; i < keySet.length; i++) {
    if (transaction[keySet[i]] !== undefined) {
      return transaction[keySet[i]];
    }
  }

  return "";
};
