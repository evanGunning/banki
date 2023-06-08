import { analyzeStatements } from "./analyzers/analyzeStatements";

const args = process.argv.slice(2);
const dirPath = args[0];

if (dirPath === undefined) {
  console.log("Must provide a directory path to statements.");
} else {
  console.log("Analyzing statements...");

  void analyzeStatements(dirPath);
}
