import { motion } from 'framer-motion';
import type { FarmEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { FilterIcon, XIcon } from 'lucide-react';

interface ZoneFilterBarProps {
  zone: FarmEvent['location'];
  onClear: () => void;
}

export function ZoneFilterBar({ zone, onClear }: ZoneFilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 px-4 py-3 shadow-sm backdrop-blur-sm"
    >
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <FilterIcon className="h-3.5 w-3.5" />
        Фильтр:{' '}
        <span className="font-medium text-foreground">«{zone}»</span>
      </p>
      <Button variant="ghost" size="sm" onClick={onClear} className="h-7 text-xs">
        <XIcon className="h-3.5 w-3.5" />
        Сбросить
      </Button>
    </motion.div>
  );
}

export function filterByZone<T extends { location?: FarmEvent['location'] }>(
  items: T[],
  zone: FarmEvent['location'] | null,
  getLocation?: (item: T) => FarmEvent['location'] | undefined,
): T[] {
  if (!zone) {
    return items;
  }

  return items.filter((item) => {
    const location = getLocation ? getLocation(item) : item.location;
    return location === zone;
  });
}

export function filterEventsByZone(
  events: FarmEvent[],
  zone: FarmEvent['location'] | null,
): FarmEvent[] {
  if (!zone) {
    return events;
  }
  return events.filter((event) => event.location === zone);
}
