import type { ProjectedPaycheck, BankiTransaction } from "../types";

// summary: dep
export const getUpdatedPaychecks = (
  projectedPaychecks: ProjectedPaycheck[],
  transaction: BankiTransaction
): ProjectedPaycheck[] => {
  const updatedPaychecks = [...projectedPaychecks];
  const paycheckIndex = updatedPaychecks.findIndex((paycheck) => {
    return transaction.description
      .toLowerCase()
      .includes(paycheck.description.toLowerCase());
  });

  if (paycheckIndex !== -1) {
    updatedPaychecks[paycheckIndex].paycheckTransactions.push(transaction);
  }

  return updatedPaychecks;
};
