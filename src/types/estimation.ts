import type { Location } from './events';
import type { ExplainabilityResult } from './explainability';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type ActivityLevel = 'low' | 'medium' | 'high';

export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface EventContribution {
  eventId: string;
  rawScore: number;
  directPercent: number;
  effectivePercent: number;
}

export interface RankedSignal {
  rank: number;
  eventId: string;
  rawScore: number;
  directPercent: number;
  effectivePercent: number;
}

export interface ZoneActivity {
  location: Location;
  zoneScore: number;
  eventCount: number;
  level: ActivityLevel;
}

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  action: string;
  reason: string;
  location?: Location;
  linkedEventIds: string[];
}

export interface EstimationResult {
  estimate: number;
  range: [number, number];
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  populationIndex: number;
  contributions: EventContribution[];
  rankedSignals: RankedSignal[];
  zoneActivity: ZoneActivity[];
  insights: string[];
  recommendations: Recommendation[];
  explainability: ExplainabilityResult;
}
