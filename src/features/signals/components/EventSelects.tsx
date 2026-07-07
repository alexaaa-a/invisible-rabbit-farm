import { EVENT_TYPES, getEventLabel, LOCATIONS } from '@/domain';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventType, Location } from '@/types';

interface EventTypeSelectProps {
  value: EventType;
  onChange: (value: EventType) => void;
}

export function EventTypeSelect({ value, onChange }: EventTypeSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as EventType)}>
      <SelectTrigger className="h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {EVENT_TYPES.map((eventType) => (
          <SelectItem key={eventType} value={eventType}>
            {getEventLabel(eventType)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface LocationSelectProps {
  value: Location;
  onChange: (value: Location) => void;
}

export function LocationSelect({ value, onChange }: LocationSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as Location)}>
      <SelectTrigger className="h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCATIONS.map((location) => (
          <SelectItem key={location} value={location}>
            {location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
