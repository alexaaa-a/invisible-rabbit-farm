import { describe, expect, it } from 'vitest';
import { formatRabbitCount } from '@/domain/utils/pluralize';
import { DEFAULT_MODEL_PARAMS, runEstimator } from '@/domain';
import { SEED_EVENTS } from '@/data/seedEvents';
import type { FarmEvent } from '@/types';

describe('runEstimator', () => {
  it('returns expected estimate for seed data', () => {
    const result = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);

    expect(result.estimate).toBe(4);
    expect(result.range).toEqual([3, 5]);
    expect(result.confidence).toBeGreaterThanOrEqual(70);
    expect(result.confidenceLevel).toBe('high');
    expect(result.populationIndex).toBeGreaterThan(4);
  });

  it('ranks footprints as the top signal for seed data', () => {
    const result = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);

    expect(result.rankedSignals[0]?.eventId).toBe('evt_005');
    expect(result.rankedSignals[0]?.rank).toBe(1);
    expect(result.rankedSignals[0]?.directPercent).toBeGreaterThan(35);
  });

  it('returns contributions that sum to ~100% direct weight', () => {
    const result = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);
    const directSum = result.contributions.reduce(
      (total, item) => total + item.directPercent,
      0,
    );

    expect(directSum).toBeGreaterThan(99);
    expect(directSum).toBeLessThanOrEqual(100.1);
  });

  it('returns effective contributions that sum to ~100%', () => {
    const result = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);
    const effectiveSum = result.contributions.reduce(
      (total, item) => total + item.effectivePercent,
      0,
    );

    expect(effectiveSum).toBeGreaterThan(99);
    expect(effectiveSum).toBeLessThanOrEqual(100.1);
  });

  it('generates zone activity for all active locations', () => {
    const result = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);

    expect(result.zoneActivity).toHaveLength(4);
    expect(result.zoneActivity[0]?.location).toBe('Теплица');
    expect(result.zoneActivity.find((zone) => zone.location === 'Сарай')?.eventCount).toBe(2);
  });

  it('generates recommendations and insights', () => {
    const result = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);

    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.some((item) => item.priority === 'high')).toBe(true);
    expect(result.insights.length).toBeGreaterThan(0);
    expect(result.insights.length).toBeLessThanOrEqual(3);
  });

  it('returns empty result when no active events', () => {
    const disabledEvents = SEED_EVENTS.map((event) => ({ ...event, enabled: false }));
    const result = runEstimator(disabledEvents, DEFAULT_MODEL_PARAMS);

    expect(result.estimate).toBe(0);
    expect(result.confidence).toBe(0);
    expect(result.contributions).toHaveLength(0);
  });

  it('is deterministic for the same input', () => {
    const first = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);
    const second = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);

    expect(first).toEqual(second);
  });

  it('increases estimate when global sensitivity rises', () => {
    const base = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);
    const sensitive = runEstimator(SEED_EVENTS, {
      ...DEFAULT_MODEL_PARAMS,
      globalSensitivity: 2,
    });

    expect(sensitive.estimate).toBeGreaterThanOrEqual(base.estimate);
    expect(sensitive.populationIndex).toBeGreaterThan(base.populationIndex);
  });

  it('lowers confidence for a single sparse event', () => {
    const singleEvent: FarmEvent[] = [
      {
        id: 'evt_single',
        event: 'rustle_detected',
        location: 'Сарай',
        count: 1,
        intensity: 3,
        time: '09:00',
        enabled: true,
      },
    ];

    const result = runEstimator(singleEvent, DEFAULT_MODEL_PARAMS);

    expect(result.confidence).toBeLessThan(50);
    expect(result.confidenceLevel).toBe('low');
  });

  it('filters events below noise threshold', () => {
    const weakEvent: FarmEvent[] = [
      {
        id: 'evt_weak',
        event: 'rustle_detected',
        location: 'Сарай',
        count: 1,
        intensity: 1,
        time: '09:00',
        enabled: true,
      },
    ];

    const result = runEstimator(weakEvent, {
      ...DEFAULT_MODEL_PARAMS,
      noiseThreshold: 5,
    });

    expect(result.estimate).toBe(0);
    expect(result.contributions).toHaveLength(0);
  });

  it('builds explainability with summary, pipeline and weight hints', () => {
    const result = runEstimator(SEED_EVENTS, DEFAULT_MODEL_PARAMS);

    expect(result.explainability.summary).toContain(
      `Оценка ${formatRabbitCount(result.estimate)}`,
    );
    expect(result.explainability.steps.length).toBeGreaterThanOrEqual(3);
    expect(result.explainability.signals.length).toBe(result.contributions.length);
    expect(result.explainability.topDriverIds[0]).toBe('evt_005');
    expect(result.explainability.weightHints.length).toBeGreaterThan(0);
    expect(result.explainability.signals[0]?.factors.baseWeight).toBeGreaterThan(0);
  });
});
