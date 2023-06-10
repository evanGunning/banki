import { program } from "commander";
import { analyzeStatements } from "./analyzers/analyzeStatements";

const unused = "";

program
  .requiredOption(
    "-d, --dir <dir>, Specify the directory where your statements are located"
  )
  .action((options) => {
    const dirPath = options.dir;

    console.log(options);
    if (dirPath === undefined) {
      console.log("Must provide a directory path to statements.");
    } else {
      void analyzeStatements(dirPath);
    }
  });

program.parse(process.argv);
