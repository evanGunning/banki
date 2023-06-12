import type { ProjectedPaycheck, BankiTransaction } from "../types";
import { getDaysInMonth } from "./getDaysInMonth";

// summary: dep
export const getProjectedIncome = (
  projectedPaychecks: ProjectedPaycheck[]
): number => {
  // for each paycheck in projectedPaychecks, get the most recent paycheck transaction
  // compute how many additional projectedPaychecks will be received this month
  // add total to totalProjectedIncome
  let projectedIncome = 0;

  projectedPaychecks.forEach((paycheck) => {
    let mostRecentPaycheckTransaction: BankiTransaction | undefined;

    const paycheckTransactions = paycheck.paycheckTransactions;
    paycheckTransactions.forEach((transaction) => {
      if (
        mostRecentPaycheckTransaction === undefined ||
        transaction.postDate.getTime() >
          mostRecentPaycheckTransaction.postDate.getTime()
      ) {
        mostRecentPaycheckTransaction = transaction;
      }
    });

    // For now, if no paycheck transactions are found, make one up
    if (mostRecentPaycheckTransaction === undefined) {
      mostRecentPaycheckTransaction = {
        description: "",
        amount: 0,
        category: "",
        postDate: new Date(2023, 0, 1),
      };
    }

    // based on the computed mostRecentPaycheckTransaction, determine how many more
    // projectedPaychecks will be received this month. Add the total to projectedIncome
    if (mostRecentPaycheckTransaction !== undefined) {
      const mostRecentPayDay = mostRecentPaycheckTransaction.postDate.getDate();
      const daysInMonth = getDaysInMonth(
        mostRecentPaycheckTransaction.postDate.getMonth(),
        mostRecentPaycheckTransaction.postDate.getFullYear()
      );

      let nextPayDay = mostRecentPayDay + paycheck.frequencyInDays;
      while (nextPayDay <= daysInMonth) {
        projectedIncome += paycheck.estimatedAmount;
        nextPayDay += paycheck.frequencyInDays;
      }
    }
  });

  return projectedIncome;
};
