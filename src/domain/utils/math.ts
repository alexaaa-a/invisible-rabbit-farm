export function sumValues(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function toPercent(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return roundTo((part / total) * 100, 1);
}
