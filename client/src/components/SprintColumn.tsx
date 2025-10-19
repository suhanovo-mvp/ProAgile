import { useDroppable } from '@dnd-kit/core';
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
      
      <Card
        ref={setNodeRef}
        className={`min-h-[500px] p-4 transition-all duration-200 ${
          isOver ? 'bg-cyan-100 border-2 border-cyan-500 shadow-lg ring-2 ring-cyan-300' : 'bg-gray-50 border border-gray-200'
        }`}
      >
          {sprintStories.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              Перетащите истории сюда
            </div>
          ) : (
            sprintStories.map(story => (
              <UserStoryCard 
                key={story.id} 
                story={story} 
                onClick={() => onStoryClick?.(story.id)}
              />
            ))
          )}
      </Card>
    </div>
  );
}

