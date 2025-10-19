export interface UserStory {
  id: number;
  label: string;
  points: number;
  depends: number[];
  enabled: boolean;
  type: string;
  description: string;
  risk: 'low' | 'moderate' | 'high';
  priority: string;
  assignedTo?: number | null;
}

export interface Sprint {
  id: number;
  label: string;
  maxPoints: number;
  currPoints: number;
  taskIds: number[];
}

export type SortOption = 'priority' | 'risk' | 'points' | 'alphabetical';

