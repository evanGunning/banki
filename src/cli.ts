import { program } from "commander";
import { banki } from "./banki";

export interface CLIOptions {
  dir: string;
  showTransactions: boolean;
}

let cliOptions: CLIOptions;
export const getCLIOptions = (): CLIOptions => cliOptions;

program
  .requiredOption(
    "-d, --dir <dir>, Specify the directory where your statements are located"
  )
  .option("-s, --show-transactions, Show transactions for each category")
  .action((options) => {
    cliOptions = options;
    void banki();
  });

program.parse(process.argv);
