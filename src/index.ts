import { analyzeCCStatement } from "./analyzeCCStatement";

const args = process.argv.slice(2);
const dirPath = args[0];

if (dirPath === undefined) {
  console.log("Must provide a directory path to statements.");
} else {
  console.log("Analyzing statements...");

  const statement2665 =
    "statements/may23/Chase2665_Activity20230501_20230531_20230607.CSV";

  const statement8225 =
    "statements/may23/Chase8225_Activity20230501_20230531_20230607.CSV";

  // void analyzeCCStatement(statementPath);
  void analyzeCCStatement(dirPath);
}
