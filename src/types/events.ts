export type EventType =
  | 'missing_carrot'
  | 'new_hole'
  | 'motion_sensor'
  | 'rustle_detected'
  | 'footprints';

export type Location = 'Огород' | 'Сарай' | 'Теплица' | 'У забора';

export type SignalClass = 'scale' | 'presence';

export interface FarmEvent {
  id: string;
  event: EventType;
  location: Location;
  count: number;
  intensity: number;
  time: string;
  enabled: boolean;
}
