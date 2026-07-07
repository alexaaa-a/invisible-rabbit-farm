import { describe, expect, it } from 'vitest';
import { formatRabbitCount, pluralize } from './pluralize';

describe('pluralize', () => {
  it('uses genitive singular for 2–4', () => {
    expect(formatRabbitCount(2)).toBe('2 кролика');
    expect(formatRabbitCount(3)).toBe('3 кролика');
    expect(formatRabbitCount(4)).toBe('4 кролика');
  });

  it('uses nominative singular for 1 and 21', () => {
    expect(formatRabbitCount(1)).toBe('1 кролик');
    expect(formatRabbitCount(21)).toBe('21 кролик');
  });

  it('uses genitive plural for 5+ and teens', () => {
    expect(formatRabbitCount(5)).toBe('5 кроликов');
    expect(formatRabbitCount(11)).toBe('11 кроликов');
    expect(formatRabbitCount(14)).toBe('14 кроликов');
  });

  it('supports custom word forms', () => {
    expect(pluralize(4, 'событие', 'события', 'событий')).toBe('4 события');
  });
});
