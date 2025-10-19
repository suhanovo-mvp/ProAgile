import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { UserStory } from '@/types';
import UserStoryCard from './UserStoryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SortAsc } from 'lucide-react';
import { useSprintContext } from '@/contexts/SprintContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BacklogPanelProps {
  stories: UserStory[];
  onStoryClick?: (storyId: number) => void;
}

export default function BacklogPanel({ stories, onStoryClick }: BacklogPanelProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'backlog',
  });

  const { searchTerm, setSearchTerm, sortBy, setSortBy } = useSprintContext();
  const [showSortMenu, setShowSortMenu] = useState(false);

  const backlogStories = stories.filter(s => s.assignedTo === null);

  const filteredStories = backlogStories.filter(story =>
    story.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Извлекаем число из строки "Высокий (1)", "Средний (2)", "Низкий (3)"
        const priorityA = parseInt(a.priority.match(/\((\d+)\)/)?.[1] || '999');
        const priorityB = parseInt(b.priority.match(/\((\d+)\)/)?.[1] || '999');
        return priorityA - priorityB;
      case 'risk':
        const riskOrder = { high: 0, moderate: 1, low: 2 };
        return riskOrder[a.risk] - riskOrder[b.risk];
      case 'points':
        return b.points - a.points;
      case 'alphabetical':
        return a.label.localeCompare(b.label);
      default:
        return 0;
    }
  });

  return (
    <div className="w-80 bg-teal-700 text-white p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Бэклог</h2>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Поиск историй..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white text-gray-900"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 hover:bg-gray-100"
          >
            <SortAsc className="w-4 h-4 mr-2" />
            Сортировка
            {sortBy && (
              <span className="ml-auto text-xs text-teal-600 font-semibold">
                ✓
              </span>
            )}
          </button>
          {showSortMenu && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white z-50 shadow-lg border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => { setSortBy('priority'); setShowSortMenu(false); }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${sortBy === 'priority' ? 'bg-teal-100 font-semibold' : ''}`}
              >
                <span className="mr-2">🔥</span>
                По приоритету
                {sortBy === 'priority' && <span className="ml-auto">✓</span>}
              </button>
              <button
                onClick={() => { setSortBy('risk'); setShowSortMenu(false); }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${sortBy === 'risk' ? 'bg-teal-100 font-semibold' : ''}`}
              >
                <span className="mr-2">⚠️</span>
                По риску
                {sortBy === 'risk' && <span className="ml-auto">✓</span>}
              </button>
              <button
                onClick={() => { setSortBy('points'); setShowSortMenu(false); }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${sortBy === 'points' ? 'bg-teal-100 font-semibold' : ''}`}
              >
                <span className="mr-2">📊</span>
                По story points
                {sortBy === 'points' && <span className="ml-auto">✓</span>}
              </button>
              <button
                onClick={() => { setSortBy('alphabetical'); setShowSortMenu(false); }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${sortBy === 'alphabetical' ? 'bg-teal-100 font-semibold' : ''}`}
              >
                <span className="mr-2">🔤</span>
                По алфавиту
                {sortBy === 'alphabetical' && <span className="ml-auto">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`transition-all duration-200 rounded-lg p-2 ${
          isOver ? 'bg-teal-600 ring-2 ring-teal-400 shadow-lg' : ''
        }`}
      >
        <SortableContext items={sortedStories.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortedStories.map(story => (
              <UserStoryCard 
                key={story.id} 
                story={story} 
                inBacklog 
                onClick={() => onStoryClick?.(story.id)}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <div className="mt-4 text-xs text-teal-200">
        Всего историй в бэклоге: {backlogStories.length}
      </div>
    </div>
  );
}

