import fs from "fs";
import csv from "csv-parser";

export async function parseCSV<T>(filePath: string): Promise<T[]> {
  const results: T[] = [];

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
