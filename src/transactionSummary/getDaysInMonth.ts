export const getDaysInMonth = (month: number, year: number): number => {
  // Create a new Date object for the next month's first day
  const nextMonth = new Date(year, month, 1);

  // Subtract 1 day from the next month's first day
  nextMonth.setDate(nextMonth.getDate() - 1);

  // The resulting date will be the last day of the desired month
  return nextMonth.getDate();
};
