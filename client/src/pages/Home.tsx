import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useSprintContext } from '@/contexts/SprintContext';
import SprintColumn from '@/components/SprintColumn';
import BacklogPanel from '@/components/BacklogPanel';
import UserStoryCard from '@/components/UserStoryCard';
import InstructionsModal from '@/components/InstructionsModal';
import UserStoryDetailModal from '@/components/UserStoryDetailModal';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, Info } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

export default function Home() {
  const { stories, sprints, moveStory, resetSimulation } = useSprintContext();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const storyId = active.id as number;
    const targetId = over.id;

    let targetSprintId: string | number | null = null;

    // Если бросили на backlog
    if (targetId === 'backlog') {
      targetSprintId = null;
    }
    // Если бросили на спринт (ID начинается с 'sprint-')
    else if (typeof targetId === 'string' && targetId.startsWith('sprint-')) {
      const sprint = sprints.find(s => s.id === targetId);
      if (sprint) {
        targetSprintId = sprint.id;
      }
    }
    // Если бросили на карточку (ID это число)
    else if (typeof targetId === 'number') {
      const story = stories.find(s => s.id === targetId);
      if (story && story.assignedTo !== undefined) {
        targetSprintId = story.assignedTo;
      }
    }

    const success = moveStory(storyId, targetSprintId);
    
    if (!success && targetSprintId !== null) {
      const story = stories.find(s => s.id === storyId);
      const sprint = sprints.find(s => s.id === targetSprintId);
      
      if (story && sprint) {
        if (!story.enabled) {
          toast.error('Невозможно добавить историю', {
            description: 'Сначала необходимо выполнить зависимости',
          });
        } else if (sprint.currPoints + story.points > sprint.maxPoints) {
          toast.error('Превышен лимит story points', {
            description: `В спринте недостаточно места (доступно: ${sprint.maxPoints - sprint.currPoints} points)`,
          });
        }
      }
    }

    setActiveId(null);
  };

  const handleReset = () => {
    resetSimulation();
    toast.success('Симуляция сброшена');
  };

  const handleTestGradient = () => {
    // Добавляем карточки с разными рисками в спринты для тестирования
    
    // Спринт 1: Low (2+1+2=5 points) + Moderate (2 points) = 71%/29%
    moveStory(2, 'sprint-1');  // Выбрать товар - Low, 2 points
    moveStory(3, 'sprint-1');  // Добавить в корзину - Low, 1 point
    moveStory(1, 'sprint-1');  // Создать учетную запись - Low, 2 points
    moveStory(11, 'sprint-1'); // Адаптивный дизайн - Moderate, 2 points
    
    // Спринт 2: Low (2+2=4 points) + Moderate (3 points) + High (3 points) = 40%/30%/30%
    moveStory(6, 'sprint-2');  // Поиск товаров - Low, 2 points
    moveStory(12, 'sprint-2'); // Изображения товаров - Low, 2 points
    moveStory(13, 'sprint-2'); // Отзывы покупателей - Moderate, 3 points
    moveStory(18, 'sprint-2'); // Рекомендации товаров - High, 3 points (зависит от #1)
    
    // Спринт 3: Low (1 point) + Moderate (3+3=6 points) = 14%/86%
    moveStory(10, 'sprint-3'); // Мобильная версия - Low, 1 point
    moveStory(17, 'sprint-3'); // Сравнение товаров - Moderate, 3 points
    moveStory(19, 'sprint-3'); // Чат с поддержкой - Moderate, 3 points
    
    toast.success('Тестовые данные загружены! Градиентная индикация рисков активна');
  };

  const handleDownloadPDF = async () => {
    try {
      toast.info('Генерация PDF...', { duration: 2000 });
      
      const element = document.getElementById('sprint-board');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('sprint-plan.pdf');
      
      toast.success('PDF успешно сохранен');
    } catch (error) {
      toast.error('Ошибка при генерации PDF');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <UserStoryDetailModal
        story={selectedStory !== null ? stories.find(s => s.id === selectedStory) || null : null}
        open={selectedStory !== null}
        onOpenChange={(open) => !open && setSelectedStory(null)}
      />

      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Планирование релиза
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstructions(true)}
              >
                <Info className="w-4 h-4 mr-2" />
                Инструкции
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTestGradient}
              >
                🎨 Тест градиента
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Сброс
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownloadPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Скачать PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[calc(100vh-73px)]">
          <BacklogPanel 
            stories={stories} 
            onStoryClick={(id) => setSelectedStory(id)}
          />
          
          <div id="sprint-board" className="flex-1 p-6 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {sprints.map(sprint => (
                <SprintColumn
                  key={sprint.id}
                  sprint={sprint}
                  stories={stories}
                  onStoryClick={(id) => setSelectedStory(id)}
                />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeId ? (
            <div className="rotate-3 scale-105 opacity-90">
              <UserStoryCard
                story={stories.find(s => s.id === activeId)!}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

