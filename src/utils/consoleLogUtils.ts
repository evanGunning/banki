export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const logLineBreak = (): void => {
  console.log("".padEnd(36, "-"));
};

export const logFormattedLineItem = (
  label: string,
  currencyVal: number
): void => {
  console.log(
    `${label.concat(":").padEnd(20)} ${currencyFormatter
      .format(currencyVal)
      .padStart(15)}`
  );
};
