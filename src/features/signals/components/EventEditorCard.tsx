import { useState } from 'react';
import { ChevronDownIcon, Trash2Icon } from 'lucide-react';
import { getEventLabel } from '@/domain';
import { Button } from '@/components/ui/button';
import {
  ConfirmDialog,
  ConfirmDialogAction,
} from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { InfoTooltip } from '@/components/ui/tooltip';
import { CONTRIBUTION_LABELS } from '@/lib/labels';
import { cn } from '@/lib/cn';
import type { FarmEvent } from '@/types';
import { CountControl, IntensityControl } from './EventControls';
import { EventTypeSelect, LocationSelect } from './EventSelects';

interface EventEditorCardProps {
  event: FarmEvent;
  isHighlighted: boolean;
  highlightedField?: 'intensity' | 'count' | null;
  contributionPercent?: number;
  effectivePercent?: number;
  onUpdate: (patch: Partial<FarmEvent>) => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function EventEditorCard({
  event,
  isHighlighted,
  highlightedField,
  contributionPercent,
  effectivePercent,
  onUpdate,
  onToggle,
  onDelete,
}: EventEditorCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <article
        className={cn(
          'surface-card overflow-hidden transition-all duration-300',
          isHighlighted && 'ring-2 ring-foreground/15 ring-offset-2',
          !event.enabled && 'opacity-60',
          'hover:shadow-md',
        )}
      >
      <div className="p-4 sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">{getEventLabel(event.event)}</p>
            <button
              type="button"
              onClick={() => setDetailsOpen((open) => !open)}
              className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <ChevronDownIcon
                className={cn('h-3 w-3 transition-transform', detailsOpen && 'rotate-180')}
              />
              Подробнее
            </button>
            {detailsOpen ? (
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{event.id}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">Активно</span>
              <Switch checked={event.enabled} onCheckedChange={onToggle} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Удалить событие</span>
            </Button>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Тип</label>
            <EventTypeSelect
              value={event.event}
              onChange={(value) => onUpdate({ event: value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Локация</label>
            <LocationSelect
              value={event.location}
              onChange={(value) => onUpdate({ location: value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Время</label>
            <Input
              type="time"
              value={event.time}
              disabled={!event.enabled}
              onChange={(e) => onUpdate({ time: e.target.value })}
              className="h-9"
            />
          </div>
          <div className="flex items-end">
            <dl className="grid w-full grid-cols-2 gap-2 rounded-md bg-muted/40 px-3 py-2">
              <div>
                <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {CONTRIBUTION_LABELS.direct}
                  <InfoTooltip content={CONTRIBUTION_LABELS.directHint} />
                </dt>
                <dd className="text-sm font-semibold tabular-nums">
                  {contributionPercent !== undefined ? `${contributionPercent}%` : '—'}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {CONTRIBUTION_LABELS.effective}
                  <InfoTooltip content={CONTRIBUTION_LABELS.effectiveHint} />
                </dt>
                <dd className="text-sm font-semibold tabular-nums">
                  {effectivePercent !== undefined ? `${effectivePercent}%` : '—'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div
            className={cn(
              'rounded-md transition-colors',
              highlightedField === 'count' && 'ring-2 ring-foreground/20 ring-offset-2',
            )}
          >
            <CountControl
              value={event.count}
              disabled={!event.enabled}
              onChange={(count) => onUpdate({ count })}
            />
          </div>
          <div
            className={cn(
              'rounded-md transition-colors',
              highlightedField === 'intensity' && 'ring-2 ring-foreground/20 ring-offset-2',
            )}
          >
            <IntensityControl
              value={event.intensity}
              disabled={!event.enabled}
              onChange={(intensity) => onUpdate({ intensity })}
            />
          </div>
        </div>
      </div>
      </article>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Удалить событие?"
        description={`«${getEventLabel(event.event)}» в «${event.location}» будет удалено без возможности восстановления.`}
      >
        <ConfirmDialogAction
          label="Удалить"
          variant="destructive"
          onClick={() => {
            onDelete();
            setDeleteOpen(false);
          }}
        />
        <ConfirmDialogAction
          label="Отмена"
          variant="ghost"
          onClick={() => setDeleteOpen(false)}
        />
      </ConfirmDialog>
    </>
  );
}
