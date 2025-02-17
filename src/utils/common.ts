enum Quote {
  SINGLE = "'",
  DOUBLE = '"'
}

export function ensureQuoted(value: string, quote = Quote.DOUBLE): string {
  const length = value.length;
  const hasDoubleQuotes =
    length > 1 &&
    value.startsWith(Quote.DOUBLE) &&
    value.endsWith(Quote.DOUBLE);
  const hasSingleQuotes =
    length > 1 &&
    value.startsWith(Quote.SINGLE) &&
    value.endsWith(Quote.SINGLE);
  return hasDoubleQuotes || hasSingleQuotes
    ? value
    : [quote, value, quote].join('');
}
