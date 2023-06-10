import { readFileSync } from "fs";

const configPath = ".bankirc.json";

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
  // if a transaction description matches one of the descriptions in this map, the corresponding key will be used as the category
  // the match is case-insensitive
  categoryToDescriptionMap: Record<string, string[]>;
}

const defaultConfig: AnalyzerConfig = {
  transactionKeys: {
    description: ["Description"],
    amount: ["Amount"],
    category: ["Category", "Type"],
  },
  ignoredTransactionDescriptionSubstrs: [],
  categoryToDescriptionMap: {},
};

let computedConfig: AnalyzerConfig;
try {
  computedConfig = {
    ...defaultConfig,
    ...JSON.parse(readFileSync(configPath, "utf-8")),
  };
  console.log("loading .analyzerrc.json settings...");
} catch (e) {
  console.log("no .analyzerrc.json found, using default settings");
  computedConfig = defaultConfig;
}

export const config = computedConfig;
