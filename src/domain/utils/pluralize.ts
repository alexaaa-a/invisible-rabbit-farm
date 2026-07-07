export function pluralize(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const abs = Math.abs(count);
  const lastTwo = abs % 100;
  const lastOne = abs % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return `${count} ${many}`;
  if (lastOne === 1) return `${count} ${one}`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} ${few}`;
  return `${count} ${many}`;
}

export function formatRabbitCount(count: number): string {
  return pluralize(count, 'кролик', 'кролика', 'кроликов');
}
