import fs from "fs";
import path from "path";

export const findCSVsFromDirectory = async (
  directoryPath: string
): Promise<string[]> => {
  const csvFiles = [];
  try {
    const directory = await fs.promises.opendir(directoryPath);
    for await (const file of directory) {
      if (file.isFile() && file.name.toLocaleLowerCase().endsWith(".csv")) {
        csvFiles.push(path.join(directoryPath, file.name));
      }
    }
  } catch (e) {
    console.log(`Error reading directory: ${directoryPath}`);
  }
  return csvFiles;
};
