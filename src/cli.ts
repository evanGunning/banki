import { program } from "commander";
import { analyzeStatements } from "./analyzers/analyzeStatements";

export interface CLIOptions {
  dir: string;
  showTransactions: boolean;
}

const a: string = "a";
const b: number = a;
console.log(b);

program
  .requiredOption(
    "-d, --dir <dir>, Specify the directory where your statements are located"
  )
  .option("-s, --show-transactions, Show transactions for each category")
  .action((options) => {
    void analyzeStatements(options);
  });

program.parse(process.argv);
