import { analyzeCCStatement } from "./analyzeCCStatement";

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

void analyzeCCStatement(statementPath);
