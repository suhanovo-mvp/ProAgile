export interface UserStory {
  id: number;
  label: string;
  points: number;
  depends: number[];
  enabled: boolean;
  type: string;
  description: string;
  risk: 'Низкий' | 'Средний' | 'Высокий';
  priority: string;
  assignedTo?: string | number | null;
}

export interface Sprint {
  id: string | number;
  label: string;
  maxPoints: number;
  currPoints: number;
  taskIds: number[];
}

export type SortOption = 'priority' | 'risk' | 'points' | 'alphabetical';

