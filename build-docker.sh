#!/bin/bash

# Скрипт для сборки Docker образа симулятора планирования спринтов

set -e  # Остановить при ошибке

echo "🚀 Начинаем сборку Docker образа..."
echo ""

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    echo "Установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker найден: $(docker --version)"
echo ""

# Проверка наличия docker-compose
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose найден: $(docker-compose --version)"
    USE_COMPOSE=true
else
    echo "⚠️  Docker Compose не найден, используем docker напрямую"
    USE_COMPOSE=false
fi
echo ""

# Очистка старых контейнеров
echo "🧹 Очистка старых контейнеров..."
docker stop sprint-simulator 2>/dev/null || true
docker rm sprint-simulator 2>/dev/null || true
echo ""

# Сборка образа
echo "🔨 Сборка Docker образа..."
if [ "$USE_COMPOSE" = true ]; then
    docker-compose build --no-cache
else
    docker build --no-cache -t sprint-planning-simulator:latest .
fi
echo ""

# Запуск контейнера
echo "🚀 Запуск контейнера..."
if [ "$USE_COMPOSE" = true ]; then
    docker-compose up -d
else
    docker run -d \
        --name sprint-simulator \
        -p 3000:80 \
        --restart unless-stopped \
        sprint-planning-simulator:latest
fi
echo ""

# Ожидание запуска
echo "⏳ Ожидание запуска приложения..."
sleep 5

# Проверка статуса
echo "🔍 Проверка статуса..."
if docker ps | grep -q sprint; then
    echo "✅ Контейнер успешно запущен!"
    echo ""
    echo "📊 Информация о контейнере:"
    docker ps | grep sprint
    echo ""
    echo "🌐 Приложение доступно по адресу: http://localhost:3000"
    echo ""
    echo "📝 Полезные команды:"
    echo "  - Просмотр логов: docker logs -f sprint-simulator"
    if [ "$USE_COMPOSE" = true ]; then
        echo "  - Остановка: docker-compose down"
        echo "  - Перезапуск: docker-compose restart"
    else
        echo "  - Остановка: docker stop sprint-simulator"
        echo "  - Перезапуск: docker restart sprint-simulator"
    fi
else
    echo "❌ Ошибка при запуске контейнера!"
    echo "Проверьте логи: docker logs sprint-simulator"
    exit 1
fi
