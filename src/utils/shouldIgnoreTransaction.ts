export const shouldIgnoreTransaction = (description: string): boolean => {
  const ignoredTransactionDescriptionSubstrs = [
    "zzzzzzzzzzzzzzzzzzzzzzz",
    // "payment thank you",
    // "payment to chase card",
  ];

  return ignoredTransactionDescriptionSubstrs.some((ignoredString) => {
    return description.toLowerCase().includes(ignoredString);
  });
};
