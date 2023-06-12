import type { RecurringTransaction, BankiTransaction } from "../types";

// summary: dep
export const getRecurringTransaction = (
  recurringTransactions: RecurringTransaction[],
  curTransaction: BankiTransaction
): number => {
  return recurringTransactions.findIndex((recTransaction, index) => {
    if (
      curTransaction.description
        .toLowerCase()
        .includes(recTransaction.description.toLowerCase())
    ) {
      return true;
    }
    return false;
  });
};
