import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Инструкции</DialogTitle>
          <DialogDescription className="text-base pt-4">
            <div className="space-y-4">
              <p>
                Перетащите элементы из бэклога в доступные спринты. Некоторые пользовательские истории 
                могут быть размещены только после выполнения определенных зависимостей. Другие могут 
                остаться в бэклоге.
              </p>
              <p>
                Учитывайте количество story points, приоритет, уровень риска и зависимости, чтобы 
                создать оптимальный план для трех спринтов.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Основные правила:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Максимум 20 story points на каждый спринт</li>
                  <li>Истории с зависимостями можно добавить только после выполнения зависимых историй</li>
                  <li>Высокий приоритет (1) - наиболее важные истории</li>
                  <li>Средний приоритет (2) - важные, но не критичные</li>
                  <li>Низкий приоритет (3) - можно отложить</li>
                  <li>Уровень риска влияет на сложность реализации</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Начать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

