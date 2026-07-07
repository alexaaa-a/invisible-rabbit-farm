import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/layout/page-header';
import { PageScroll } from '@/components/layout/page-scroll';
import { Stagger, StaggerItem } from '@/components/motion/fade-in';
import { useFarmAnalysis } from '@/hooks/useFarmAnalysis';
import { useEvents } from '@/hooks/useEvents';
import { PAGE_LABELS } from '@/lib/labels';
import { SignalsList } from './components/SignalsList';

export function SignalsPage() {
  const analysis = useFarmAnalysis();
  const location = useLocation();
  const {
    events,
    highlightedEventId,
    addEvent,
    updateEvent,
    toggleEvent,
    deleteEvent,
    setHighlightedEvent,
  } = useEvents();

  useEffect(() => {
    const state = location.state as { highlightEventId?: string } | null;
    if (state?.highlightEventId) {
      setHighlightedEvent(state.highlightEventId);
    }
  }, [location.state, setHighlightedEvent]);

  return (
    <PageScroll maxWidth="sm">
      <PageHeader
        label={PAGE_LABELS.signals}
        title="События"
        description="Редактируйте косвенные признаки активности — оценка пересчитывается мгновенно при каждом изменении."
      />

      <Stagger className="space-y-4" stagger={0.04}>
        <StaggerItem>
          <SignalsList
            events={events}
            contributions={analysis.contributions}
            highlightedEventId={highlightedEventId}
            onAdd={addEvent}
            onUpdate={updateEvent}
            onToggle={toggleEvent}
            onDelete={deleteEvent}
          />
        </StaggerItem>
      </Stagger>
    </PageScroll>
  );
}
