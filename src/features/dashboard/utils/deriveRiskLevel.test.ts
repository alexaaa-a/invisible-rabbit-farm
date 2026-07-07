import { describe, expect, it } from 'vitest';
import { EMPTY_ESTIMATION_RESULT, runEstimator, DEFAULT_MODEL_PARAMS } from '@/domain';
import { SEED_EVENTS } from '@/data/seedEvents';
import { deriveRiskLevel } from './deriveRiskLevel';

describe('deriveRiskLevel', () => {
  it('returns unknown risk when estimate is zero', () => {
    const risk = deriveRiskLevel(EMPTY_ESTIMATION_RESULT);

    expect(risk.level).toBe('unknown');
    expect(risk.label).toBe('Нет данных');
    expect(risk.description).toContain('невозможна');
  });

  it('returns high or critical risk for seed data', () => {
    const analysis = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);
    const risk = deriveRiskLevel(analysis);

    expect(analysis.estimate).toBeGreaterThan(0);
    expect(['high', 'critical']).toContain(risk.level);
  });

  it('does not treat low confidence as moderate when estimate is zero', () => {
    const result = {
      ...EMPTY_ESTIMATION_RESULT,
      confidenceLevel: 'low' as const,
    };

    const risk = deriveRiskLevel(result);

    expect(risk.level).toBe('unknown');
    expect(risk.level).not.toBe('moderate');
  });

  it('returns moderate for small non-zero estimate with low confidence', () => {
    const analysis = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);
    const risk = deriveRiskLevel({
      ...analysis,
      estimate: 2,
      confidenceLevel: 'low',
      recommendations: [],
      zoneActivity: [],
    });

    expect(risk.level).toBe('moderate');
  });
});
