export interface RecurringTransaction {
  description: string;
  estimatedAmount: number;
  estimatedDayNumber: number;
  label: string;
  isPaid: boolean;
  actualAmount: number;
  actualDate: string;
}
