import { parseCSV } from "./parseCSV";
import { currencyFormatter } from "./currencyFormatter";

interface CCTransaction {
  "Transaction Date": string;
  "Post Date": string;
  Description: string;
  Category: string;
  Type: string;
  Amount: string;
  Memo: string;
}

export async function analyzeCCStatement(filePath: string): Promise<void> {
  const parsedStatement: CCTransaction[] = await parseCSV<CCTransaction>(
    filePath
  );

  let expenses = 0;
  parsedStatement.forEach((transaction) => {
    const amount = Number(transaction.Amount);

    if (
      !transaction.Description.toLocaleLowerCase().includes("payment thank you")
    ) {
      expenses += amount;
    }
  });

  console.log(
    `Total expenses: ${currencyFormatter.format(expenses).padStart(15)}`
  );
}
