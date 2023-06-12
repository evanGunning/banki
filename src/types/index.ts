export type CCTransaction = Record<string, string>;

export interface RecurringTransaction {
  description: string;
  estimatedAmount: number;
  estimatedDayNumber: number;
  label: string;
  isPaid: boolean;
  actualAmount: number;
  actualDate: string;
}

export interface CategorySummary {
  amount: number;
  transactions: CCTransaction[];
}

export interface ProjectedPaycheck {
  description: string;
  label: string;
  estimatedAmount: number;
  frequencyInDays: number;
  paycheckTransactions: CCTransaction[];
}

// key: category name
export type ExpenseCategories = Record<string, CategorySummary>;

export interface TransactionSummary {
  expenseCategories: ExpenseCategories;
  recurringTransactions: RecurringTransaction[];
  net: number;
  unpaidRecurringEstimate: number;
  projectedPaychecks: ProjectedPaycheck[];
  projectedIncome: number;
}
