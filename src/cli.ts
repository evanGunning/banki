import { program } from "commander";
import { analyzeStatements } from "./analyzers/analyzeStatements";

program
  .requiredOption(
    "-d, --dir <dir>, Specify the directory where your statements are located"
  )
  .action(({ dir }) => {
    void analyzeStatements(dir);
  });

program.parse(process.argv);
