# Градиентная цветовая индикация спринтов

## Описание функциональности

Реализована пропорциональная градиентная цветовая индикация фона спринтов в зависимости от распределения story points по уровням риска (Low/Moderate/High).

## Технические детали

### Файл: `client/src/components/SprintColumn.tsx`

#### Функция `calculateRiskProportions()`

Вычисляет процентное соотношение story points для каждого уровня риска:

```typescript
const calculateRiskProportions = () => {
  const totalPoints = sprint.currPoints;
  if (totalPoints === 0) return { low: 0, moderate: 0, high: 0 };

  const riskPoints = { low: 0, moderate: 0, high: 0 };
  
  assignedStories.forEach(story => {
    if (story.risk === 'low') riskPoints.low += story.points;
    else if (story.risk === 'moderate') riskPoints.moderate += story.points;
    else if (story.risk === 'high') riskPoints.high += story.points;
  });

  return {
    low: (riskPoints.low / totalPoints) * 100,
    moderate: (riskPoints.moderate / totalPoints) * 100,
    high: (riskPoints.high / totalPoints) * 100,
  };
};
```

#### Функция `getRiskBackgroundStyle()`

Создает CSS linear-gradient с пропорциональными цветовыми зонами:

```typescript
const getRiskBackgroundStyle = () => {
  const proportions = calculateRiskProportions();
  
  if (sprint.currPoints === 0) {
    return {};
  }

  const gradientStops: string[] = [];
  let currentPosition = 0;

  // Зеленая зона (Low risk)
  if (proportions.low > 0) {
    gradientStops.push(`rgba(34, 197, 94, 0.15) ${currentPosition}%`);
    currentPosition += proportions.low;
    gradientStops.push(`rgba(34, 197, 94, 0.15) ${currentPosition}%`);
  }

  // Желтая зона (Moderate risk)
  if (proportions.moderate > 0) {
    gradientStops.push(`rgba(234, 179, 8, 0.15) ${currentPosition}%`);
    currentPosition += proportions.moderate;
    gradientStops.push(`rgba(234, 179, 8, 0.15) ${currentPosition}%`);
  }

  // Красная зона (High risk)
  if (proportions.high > 0) {
    gradientStops.push(`rgba(239, 68, 68, 0.15) ${currentPosition}%`);
    currentPosition += proportions.high;
    gradientStops.push(`rgba(239, 68, 68, 0.15) ${currentPosition}%`);
  }

  return {
    background: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(0, 0, 0, 0.02) 10px,
        rgba(0, 0, 0, 0.02) 20px
      ),
      linear-gradient(to bottom, ${gradientStops.join(', ')})
    `,
  };
};
```

## Цветовая схема

- **Low risk (Низкий)**: `rgba(34, 197, 94, 0.15)` - светло-зеленый
- **Moderate risk (Средний)**: `rgba(234, 179, 8, 0.15)` - светло-желтый
- **High risk (Высокий)**: `rgba(239, 68, 68, 0.15)` - светло-красный

Дополнительно применяется диагональная штриховка:
```css
repeating-linear-gradient(
  45deg,
  transparent,
  transparent 10px,
  rgba(0, 0, 0, 0.02) 10px,
  rgba(0, 0, 0, 0.02) 20px
)
```

## Примеры использования

### Пример 1: Спринт с Low и Moderate риском
- Low risk: 3 points (50%)
- Moderate risk: 3 points (50%)
- **Результат**: Верхняя половина фона зеленая, нижняя - желтая

### Пример 2: Спринт с Low, Moderate и High риском
- Low risk: 4 points (40%)
- Moderate risk: 3 points (30%)
- High risk: 3 points (30%)
- **Результат**: Градиент из трех зон - зеленая (40%), желтая (30%), красная (30%)

### Пример 3: Спринт только с Low риском
- Low risk: 5 points (100%)
- **Результат**: Весь фон светло-зеленый

## Тестирование

Для тестирования градиентной индикации добавлена кнопка "🎨 Тест градиента" в файле `client/src/pages/Home.tsx`, которая автоматически заполняет спринты карточками с разными уровнями риска.

### Тестовый сценарий:

**Спринт 1**: Low (71%) + Moderate (29%)
- #2: Выбрать товар - Low, 2 points
- #3: Добавить в корзину - Low, 1 point
- #1: Создать учетную запись - Low, 2 points
- #11: Адаптивный дизайн - Moderate, 2 points

**Спринт 2**: Low (40%) + Moderate (30%) + High (30%)
- #6: Поиск товаров - Low, 2 points
- #12: Изображения товаров - Low, 2 points
- #13: Отзывы покупателей - Moderate, 3 points
- #18: Рекомендации товаров - High, 3 points

**Спринт 3**: Low (14%) + Moderate (86%)
- #10: Мобильная версия - Low, 1 point
- #17: Сравнение товаров - Moderate, 3 points
- #19: Чат с поддержкой - Moderate, 3 points

## Интеграция

Градиентный стиль применяется к контейнеру спринта через `style` prop:

```tsx
<div
  id={sprint.id}
  className="min-h-[400px] bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors"
  style={getRiskBackgroundStyle()}
>
  {/* Содержимое спринта */}
</div>
```

## Преимущества

1. **Визуальная информативность**: Мгновенное понимание распределения рисков в спринте
2. **Пропорциональность**: Размер цветовой зоны соответствует количеству story points
3. **Ненавязчивость**: Полупрозрачные цвета не мешают восприятию контента
4. **Динамичность**: Градиент автоматически обновляется при изменении состава спринта

## Дата реализации

19 октября 2025 г.

