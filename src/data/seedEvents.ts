import type { FarmEvent } from '@/types';

export const SEED_EVENTS: FarmEvent[] = [
  {
    id: 'evt_001',
    event: 'missing_carrot',
    location: 'Огород',
    count: 5,
    intensity: 4,
    time: '08:30',
    enabled: true,
  },
  {
    id: 'evt_002',
    event: 'new_hole',
    location: 'У забора',
    count: 2,
    intensity: 7,
    time: '09:10',
    enabled: true,
  },
  {
    id: 'evt_003',
    event: 'motion_sensor',
    location: 'Сарай',
    count: 1,
    intensity: 8,
    time: '10:05',
    enabled: true,
  },
  {
    id: 'evt_004',
    event: 'rustle_detected',
    location: 'Сарай',
    count: 3,
    intensity: 5,
    time: '10:20',
    enabled: true,
  },
  {
    id: 'evt_005',
    event: 'footprints',
    location: 'Теплица',
    count: 6,
    intensity: 6,
    time: '11:45',
    enabled: true,
  },
];
