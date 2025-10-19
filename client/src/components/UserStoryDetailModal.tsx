import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserStory } from "@/types";
import { AlertCircle, Clock, Target, Users } from "lucide-react";

interface UserStoryDetailModalProps {
  story: UserStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserStoryDetailModal({
  story,
  open,
  onOpenChange,
}: UserStoryDetailModalProps) {
  if (!story) return null;

  const priorityColors: Record<string, string> = {
    "1": "bg-red-100 text-red-800 border-red-300",
    "2": "bg-orange-100 text-orange-800 border-orange-300",
    "3": "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  const riskColors: Record<string, string> = {
    low: "bg-green-100 text-green-800 border-green-300",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    high: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">
            {story.label}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {story.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Метрики */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-900">
                {story.points}
              </div>
              <div className="text-sm text-blue-700">Story Points</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="w-6 h-6 text-orange-600 mb-2" />
              <div className="text-lg font-semibold text-orange-900">
                Приоритет {story.priority}
              </div>
              <div className="text-sm text-orange-700">
                {story.priority === "1"
                  ? "Высокий"
                  : story.priority === "2"
                    ? "Средний"
                    : "Низкий"}
              </div>
            </div>

            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Clock className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-lg font-semibold text-purple-900 capitalize">
                {story.risk === 'low' ? 'Низкий' : story.risk === 'moderate' ? 'Средний' : 'Высокий'}
              </div>
              <div className="text-sm text-purple-700">Уровень риска</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={priorityColors[story.priority]}
            >
              Приоритет: {story.priority}
            </Badge>
            <Badge
              variant="outline"
              className={riskColors[story.risk]}
            >
              Риск: {story.risk === 'low' ? 'Низкий' : story.risk === 'moderate' ? 'Средний' : 'Высокий'}
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              {story.points} SP
            </Badge>
          </div>

          {/* Детальное описание */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Пользовательская история
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{story.description}</p>
            </div>
          </div>

          {/* Зависимости */}
          {story.depends && story.depends.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Зависимости
              </h3>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 mb-2">
                  Эта история зависит от следующих историй:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {story.depends.map((depId: number) => (
                    <li key={depId} className="text-amber-900 font-medium">
                      История #{depId}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-700 mt-3 italic">
                  💡 Сначала необходимо завершить зависимые истории
                </p>
              </div>
            </div>
          )}

          {/* Критерии приёмки */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Критерии приёмки</h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">
                    Функциональность полностью реализована согласно описанию
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">
                    Все зависимые истории выполнены
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">
                    Код протестирован и соответствует стандартам качества
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">
                    Документация обновлена при необходимости
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">
                Сложность
              </h4>
              <p className="text-gray-900">
                {Number(story.points) <= 3
                  ? "Низкая"
                  : Number(story.points) <= 5
                    ? "Средняя"
                    : "Высокая"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-1">
                Рекомендуемый спринт
              </h4>
              <p className="text-gray-900">
                {story.priority === "1"
                  ? "Спринт 1"
                  : story.priority === "2"
                    ? "Спринт 1-2"
                    : "Спринт 2-3"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

