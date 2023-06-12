import type { BankiTransaction, CSVTransaction } from "../types";
import { getTransactionValue } from "./getTransactionValue";

export const serializeTransactions = (
  transactions: CSVTransaction[]
): BankiTransaction[] => {
  return transactions.map((transaction) => {
    const [month, day, year] = getTransactionValue(
      transaction,
      "postDate"
    ).split("/");

    return {
      description: getTransactionValue(transaction, "description"),
      amount: Number(getTransactionValue(transaction, "amount")),
      category: getTransactionValue(transaction, "category"),
      postDate: new Date(Number(`20${year}`), Number(month) - 1, Number(day)),
    };
  });
};
