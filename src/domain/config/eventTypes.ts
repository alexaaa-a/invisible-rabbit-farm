import type { EventType, Location, SignalClass } from '@/types';

export interface EventTypeConfig {
  label: string;
  baseWeight: number;
  signalClass: SignalClass;
}

export const EVENT_TYPES: readonly EventType[] = [
  'missing_carrot',
  'new_hole',
  'motion_sensor',
  'rustle_detected',
  'footprints',
] as const;

export const LOCATIONS: readonly Location[] = [
  'Огород',
  'Сарай',
  'Теплица',
  'У забора',
] as const;

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  footprints: {
    label: 'Следы',
    baseWeight: 1.0,
    signalClass: 'scale',
  },
  missing_carrot: {
    label: 'Исчезла морковка',
    baseWeight: 0.85,
    signalClass: 'scale',
  },
  motion_sensor: {
    label: 'Датчик движения',
    baseWeight: 0.75,
    signalClass: 'presence',
  },
  new_hole: {
    label: 'Новая ямка',
    baseWeight: 0.7,
    signalClass: 'presence',
  },
  rustle_detected: {
    label: 'Шорох',
    baseWeight: 0.55,
    signalClass: 'presence',
  },
};

export function getEventLabel(eventType: EventType): string {
  return EVENT_TYPE_CONFIG[eventType].label;
}

export function isScaleSignal(eventType: EventType): boolean {
  return EVENT_TYPE_CONFIG[eventType].signalClass === 'scale';
}
