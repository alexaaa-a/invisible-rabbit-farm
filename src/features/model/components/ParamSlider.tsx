import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { clamp } from '@/lib/clamp';
import { cn } from '@/lib/cn';

interface ParamSliderProps {
  label: string;
  description?: string;
  value: number;
  defaultValue?: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function ParamSlider({
  label,
  description,
  value,
  defaultValue,
  min,
  max,
  step = 0.05,
  onChange,
  formatValue = (v) => v.toFixed(2),
}: ParamSliderProps) {
  const isModified = defaultValue !== undefined && value !== defaultValue;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label>{label}</Label>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="text-right">
          <span className="text-sm font-medium tabular-nums">{formatValue(value)}</span>
          {isModified ? (
            <p className="text-[10px] text-muted-foreground">
              базовое {formatValue(defaultValue!)}
            </p>
          ) : null}
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(clamp(next, min, max))}
        className={cn(isModified && '[&_[role=slider]]:ring-1 [&_[role=slider]]:ring-foreground/20')}
      />
    </div>
  );
}
