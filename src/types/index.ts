// generic type for a row in a statement CSV; could contain anything
export type CSVTransaction = Record<string, string>;

// serialized transaction for use inside Banki
export interface BankiTransaction {
  description: string;
  amount: number;
  category: string;
  postDate: Date;
}

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
  transactions: CSVTransaction[];
}

export interface ProjectedPaycheck {
  description: string;
  label: string;
  estimatedAmount: number;
  frequencyInDays: number;
  paycheckTransactions: CSVTransaction[];
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
