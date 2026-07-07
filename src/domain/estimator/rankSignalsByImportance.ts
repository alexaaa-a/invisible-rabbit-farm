import type { EventContribution, RankedSignal } from '@/types';

export function rankSignalsByImportance(
  contributions: EventContribution[],
): RankedSignal[] {
  return [...contributions]
    .sort((a, b) => {
      if (b.effectivePercent !== a.effectivePercent) {
        return b.effectivePercent - a.effectivePercent;
      }

      if (b.directPercent !== a.directPercent) {
        return b.directPercent - a.directPercent;
      }

      if (b.rawScore !== a.rawScore) {
        return b.rawScore - a.rawScore;
      }

      return a.eventId.localeCompare(b.eventId);
    })
    .map((contribution, index) => ({
      rank: index + 1,
      eventId: contribution.eventId,
      rawScore: contribution.rawScore,
      directPercent: contribution.directPercent,
      effectivePercent: contribution.effectivePercent,
    }));
}
