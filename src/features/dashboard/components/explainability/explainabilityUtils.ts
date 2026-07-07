export function formatFactor(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function formatDelta(delta: number): string {
  if (delta === 0) {
    return '0';
  }
  return delta > 0 ? `+${delta}` : `${delta}`;
}
