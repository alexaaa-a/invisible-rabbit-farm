import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/layout/page-header';
import { PageScroll } from '@/components/layout/page-scroll';
import { Stagger, StaggerItem } from '@/components/motion/fade-in';
import { useFarmAnalysis } from '@/hooks/useFarmAnalysis';
import { useEvents } from '@/hooks/useEvents';
import { useFarmContext } from '@/state/FarmContext';
import type { Recommendation } from '@/types';
import { pluralize } from '@/lib/format';
import { deriveRiskLevel } from './utils/deriveRiskLevel';
import { DashboardHero } from './components/DashboardHero';
import { OverviewCard } from './components/OverviewCard';
import { RecommendationsCard } from './components/RecommendationsCard';
import { ExplainabilityPanel } from './components/explainability/ExplainabilityPanel';
import { TimelineCard } from './components/TimelineCard';
import { TopSignalsCard } from './components/TopSignalsCard';
import { ZoneFilterBar, filterByZone, filterEventsByZone } from './components/ZoneFilterBar';

export function DashboardPage() {
  const analysis = useFarmAnalysis();
  const { events, setHighlightedEvent } = useEvents();
  const { state, dispatch } = useFarmContext();
  const navigate = useNavigate();

  const activeEvents = events.filter((event) => event.enabled);
  const risk = deriveRiskLevel(analysis);
  const selectedZone = state.ui.selectedZone;

  const filteredEvents = filterEventsByZone(events, selectedZone);
  const filteredRecommendations = filterByZone(
    analysis.recommendations,
    selectedZone,
    (item) => item.location,
  );

  const handleRecommendationSelect = (recommendation: Recommendation) => {
    const firstLinked = recommendation.linkedEventIds[0];
    if (!firstLinked) {
      return;
    }

    const linkedEvent = events.find((event) => event.id === firstLinked);
    const field =
      linkedEvent?.event === 'new_hole'
        ? 'intensity'
        : linkedEvent?.event === 'missing_carrot'
          ? 'count'
          : null;

    setHighlightedEvent(firstLinked, field);
    navigate('/signals');
  };

  if (activeEvents.length === 0) {
    return (
      <PageScroll>
        <PageHeader
          label="Аналитика"
          title="Дашборд"
          description="Оценка популяции кроликов по косвенным сигналам с полной объяснимостью расчёта."
        />
        <EmptyState
          title="Нет активных событий"
          description="Включите события на вкладке «События» или восстановите демо-данные, чтобы увидеть аналитику."
          action={
            <Button asChild size="sm">
              <Link to="/signals">Перейти к событиям</Link>
            </Button>
          }
        />
      </PageScroll>
    );
  }

  return (
    <PageScroll>
      <PageHeader
          label="Аналитика"
          title="Дашборд"
          description={`Оценка в реальном времени по ${pluralize(activeEvents.length, 'активному событию', 'активным событиям', 'активным событиям')}.`}
        />

        <DashboardHero analysis={analysis} risk={risk} />

        <Stagger className="space-y-4" stagger={0.05}>
          {selectedZone ? (
            <StaggerItem>
              <ZoneFilterBar
                zone={selectedZone}
                onClear={() =>
                  dispatch({ type: 'SET_SELECTED_ZONE', payload: { zone: null } })
                }
              />
            </StaggerItem>
          ) : null}

          <StaggerItem>
            <ExplainabilityPanel explainability={analysis.explainability} />
          </StaggerItem>

          <StaggerItem>
            <div className="grid gap-4 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <OverviewCard
                  analysis={analysis}
                  activeEventCount={activeEvents.length}
                  selectedZone={selectedZone}
                  onSelectZone={(zone) =>
                    dispatch({ type: 'SET_SELECTED_ZONE', payload: { zone } })
                  }
                />
              </div>
              <div className="lg:col-span-2">
                <TopSignalsCard
                  rankedSignals={analysis.rankedSignals}
                  events={filteredEvents}
                  highlightedEventId={state.ui.highlightedEventId}
                  onSelectEvent={(id) => setHighlightedEvent(id)}
                />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <TimelineCard events={filteredEvents} />
          </StaggerItem>

          <StaggerItem>
            <RecommendationsCard
              recommendations={filteredRecommendations}
              onSelectRecommendation={handleRecommendationSelect}
            />
          </StaggerItem>
        </Stagger>
    </PageScroll>
  );
}
