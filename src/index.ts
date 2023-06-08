import fs from "fs";
import csv from "csv-parser";

console.log("Analyzing statements...");
console.log("=======================");

async function parseCSV(filePath: string): Promise<string[]> {
  const results: string[] = [];

  return await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function analyzeStatement(filePath: string): Promise<void> {
  const parsedStatement = await parseCSV(filePath);

  console.log(parsedStatement);
}

const statementPath =
  "statements/Chase2665_Activity20230501_20230531_20230607.CSV";

void analyzeStatement(statementPath);
