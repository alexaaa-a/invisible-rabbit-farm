# Domain — аналитический модуль RabbitOps

Независимый TypeScript-модуль для оценки популяции невидимых кроликов.
Не зависит от React и UI.

## Pipeline

```
normalizeInput(events, params)
  → calculateRawScores
  → mergeByZone
  → buildZoneActivity
  → calculateConfidence
  → calculateEstimate
  → resolvePopulationEstimate (scale floor)
  → calculateContributions
  → rankSignalsByImportance
  → generateRecommendations
  → generateInsights
  → buildExplainability
  → calculateWeightSensitivity
```

## Публичный API

```typescript
import { runEstimator, DEFAULT_MODEL_PARAMS } from '@/domain';

const result = runEstimator(events, DEFAULT_MODEL_PARAMS);
```

### `EstimationResult`

| Поле | Описание |
|------|----------|
| `estimate` | Оценка популяции (целое число) |
| `range` | Диапазон `[min, max]` |
| `confidence` | Уверенность 0–100% |
| `confidenceLevel` | `low` / `medium` / `high` |
| `populationIndex` | Промежуточный индекс до округления |
| `contributions` | Вклад каждого события (direct + effective %) |
| `rankedSignals` | Рейтинг сигналов по важности |
| `zoneActivity` | Активность по зонам |
| `insights` | До 3 текстовых инсайтов |
| `recommendations` | До 6 рекомендаций с приоритетом |
| `explainability` | Полная объяснимость: summary, steps, signals, zones, weight hints |

## Формулы

### Raw score

```
baseWeight × eventWeight × (intensity/10) × √count × classBonus
```

- `classBonus = 1 + √count/10` для масштабных сигналов (`footprints`, `missing_carrot`)

### Zone merge

Сигналы в одной зоне объединяются с убывающими весами: `100% / zoneMergeFactor / 20%`.

### Confidence

4 фактора (diversity, volume, zone coverage, correlation) минус штрафы за:
- доминирование одного сигнала
- малое число событий
- все сигналы в одной зоне

### Scale floor

Масштабные сигналы задают мягкий нижний порог оценки популяции.

### Explainability

Отдельный domain-модуль, генерирует:
- Нарративное объяснение (summary)
- Пошаговую визуализацию pipeline (steps)
- Разбор каждого сигнала с факторами (signals)
- Вклад зон (zones)
- What-if сценарии чувствительности весов (weightHints)

## Тесты

```bash
npm test
```

31 unit-тест в 5 файлах покрывают pipeline, нормализацию, merge, рекомендации, explainability.

## Константы

Все пороги и веса — в `domain/config/`. Magic numbers в формулах отсутствуют.
