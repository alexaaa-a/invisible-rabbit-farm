import { useMemo, useState } from 'react';
import { RotateCcwIcon } from 'lucide-react';
import { DEFAULT_MODEL_PARAMS, MODEL_PARAM_BOUNDS, runEstimator } from '@/domain';
import { PageHeader } from '@/components/layout/page-header';
import { PageScroll } from '@/components/layout/page-scroll';
import { Stagger, StaggerItem } from '@/components/motion/fade-in';
import { useFarmAnalysis } from '@/hooks/useFarmAnalysis';
import { useEvents } from '@/hooks/useEvents';
import { useModelParams } from '@/hooks/useModelParams';
import { PAGE_LABELS } from '@/lib/labels';
import { Button } from '@/components/ui/button';
import {
  ConfirmDialog,
  ConfirmDialogAction,
} from '@/components/ui/confirm-dialog';
import { DashboardCard } from '@/features/dashboard/components/DashboardCard';
import { EventWeightSliders } from './components/EventWeightSliders';
import { ModelExplainer } from './components/ModelExplainer';
import { ParamSlider } from './components/ParamSlider';

export function ModelPage() {
  const { modelParams, updateParam, resetModel } = useModelParams();
  const { events } = useEvents();
  const analysis = useFarmAnalysis();
  const [resetOpen, setResetOpen] = useState(false);

  const baselineEstimate = useMemo(
    () => runEstimator(events, DEFAULT_MODEL_PARAMS, { skipExplainability: true }).estimate,
    [events],
  );

  const estimateDelta = analysis.estimate - baselineEstimate;
  const deltaLabel =
    estimateDelta === 0
      ? 'без изменений от базовой модели'
      : `${estimateDelta > 0 ? '+' : ''}${estimateDelta} от базовой модели`;

  return (
    <>
      <PageScroll maxWidth="md">
        <PageHeader
          label={PAGE_LABELS.model}
          title="Модель"
          description="Настройте чувствительность и веса типов событий. Каждое изменение сразу отражается в оценке популяции."
          action={
            <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}>
              <RotateCcwIcon className="h-4 w-4" />
              Сброс
            </Button>
          }
        />

        <div className="surface-card mb-6 px-4 py-3.5 text-sm text-muted-foreground">
          Текущая оценка:{' '}
          <span className="font-semibold tabular-nums text-foreground">
            {analysis.estimate}
          </span>
          {' · '}
          <span className="tabular-nums">{deltaLabel}</span>
        </div>

        <Stagger className="grid gap-4 lg:grid-cols-2" stagger={0.05}>
          <StaggerItem>
            <DashboardCard
              title="Глобальные параметры"
              description="Общие настройки чувствительности модели"
            >
              <div className="space-y-6">
                <ParamSlider
                  label="Общая чувствительность"
                  description="Насколько сильно суммарная активность влияет на итоговую оценку"
                  value={modelParams.globalSensitivity}
                  defaultValue={DEFAULT_MODEL_PARAMS.globalSensitivity}
                  min={MODEL_PARAM_BOUNDS.globalSensitivity.min}
                  max={MODEL_PARAM_BOUNDS.globalSensitivity.max}
                  onChange={(value) => updateParam('globalSensitivity', value)}
                />
                <ParamSlider
                  label="Учёт второго сигнала в зоне"
                  description="Вклад второго и следующих событий в той же локации"
                  value={modelParams.zoneMergeFactor}
                  defaultValue={DEFAULT_MODEL_PARAMS.zoneMergeFactor}
                  min={MODEL_PARAM_BOUNDS.zoneMergeFactor.min}
                  max={MODEL_PARAM_BOUNDS.zoneMergeFactor.max}
                  onChange={(value) => updateParam('zoneMergeFactor', value)}
                />
                <ParamSlider
                  label="Максимальная уверенность"
                  value={modelParams.confidenceCap}
                  defaultValue={DEFAULT_MODEL_PARAMS.confidenceCap}
                  min={MODEL_PARAM_BOUNDS.confidenceCap.min}
                  max={MODEL_PARAM_BOUNDS.confidenceCap.max}
                  step={1}
                  formatValue={(v) => `${Math.round(v)}%`}
                  onChange={(value) => updateParam('confidenceCap', value)}
                />
                <ParamSlider
                  label="Игнорировать слабые сигналы"
                  description="События с силой ниже порога не участвуют в расчёте"
                  value={modelParams.noiseThreshold}
                  defaultValue={DEFAULT_MODEL_PARAMS.noiseThreshold}
                  min={MODEL_PARAM_BOUNDS.noiseThreshold.min}
                  max={MODEL_PARAM_BOUNDS.noiseThreshold.max}
                  step={0.1}
                  onChange={(value) => updateParam('noiseThreshold', value)}
                />
              </div>
            </DashboardCard>
          </StaggerItem>

          <StaggerItem className="space-y-4">
            <DashboardCard
              title="Веса типов событий"
              description="Множители базовой силы каждого типа"
              noPadding
            >
              <div className="p-5">
                <EventWeightSliders
                  eventWeights={modelParams.eventWeights}
                  defaultWeights={DEFAULT_MODEL_PARAMS.eventWeights}
                  onChange={(eventType, value) =>
                    updateParam('eventWeights', {
                      ...modelParams.eventWeights,
                      [eventType]: value,
                    })
                  }
                />
              </div>
            </DashboardCard>
            <ModelExplainer />
          </StaggerItem>
        </Stagger>
      </PageScroll>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Сбросить параметры модели?"
        description="Все веса и чувствительность вернутся к значениям по умолчанию."
      >
        <ConfirmDialogAction
          label="Сбросить"
          variant="destructive"
          onClick={() => {
            resetModel();
            setResetOpen(false);
          }}
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
