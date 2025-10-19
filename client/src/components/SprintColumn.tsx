import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Sprint, UserStory } from '@/types';
import UserStoryCard from './UserStoryCard';
import { Card } from '@/components/ui/card';

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

  // Определяем доминирующий риск для основного фона
  const getDominantRisk = () => {
    if (sprintStories.length === 0) return 'none';
    const { low, moderate, high } = riskProportions;
    if (high >= low && high >= moderate) return 'high';
    if (moderate >= low) return 'moderate';
    return 'low';
  };

  const dominantRisk = getDominantRisk();

  // Определяем цвет фона в зависимости от доминирующего риска
  const getRiskBackgroundClass = () => {
    if (sprintStories.length === 0) return 'bg-gray-50';
    switch (dominantRisk) {
      case 'low':
        return 'bg-green-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(34,197,94,0.05)_10px,rgba(34,197,94,0.05)_20px)]';
      case 'moderate':
        return 'bg-yellow-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(234,179,8,0.05)_10px,rgba(234,179,8,0.05)_20px)]';
      case 'high':
        return 'bg-red-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.05)_10px,rgba(239,68,68,0.05)_20px)]';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="flex-1 min-w-[280px]">
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
        className={`min-h-[500px] p-4 rounded-lg transition-all duration-200 ${
          isOver ? 'bg-cyan-100 border-2 border-cyan-500 shadow-lg ring-4 ring-cyan-300' : `${getRiskBackgroundClass()} border border-gray-200`
        }`}
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

