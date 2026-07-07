export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatRange(range: [number, number]): string {
  return `${range[0]}–${range[1]}`;
}

export { pluralize, formatRabbitCount } from '@/domain/utils/pluralize';
