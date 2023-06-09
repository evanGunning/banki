import { readFileSync } from "fs";

const configPath = ".analyzerrc.json";

interface AnalyzerConfig {
  // if a transaction description contains any of these substrings, it will be ignored
  ignoredTransactionDescriptionSubstrs: string[];
  // this set of keys will be used, in order, to determine how to read description values from provided CSVs
  // the first key that results in a non-empty value will be used for the corresponding concept
  transactionKeys: {
    description: string[];
    amount: string[];
    category: string[];
  };
}

const defaultConfig: AnalyzerConfig = {
  ignoredTransactionDescriptionSubstrs: [],
  transactionKeys: {
    description: ["Description"],
    amount: ["Amount"],
    category: ["Category", "Type"],
  },
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
