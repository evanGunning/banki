import { readFileSync } from "fs";

const configPath = ".analyzerrc.json";

interface AnalyzerConfig {
  ignoredTransactionDescriptionSubstrs: string[];
}

const defaultConfig: AnalyzerConfig = {
  ignoredTransactionDescriptionSubstrs: [],
};

let computedConfig: AnalyzerConfig;
try {
  computedConfig = {
    ...defaultConfig,
    ...JSON.parse(readFileSync(configPath, "utf-8")),
  };
} catch (e) {
  computedConfig = defaultConfig;
}

console.log(computedConfig);

export const config = computedConfig;
