import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { EVENT_TYPES, getEventLabel } from '@/domain';
import type { EventType, FarmEvent } from '@/types';
import { DashboardCard } from './DashboardCard';

interface TimelineCardProps {
  events: FarmEvent[];
}

const EVENT_COLORS: Record<EventType, string> = {
  footprints: 'var(--color-chart-1)',
  missing_carrot: 'var(--color-chart-3)',
  motion_sensor: 'var(--color-chart-2)',
  new_hole: 'var(--color-chart-5)',
  rustle_detected: 'var(--color-chart-4)',
};

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

interface TimelineTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      time: string;
      intensity: number;
      label: string;
      location: string;
      count: number;
    };
  }>;
}

function TimelineTooltip({ active, payload }: TimelineTooltipProps) {
  if (!active || !payload?.[0]) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-md border border-border/80 bg-card px-3 py-2 shadow-sm">
      <p className="text-xs font-medium">{point.label}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {point.location} · {point.time}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        интенсивность {point.intensity} · количество {point.count}
      </p>
    </div>
  );
}

export function TimelineCard({ events }: TimelineCardProps) {
  const chartData = [...events]
    .filter((event) => event.enabled)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
    .map((event) => ({
      time: event.time,
      minutes: timeToMinutes(event.time),
      intensity: event.intensity,
      count: event.count,
      label: getEventLabel(event.event),
      location: event.location,
      eventType: event.event,
      color: EVENT_COLORS[event.event],
    }));

  return (
    <DashboardCard
      title="Лента событий"
      description="Интенсивность по времени, цвет — тип события"
      contentClassName="pt-2"
    >
      <div className="mb-3 flex flex-wrap gap-3">
        {EVENT_TYPES.map((eventType) => (
          <div key={eventType} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: EVENT_COLORS[eventType] }}
            />
            {getEventLabel(eventType)}
          </div>
        ))}
      </div>

      <div className="h-52 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Нет событий для выбранной зоны</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
              />
              <XAxis
                type="number"
                dataKey="minutes"
                domain={['dataMin - 15', 'dataMax + 15']}
                tickFormatter={(value) => {
                  const hours = Math.floor(value / 60);
                  const mins = value % 60;
                  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
                }}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                dy={8}
              />
              <YAxis
                type="number"
                dataKey="intensity"
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                width={28}
              />
              <ZAxis type="number" dataKey="count" range={[40, 160]} />
              <Tooltip content={<TimelineTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={chartData}>
                {chartData.map((point) => (
                  <Cell key={`${point.time}-${point.eventType}`} fill={point.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardCard>
  );
}
