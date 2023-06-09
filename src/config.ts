import { readFileSync } from "fs";

const configPath = ".analyzerrc.json";

interface AnalyzerConfig {
  // if a transaction description contains any of these substrings, it will be ignored
  ignoredTransactionDescriptionSubstrs: string[];
  // this set of keys will be used, in order, to determine how to read description values from provided CSVs
  transactionDescriptionKey: string;
}

const defaultConfig: AnalyzerConfig = {
  ignoredTransactionDescriptionSubstrs: [],
  transactionDescriptionKey: "Description",
};

let computedConfig: AnalyzerConfig;
try {
  computedConfig = {
    ...defaultConfig,
    ...JSON.parse(readFileSync(configPath, "utf-8")),
  };
  console.log("loading .analyzerrc.json settings...");
} catch (e) {
  computedConfig = defaultConfig;
}

// console.log(computedConfig);

export const config = computedConfig;
