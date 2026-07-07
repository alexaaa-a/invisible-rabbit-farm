import { INTENSITY_MAX, INTENSITY_MIN } from '@/domain/config';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { clamp } from '@/lib/clamp';
import { COUNT_SLIDER_MAX } from '@/lib/sanitizeEvent';

interface IntensityControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function IntensityControl({ value, onChange, disabled }: IntensityControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Интенсивность</Label>
        <span className="text-xs font-semibold tabular-nums">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={INTENSITY_MIN}
        max={INTENSITY_MAX}
        step={1}
        disabled={disabled}
        onValueChange={([next]) => onChange(clamp(next, INTENSITY_MIN, INTENSITY_MAX))}
      />
    </div>
  );
}

interface CountControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function CountControl({ value, onChange, disabled }: CountControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Количество</Label>
        <Input
          type="number"
          min={1}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            if (Number.isFinite(parsed) && parsed >= 1) {
              onChange(parsed);
            }
          }}
          className="h-7 w-16 px-2 text-right text-xs tabular-nums"
        />
      </div>
      <Slider
        value={[Math.min(value, COUNT_SLIDER_MAX)]}
        min={1}
        max={COUNT_SLIDER_MAX}
        step={1}
        disabled={disabled}
        onValueChange={([next]) => onChange(Math.max(1, next))}
      />
    </div>
  );
}
