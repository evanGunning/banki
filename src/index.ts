import { parseCSV } from "./parseCSV";
import { currencyFormatter } from "./currencyFormatter";

const lineBreak = "=======================";
const logLineBreak = (): void => {
  console.log(lineBreak);
};

console.log("Analyzing statements...");
logLineBreak();

const statementPath =
  "statements/Chase2665_Activity20230501_20230531_20230607.CSV";

console.log(`loading ${statementPath}...`);
logLineBreak();

interface CCTransaction {
  "Transaction Date": string;
  "Post Date": string;
  Description: string;
  Category: string;
  Type: string;
  Amount: string;
  Memo: string;
}

async function analyzeStatement(filePath: string): Promise<void> {
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

void analyzeStatement(statementPath);
