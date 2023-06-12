import { program } from "commander";
import { banki } from "./banki";

export interface CLIOptions {
  dir: string;
  showTransactions: boolean;
}

program
  .requiredOption(
    "-d, --dir <dir>, Specify the directory where your statements are located"
  )
  .option("-s, --show-transactions, Show transactions for each category")
  .action((options) => {
    void banki(options);
  });

program.parse(process.argv);
