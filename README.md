# RabbitOps — Ферма невидимых кроликов

Интерактивная аналитическая система для оценки популяции невидимых кроликов по косвенным сигналам.

## Демо

**Интерфейс:** [GitHub Pages](https://alexaaa-a.github.io/invisible-rabbit-farm/)

## Что можно сделать

- Добавлять/редактировать/удалять события (тип, зона, интенсивность, количество)
- Видеть пересчет оценки в реальном времени при каждом изменении
- Настраивать параметры модели (веса, чувствительность) и наблюдать эффект
- Фильтровать дашборд по зонам
- Применять what-if сценарии из блока чувствительности весов
- Переходить от рекомендации к конкретному полю на карточке события

## Стек

| Категория | Технология |
|-----------|-----------|
| Framework | React 19 + TypeScript |
| Build     | Vite 7 |
| Стили     | Tailwind CSS 4 |
| UI        | shadcn/ui (Radix primitives) |
| Анимации  | Framer Motion |
| Графики   | Recharts |
| Роутинг   | React Router 7 |
| Тесты     | Vitest |

## Запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:5173/invisible-rabbit-farm/

## Сборка и превью

```bash
npm run build
npm run preview
```

## Тесты

```bash
npm test
```

31 unit-тест покрывают: estimator pipeline, нормализацию, zone merge, рекомендации, explainability.

## Структура проекта

```
src/
├── app/              # Shell, router, layout, header
├── domain/           # Чистая бизнес-логика (без React)
│   ├── config/       # Все константы и пороги
│   ├── estimator/    # Pipeline оценки популяции
│   ├── explainability/ # Генерация объяснений
│   ├── insights/     # Текстовые инсайты
│   ├── recommendations/ # Рекомендации по действиям
│   ├── utils/        # Математические утилиты
│   └── validation/   # Нормализация входных данных
├── features/         # Dashboard, Signals, Model, AI Worklog
├── state/            # Context + reducer
├── hooks/            # useFarmAnalysis, useEvents, useModelParams
├── types/            # TypeScript типы
├── components/       # Переиспользуемые UI-компоненты
├── data/             # Seed-данные
├── lib/              # Утилиты (format, cn, labels, colors)
└── styles/           # Глобальные стили
```

## Логика оценки (Pipeline)

```
normalizeInput → calculateRawScores → mergeByZone → calculateConfidence
→ calculateEstimate → applyScaleFloor → calculateContributions
→ rankSignals → generateRecommendations → generateInsights
→ buildExplainability → calculateWeightSensitivity
```

## AI-инструменты и процесс

**Инструмент:** Cursor IDE + Claude

**Как использовалась AI:**
1. Декомпозиция задачи на модули и выбор архитектуры
2. Генерация rule-based модели оценки (формула raw score, zone merge, confidence)
3. Создание React-компонентов дашборда и форм
4. Проектирование Explainability-слоя с what-if сценариями
5. UX-аудит интерфейса (AI в роли Senior Product Designer)
6. Полировка анимаций и адаптивности

**Какие решения принимались разработчиком:**
- Архитектура: feature-based, domain без React-зависимостей
- Выбор rule-based вместо ML (детерминированность, объяснимость, нет обучающих данных)
- Derived state вместо хранения оценки в reducer
- Progressive disclosure для Explainability
- Рекурсия в sensitivity → решена через `skipExplainability`

**Как проверяла результат:**
- `npm run build` и `npm test` на каждом этапе
- Ручная проверка краевых случаев: пустой дашборд, 1 событие, все выключены, noise > max signal
- TypeScript strict mode - 0 ошибок типизации
- UX-аудит с оценкой 7/10 -> 18 улучшений -> повторная оценка 9/10

## AI Worklog

Доступен в интерфейсе: вкладка **AI Worklog** в боковом меню или кнопка в header. Содержит 7 чекпоинтов с разбором задачи для AI, хода мысли, принятого решения и результата.
