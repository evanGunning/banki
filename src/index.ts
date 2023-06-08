import { analyzeCCStatement } from "./analyzeCCStatement";
import { logLineBreak } from "./consoleLogUtils";

console.log("Analyzing statements...");
logLineBreak();

const statement2665 =
  "statements/Chase2665_Activity20230501_20230531_20230607.CSV";

const statement8225 =
  "statements/Chase8225_Activity20230501_20230531_20230607.CSV";

// void analyzeCCStatement(statementPath);
void analyzeCCStatement([statement2665, statement8225]);
