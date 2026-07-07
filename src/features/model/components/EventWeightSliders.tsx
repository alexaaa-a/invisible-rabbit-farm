import { EVENT_TYPES, getEventLabel, MODEL_PARAM_BOUNDS } from '@/domain';
import type { EventType, ModelParams } from '@/types';
import { ParamSlider } from './ParamSlider';

interface EventWeightSlidersProps {
  eventWeights: ModelParams['eventWeights'];
  defaultWeights?: ModelParams['eventWeights'];
  onChange: (eventType: EventType, value: number) => void;
}

export function EventWeightSliders({
  eventWeights,
  defaultWeights,
  onChange,
}: EventWeightSlidersProps) {
  const bounds = MODEL_PARAM_BOUNDS.eventWeight;

  return (
    <div className="space-y-5">
      {EVENT_TYPES.map((eventType) => (
        <ParamSlider
          key={eventType}
          label={getEventLabel(eventType)}
          value={eventWeights[eventType]}
          defaultValue={defaultWeights?.[eventType]}
          min={bounds.min}
          max={bounds.max}
          step={0.05}
          onChange={(value) => onChange(eventType, value)}
        />
      ))}
    </div>
  );
}
