import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuitIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CodeIcon,
  FileTextIcon,
  GaugeIcon,
  LightbulbIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { PageScroll } from '@/components/layout/page-scroll';
import { cn } from '@/lib/cn';
import {
  WORKLOG_CHECKPOINTS,
  WORKLOG_SUMMARY,
  TAG_LABELS,
  TAG_STYLES,
  type WorklogCheckpoint,
  type CheckpointTag,
} from './worklogContent';

const PHASE_ICONS: Record<string, typeof SparklesIcon> = {
  'Старт': LightbulbIcon,
  'Движок': CodeIcon,
  'Интерфейс': GaugeIcon,
  'Объяснимость': BrainCircuitIcon,
  'UX-аудит': UserIcon,
  'Полировка': SparklesIcon,
  'Проверка': CheckCircle2Icon,
};

function SummaryBar() {
  const stats = [
    { label: 'Чекпоинтов', value: String(WORKLOG_SUMMARY.totalCheckpoints) },
    { label: 'Тестов', value: String(WORKLOG_SUMMARY.testsWritten) },
    { label: 'Файлов', value: `${WORKLOG_SUMMARY.filesChanged}+` },
    { label: 'Инструмент', value: 'Cursor + Claude' },
  ];

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent px-5 py-5">
        <p className="dashboard-label">Подход</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">
          {WORKLOG_SUMMARY.approach}
        </p>
      </div>
      <div className="grid gap-px bg-border/40 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card/90 px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-border/50 px-5 py-4">
        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
          <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600/80" />
          <span className="italic">{WORKLOG_SUMMARY.keyInsight}</span>
        </p>
      </div>
    </div>
  );
}

const ACCENT_COLORS: Record<string, string> = {
  prompt: 'border-l-sky-500/70',
  thinking: 'border-l-amber-500/70',
  decision: 'border-l-emerald-500/70',
  outcome: 'border-l-foreground/25',
};

function DetailBlock({
  icon: Icon,
  label,
  children,
  accent,
}: {
  icon: typeof SparklesIcon;
  label: string;
  children: ReactNode;
  accent: keyof typeof ACCENT_COLORS;
}) {
  return (
    <div className={cn('accent-block', ACCENT_COLORS[accent])}>
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{children}</p>
    </div>
  );
}
function TagBadge({ tag }: { tag: CheckpointTag }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset',
        TAG_STYLES[tag],
      )}
    >
      {TAG_LABELS[tag]}
    </span>
  );
}

function CheckpointCard({
  checkpoint,
  index,
  isOpen,
  onToggle,
}: {
  checkpoint: WorklogCheckpoint;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const PhaseIcon = PHASE_ICONS[checkpoint.phase] ?? SparklesIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4 sm:gap-6"
    >
      {/* Timeline line */}
      {index < WORKLOG_CHECKPOINTS.length - 1 ? (
        <span
          className="absolute left-[17px] top-12 h-[calc(100%-24px)] w-px bg-border/70 sm:left-[19px]"
          aria-hidden
        />
      ) : null}

      {/* Timeline dot */}
      <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-card shadow-sm">
        <PhaseIcon className="h-4 w-4 text-foreground/50" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-8">
        <button
          type="button"
          onClick={onToggle}
          className="group w-full text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {checkpoint.phase} · Шаг {index + 1}
              </p>
              <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground group-hover:text-foreground/80 sm:text-lg">
                {checkpoint.title}
              </h3>
            </div>
            <ChevronDownIcon
              className={cn(
                'mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {checkpoint.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </button>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                <DetailBlock icon={SparklesIcon} label="Запрос к AI" accent="prompt">
                  {checkpoint.prompt}
                </DetailBlock>
                <DetailBlock icon={LightbulbIcon} label="Ход мысли" accent="thinking">
                  {checkpoint.thinking}
                </DetailBlock>
                <DetailBlock icon={UserIcon} label="Мое решение" accent="decision">
                  {checkpoint.decision}
                </DetailBlock>
                <DetailBlock icon={CheckCircle2Icon} label="Результат" accent="outcome">
                  {checkpoint.outcome}
                </DetailBlock>

                <div className="flex flex-wrap gap-4 pt-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Затронутые файлы
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {checkpoint.files.map((file) => (
                        <span
                          key={file}
                          className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                        >
                          <FileTextIcon className="h-3 w-3" />
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                  {checkpoint.metrics ? (
                    <div className="shrink-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Метрики
                      </p>
                      <p className="mt-1.5 text-sm font-medium tabular-nums">
                        {checkpoint.metrics}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function AiWorklogPage() {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set([WORKLOG_CHECKPOINTS[0]?.id]),
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () =>
    setOpenIds(new Set(WORKLOG_CHECKPOINTS.map((cp) => cp.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <PageScroll maxWidth="sm">
        <PageHeader
          label="Журнал разработки"
          title="Как я работала с AI"
          description="7 чекпоинтов разработки с AI: что просила у нейросети, что приняла, что поправила руками и как проверила."
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Развернуть все
              </button>
              <span className="text-xs text-muted-foreground/40">·</span>
              <button
                type="button"
                onClick={collapseAll}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Свернуть
              </button>
            </div>
          }
        />

        <div className="space-y-6">
          <SummaryBar />

          <div className="pt-2">
            {WORKLOG_CHECKPOINTS.map((checkpoint, index) => (
              <CheckpointCard
                key={checkpoint.id}
                checkpoint={checkpoint}
                index={index}
                isOpen={openIds.has(checkpoint.id)}
                onToggle={() => toggle(checkpoint.id)}
              />
            ))}
          </div>
        </div>
    </PageScroll>
  );
}
