import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStory, Sprint } from '@/types';
import userStoriesData from '@/data/userStories.json';

// Sprint Context: управление состоянием историй и спринтов

interface SprintContextType {
  stories: UserStory[];
  sprints: Sprint[];
  moveStory: (storyId: number, sprintId: string | number | null) => boolean;
  resetSimulation: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const SprintContext = createContext<SprintContextType | undefined>(undefined);

export const useSprintContext = () => {
  const context = useContext(SprintContext);
  if (!context) {
    throw new Error('useSprintContext must be used within SprintProvider');
  }
  return context;
};

interface SprintProviderProps {
  children: ReactNode;
}

export const SprintProvider: React.FC<SprintProviderProps> = ({ children }) => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([
    { id: 'sprint-1', label: 'Спринт 1', maxPoints: 20, currPoints: 0, taskIds: [] },
    { id: 'sprint-2', label: 'Спринт 2', maxPoints: 20, currPoints: 0, taskIds: [] },
    { id: 'sprint-3', label: 'Спринт 3', maxPoints: 20, currPoints: 0, taskIds: [] },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    const loadedStories = (userStoriesData as UserStory[]).map(story => ({
      ...story,
      assignedTo: null,
    }));
    setStories(loadedStories);
  }, []);

  // Автоматическое обновление статуса enabled при изменении назначений (v2)
  useEffect(() => {
    setStories(prev => prev.map(story => ({
      ...story,
      enabled: story.depends.length === 0 || story.depends.every(depId => {
        const dependentStory = prev.find(s => s.id === depId);
        return dependentStory && dependentStory.assignedTo !== null;
      })
    })));
  }, [stories.map(s => s.assignedTo).join(',')]);

  // Проверка зависимостей: карточка разблокируется если все предшественники назначены в спринты
  const checkDependencies = (story: UserStory, currentSprints: Sprint[]): boolean => {
    if (story.depends.length === 0) return true;
    
    // Все зависимости должны быть назначены в какой-либо спринт
    return story.depends.every(depId => {
      const dependentStory = stories.find(s => s.id === depId);
      return dependentStory && dependentStory.assignedTo !== null;
    });
  };

  // Получить номер спринта для карточки (sprint-1 -> 1, sprint-2 -> 2, etc)
  const getSprintNumber = (sprintId: string | number | null): number => {
    if (!sprintId) return 0;
    if (typeof sprintId === 'number') return sprintId;
    const match = sprintId.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Проверка, может ли карточка быть добавлена в целевой спринт с учетом зависимостей
  const canMoveToSprint = (story: UserStory, targetSprintId: string | number | null): boolean => {
    if (story.depends.length === 0) return true;
    if (!targetSprintId) return true; // Возврат в бэклог всегда разрешен

    const targetSprintNum = getSprintNumber(targetSprintId);
    
    // Все зависимости должны быть в предыдущих или том же спринте
    return story.depends.every(depId => {
      const dependentStory = stories.find(s => s.id === depId);
      if (!dependentStory || !dependentStory.assignedTo) return false;
      
      const depSprintNum = getSprintNumber(dependentStory.assignedTo);
      return depSprintNum <= targetSprintNum;
    });
  };

  const moveStory = (storyId: number, targetSprintId: string | number | null): boolean => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return false;

    // Если возвращаем в backlog
    if (targetSprintId === null) {
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, assignedTo: null } : s
      ));
      setSprints(prev => prev.map(sprint => ({
        ...sprint,
        taskIds: sprint.taskIds.filter(id => id !== storyId),
        currPoints: sprint.taskIds.filter(id => id !== storyId)
          .reduce((sum, id) => sum + (stories.find(s => s.id === id)?.points || 0), 0)
      })));
      return true;
    }

    // Проверка зависимостей с учетом спринтов
    if (!canMoveToSprint(story, targetSprintId)) {
      return false;
    }

    const targetSprint = sprints.find(s => s.id === targetSprintId);
    if (!targetSprint) return false;

    // Проверка лимита points
    const newPoints = targetSprint.currPoints + story.points;
    if (newPoints > targetSprint.maxPoints) {
      return false;
    }

    // Убираем из текущего спринта
    setSprints(prev => prev.map(sprint => ({
      ...sprint,
      taskIds: sprint.taskIds.filter(id => id !== storyId),
      currPoints: sprint.taskIds.filter(id => id !== storyId)
        .reduce((sum, id) => sum + (stories.find(s => s.id === id)?.points || 0), 0)
    })));

    // Добавляем в новый спринт
    setSprints(prev => prev.map(sprint => 
      sprint.id === targetSprintId
        ? {
            ...sprint,
            taskIds: [...sprint.taskIds, storyId],
            currPoints: sprint.currPoints + story.points
          }
        : sprint
    ));

    setStories(prev => prev.map(s => 
      s.id === storyId ? { ...s, assignedTo: targetSprintId } : s
    ));

    return true;
  };

  // Функция updateDependentStories больше не нужна, так как useEffect автоматически обновляет enabled

  const resetSimulation = () => {
    setStories((userStoriesData as UserStory[]).map(story => ({
      ...story,
      assignedTo: null,
    })));
    setSprints([
      { id: 'sprint-1', label: 'Спринт 1', maxPoints: 20, currPoints: 0, taskIds: [] },
      { id: 'sprint-2', label: 'Спринт 2', maxPoints: 20, currPoints: 0, taskIds: [] },
      { id: 'sprint-3', label: 'Спринт 3', maxPoints: 20, currPoints: 0, taskIds: [] },
    ]);
    setSearchTerm('');
  };

  return (
    <SprintContext.Provider
      value={{
        stories,
        sprints,
        moveStory,
        resetSimulation,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </SprintContext.Provider>
  );
};

