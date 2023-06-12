import type { ProjectedPaycheck, CCTransaction } from "../types";
import { getTransactionValue } from "../csvUtils";
import { config } from "../config";
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
    let mostRecentPaycheckTransaction: CCTransaction | undefined;

    const paycheckTransactions = paycheck.paycheckTransactions;
    paycheckTransactions.forEach((transaction) => {
      if (
        mostRecentPaycheckTransaction === undefined ||
        getTransactionValue(transaction, "postDate") >
          getTransactionValue(mostRecentPaycheckTransaction, "postDate")
      ) {
        mostRecentPaycheckTransaction = transaction;
      }
    });

    // For now, if no paycheck transactions are found, make one up
    if (mostRecentPaycheckTransaction === undefined) {
      mostRecentPaycheckTransaction = {
        [config.transactionKeys.postDate[0]]: "01/01/2023",
      };
    }

    // based on the computed mostRecentPaycheckTransaction, determine how many more
    // projectedPaychecks will be received this month. Add the total to projectedIncome
    if (mostRecentPaycheckTransaction !== undefined) {
      const [month, day, year] = getTransactionValue(
        mostRecentPaycheckTransaction,
        "postDate"
      ).split("/");
      const mostRecentPayDay = Number(day);
      const daysInMonth = getDaysInMonth(Number(month), Number(year));

      let nextPayDay = mostRecentPayDay + paycheck.frequencyInDays;
      while (nextPayDay <= daysInMonth) {
        projectedIncome += paycheck.estimatedAmount;
        nextPayDay += paycheck.frequencyInDays;
      }
    }
  });

  return projectedIncome;
};
