export function ensureQuoted(value: string): string {
  const hasDoubleQuotes = value.startsWith('"') && value.endsWith('"');
  const hasSingleQuotes = value.startsWith("'") && value.endsWith("'");
  return hasDoubleQuotes || hasSingleQuotes ? value : `"${value}"`;
}
