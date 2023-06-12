import type { RecurringTransaction, CSVTransaction } from "../types";
import { getTransactionValue } from "../csvUtils";

// summary: dep
export const getRecurringTransaction = (
  recurringTransactions: RecurringTransaction[],
  curTransaction: CSVTransaction
): number => {
  return recurringTransactions.findIndex((recTransaction, index) => {
    if (
      getTransactionValue(curTransaction, "description")
        .toLowerCase()
        .includes(recTransaction.description.toLowerCase())
    ) {
      return true;
    }
    return false;
  });
};
