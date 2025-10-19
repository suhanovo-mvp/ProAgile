import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UserStory } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Info } from 'lucide-react';

interface UserStoryCardProps {
  story: UserStory;
  inBacklog?: boolean;
  onClick?: () => void;
}

export default function UserStoryCard({ story, inBacklog = false, onClick }: UserStoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: story.id,
    disabled: !story.enabled && inBacklog,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    if (priority.includes('Высокий')) return 'bg-cyan-500';
    if (priority.includes('Средний')) return 'bg-teal-500';
    return 'bg-slate-500';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return 'text-red-500';
    if (risk === 'moderate') return 'text-yellow-500';
    return 'text-green-500';
  };

  const isDisabled = !story.enabled && inBacklog;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <Card className={`p-3 mb-2 hover:shadow-md transition-shadow ${isDisabled ? 'bg-gray-100' : 'bg-white'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full ${getPriorityColor(story.priority)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {story.points}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate flex-1">{story.label}</h3>
              {onClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                  title="Показать детали"
                >
                  <Info className="w-4 h-4 text-blue-600" />
                </button>
              )}
              {isDisabled && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            </div>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{story.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {story.priority}
              </Badge>
              <div className="flex items-center gap-1">
                <AlertCircle className={`w-3 h-3 ${getRiskColor(story.risk)}`} />
                <span className="text-xs text-gray-500 capitalize">{story.risk}</span>
              </div>
              {story.depends.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Зависимости: {story.depends.join(', ')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

