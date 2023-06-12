import type { CSVTransaction } from "../types";
import { config } from "../config";

type TransactionKey = "description" | "amount" | "category" | "postDate";

export const getTransactionValue = (
  transaction: CSVTransaction,
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
