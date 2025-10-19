import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

// Модальное окно с вкладками: О кейсе + Инструкции

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  const [activeTab, setActiveTab] = useState('case');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Добро пожаловать в симулятор планирования спринтов</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="case">О кейсе</TabsTrigger>
            <TabsTrigger value="instructions">Инструкции</TabsTrigger>
          </TabsList>
          
          <TabsContent value="case" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Общая задача</h3>
                <p className="text-gray-700">
                  Вы — Product Owner интернет-магазина, который планирует запуск MVP (минимально жизнеспособного продукта) 
                  за три спринта. Ваша цель — распределить пользовательские истории из бэклога по спринтам так, чтобы 
                  обеспечить максимальную ценность для бизнеса при минимальных рисках.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-900">Контекст проекта</h4>
                <p className="text-sm text-blue-800">
                  Интернет-магазин должен позволять пользователям выбирать товары, добавлять их в корзину, 
                  оформлять заказы и оплачивать покупки онлайн. Дополнительно требуется базовая функциональность 
                  для поиска, фильтрации, работы с учетными записями и адаптивный дизайн для мобильных устройств.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Логика декомпозиции бэклога</h3>
                <p className="text-gray-700 mb-3">
                  Бэклог декомпозирован на 20 пользовательских историй, сгруппированных по функциональным областям:
                </p>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-900">1. Базовая функциональность (MVP Core)</h4>
                    <p className="text-sm text-gray-600">
                      Критические истории для работы магазина: создание аккаунта, выбор товара, корзина, 
                      оформление заказа, онлайн-оплата. Эти истории имеют высокий приоритет и зависимости друг от друга.
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-900">2. Поиск и навигация</h4>
                    <p className="text-sm text-gray-600">
                      Функции для удобного поиска товаров: поиск по ключевым словам, фильтрация по категориям, 
                      изображения товаров. Средний приоритет, низкий риск.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-900">3. Пользовательский опыт</h4>
                    <p className="text-sm text-gray-600">
                      Улучшения UX: мобильная версия, адаптивный дизайн, избранное, история заказов. 
                      Важны для удержания пользователей, но не критичны для MVP.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-900">4. Дополнительные возможности</h4>
                    <p className="text-sm text-gray-600">
                      Функции для повышения конверсии: отзывы, сравнение товаров, рекомендации, чат с поддержкой. 
                      Низкий приоритет, могут быть отложены на следующие спринты.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-amber-900">Ключевые факторы планирования</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                  <li><strong>Story Points:</strong> Оценка сложности реализации (1-5 points)</li>
                  <li><strong>Приоритет:</strong> Бизнес-важность истории (1 - высокий, 2 - средний, 3 - низкий)</li>
                  <li><strong>Риск:</strong> Вероятность проблем при реализации (Низкий, Средний, Высокий)</li>
                  <li><strong>Зависимости:</strong> Истории, которые должны быть выполнены ранее</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Ваша задача</h3>
                <p className="text-gray-700">
                  Распределите истории по трем спринтам (по 20 story points каждый), учитывая приоритеты, 
                  риски и зависимости. Постарайтесь завершить базовую функциональность в первых двух спринтах, 
                  а в третьем — добавить улучшения UX и дополнительные возможности.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="instructions" className="space-y-4 pt-4">
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

              <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Цветовая индикация рисков:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span><strong>Зеленый (Низкий):</strong> Низкий риск - простые задачи с понятной реализацией</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span><strong>Желтый (Средний):</strong> Средний риск - требуют дополнительного времени или экспертизы</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span><strong>Красный (Высокий):</strong> Высокий риск - сложные задачи с неопределенностью</span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    Фон спринта автоматически отображает пропорциональное распределение рисков по story points.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button 
            onClick={() => {
              if (activeTab === 'case') {
                setActiveTab('instructions');
              } else {
                onClose();
              }
            }} 
            className="w-full sm:w-auto"
          >
            {activeTab === 'case' ? 'Далее →' : 'Начать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

