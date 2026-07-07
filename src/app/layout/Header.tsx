import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcwIcon, SparklesIcon } from 'lucide-react';
import { LiveBadge } from '@/components/layout/live-badge';
import { Button } from '@/components/ui/button';
import {
  ConfirmDialog,
  ConfirmDialogAction,
} from '@/components/ui/confirm-dialog';
import { useEvents } from '@/hooks/useEvents';
import { useModelParams } from '@/hooks/useModelParams';

export function Header() {
  const { resetEvents } = useEvents();
  const { resetModel } = useModelParams();
  const [resetOpen, setResetOpen] = useState(false);

  const handleResetEvents = () => {
    resetEvents();
    setResetOpen(false);
  };

  const handleResetModel = () => {
    resetModel();
    setResetOpen(false);
  };

  const handleResetAll = () => {
    resetEvents();
    resetModel();
    setResetOpen(false);
  };

  return (
    <>
      <header className="glass-bar flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
            <span className="hidden sm:inline">RabbitOps · </span>
            Ферма невидимых кроликов
          </span>
          <LiveBadge className="hidden sm:inline-flex" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResetOpen(true)}
            className="h-8 text-xs"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Сброс</span>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link to="/worklog">
              <SparklesIcon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">AI Worklog</span>
            </Link>
          </Button>
        </div>
      </header>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Сбросить данные?"
        description="Выберите, что восстановить к начальным значениям. Действие нельзя отменить."
      >
        <ConfirmDialogAction label="Только события" onClick={handleResetEvents} />
        <ConfirmDialogAction label="Только модель" onClick={handleResetModel} />
        <ConfirmDialogAction
          label="Всё"
          variant="destructive"
          onClick={handleResetAll}
        />
        <ConfirmDialogAction
          label="Отмена"
          variant="ghost"
          onClick={() => setResetOpen(false)}
        />
      </ConfirmDialog>
    </>
  );
}
