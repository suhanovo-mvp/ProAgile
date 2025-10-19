import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Sprint, UserStory } from '@/types';
import UserStoryCard from './UserStoryCard';
import { Card } from '@/components/ui/card';

/**
 * SprintColumn - Компонент колонки спринта с градиентной индикацией рисков
 * Оптимизирован для MacBook 13" (min-w-240px, max-w-280px)
 */
interface SprintColumnProps {
  sprint: Sprint;
  stories: UserStory[];
  onStoryClick?: (storyId: number) => void;
}

export default function SprintColumn({ sprint, stories, onStoryClick }: SprintColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: sprint.id,
  });

  const sprintStories = stories.filter(s => s.assignedTo === sprint.id);
  const progressPercentage = (sprint.currPoints / sprint.maxPoints) * 100;

  // Вычисляем пропорции риска по story points
  const calculateRiskProportions = () => {
    if (sprintStories.length === 0) return { low: 0, moderate: 0, high: 0 };
    
    const totalPoints = sprintStories.reduce((sum, story) => sum + story.points, 0);
    const riskPoints = { low: 0, moderate: 0, high: 0 };
    
    sprintStories.forEach(story => {
      if (story.risk === 'low') riskPoints.low += story.points;
      else if (story.risk === 'moderate') riskPoints.moderate += story.points;
      else if (story.risk === 'high') riskPoints.high += story.points;
    });
    
    return {
      low: totalPoints > 0 ? (riskPoints.low / totalPoints) * 100 : 0,
      moderate: totalPoints > 0 ? (riskPoints.moderate / totalPoints) * 100 : 0,
      high: totalPoints > 0 ? (riskPoints.high / totalPoints) * 100 : 0,
    };
  };

  const riskProportions = calculateRiskProportions();

  // Создаём градиентную заливку пропорционально story points
  const getRiskBackgroundStyle = () => {
    if (sprintStories.length === 0) return {};
    
    const { low, moderate, high } = riskProportions;
    
    // Создаём градиент с пропорциями
    const gradientParts = [];
    let currentPercent = 0;
    
    if (low > 0) {
      gradientParts.push(`rgba(34, 197, 94, 0.15) ${currentPercent}%, rgba(34, 197, 94, 0.15) ${currentPercent + low}%`);
      currentPercent += low;
    }
    if (moderate > 0) {
      gradientParts.push(`rgba(234, 179, 8, 0.15) ${currentPercent}%, rgba(234, 179, 8, 0.15) ${currentPercent + moderate}%`);
      currentPercent += moderate;
    }
    if (high > 0) {
      gradientParts.push(`rgba(239, 68, 68, 0.15) ${currentPercent}%, rgba(239, 68, 68, 0.15) ${currentPercent + high}%`);
    }
    
    return {
      background: `linear-gradient(to bottom, ${gradientParts.join(', ')}), repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.03) 10px, rgba(0, 0, 0, 0.03) 20px)`
    };
  };

  return (
    <div className="flex-1 min-w-[240px] max-w-[280px]">
      <div className="mb-3">
        <h2 className="text-lg font-bold mb-2">{sprint.label}</h2>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                progressPercentage > 100 ? 'bg-red-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${
            sprint.currPoints > sprint.maxPoints ? 'text-red-500' : 'text-gray-700'
          }`}>
            {sprint.currPoints} / {sprint.maxPoints}
          </span>
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        style={getRiskBackgroundStyle()}
        className={`min-h-[400px] p-3 rounded-lg border border-gray-200 transition-all ${
          isOver ? 'ring-2 ring-cyan-500 shadow-lg border-2 border-cyan-500' : ''
        } ${sprintStories.length === 0 ? 'bg-gray-50' : ''}`}
      >
        <SortableContext items={sprintStories.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sprintStories.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              Перетащите истории сюда
            </div>
          ) : (
            <div className="space-y-2">
              {sprintStories.map(story => (
                <UserStoryCard 
                  key={story.id} 
                  story={story} 
                  onClick={() => onStoryClick?.(story.id)}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

