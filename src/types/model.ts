import type { EventType } from './events';

export interface ModelParams {
  globalSensitivity: number;
  eventWeights: Record<EventType, number>;
  zoneMergeFactor: number;
  confidenceCap: number;
  noiseThreshold: number;
}
