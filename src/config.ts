import { readFileSync } from "fs";

const configPath = ".bankirc.json";

interface RecurringTransactionRc {
  description: string;
  estimatedAmount: number;
  estimatedDayNumber: number;
  label: string;
}

interface PaycheckRc {
  description: string;
  label: string;
  estimatedAmount: number;
  frequencyInDays: number;
}

interface AnalyzerConfig {
  // if a transaction description contains any of these substrings, it will be ignored
  ignoredTransactionDescriptionSubstrs: string[];
  // this set of keys will be used, in order, to determine how to read description values from provided CSVs
  // the first key that results in a non-empty value will be used for the corresponding concept
  transactionKeys: {
    description: string[];
    amount: string[];
    category: string[];
    postDate: string[];
  };
  // if a transaction description matches one of the descriptions in this map, the corresponding key will be used as the category
  // the match is case-insensitive
  categoryToDescriptionMap: Record<string, string[]>;
  // if a transaction description matches one of the descriptions in this map, whether or not the transactions
  // is paid will be remembered and unpaid transactions will be included in a projection of end of month costs
  recurringTransactions: RecurringTransactionRc[];
  paychecks: PaycheckRc[];
}

const defaultConfig: AnalyzerConfig = {
  transactionKeys: {
    description: ["Description"],
    amount: ["Amount"],
    category: ["Category", "Type"],
    postDate: ["Post Date", "Posting Date"],
  },
  ignoredTransactionDescriptionSubstrs: [],
  categoryToDescriptionMap: {},
  recurringTransactions: [],
  paychecks: [],
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
