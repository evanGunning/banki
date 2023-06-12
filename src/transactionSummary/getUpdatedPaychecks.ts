import type { ProjectedPaycheck, CCTransaction } from "../types";
import { getTransactionValue } from "../csvUtils";

// summary: dep
export const getUpdatedPaychecks = (
  projectedPaychecks: ProjectedPaycheck[],
  transaction: CCTransaction
): ProjectedPaycheck[] => {
  const updatedPaychecks = [...projectedPaychecks];
  const paycheckIndex = updatedPaychecks.findIndex((paycheck) => {
    return getTransactionValue(transaction, "description")
      .toLowerCase()
      .includes(paycheck.description.toLowerCase());
  });

  if (paycheckIndex !== -1) {
    updatedPaychecks[paycheckIndex].paycheckTransactions.push(transaction);
  }

  return updatedPaychecks;
};
