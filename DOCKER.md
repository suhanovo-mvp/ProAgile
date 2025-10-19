# Docker инструкции

## Сборка и запуск

### Вариант 1: Docker Compose (рекомендуется)

```bash
# Сборка и запуск в одной команде
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Вариант 2: Docker напрямую

```bash
# Сборка образа
docker build -t sprint-planning-simulator:latest .

# Запуск контейнера
docker run -d -p 3000:80 --name sprint-simulator sprint-planning-simulator:latest

# Просмотр логов
docker logs -f sprint-simulator

# Остановка
docker stop sprint-simulator
docker rm sprint-simulator
```

## Проверка работы

После запуска откройте браузер и перейдите по адресу:
```
http://localhost:3000
```

## Требования

- Docker версии 20.10 или выше
- Docker Compose версии 2.0 или выше (опционально)
- 2 GB свободной оперативной памяти
- 1 GB свободного места на диске

## Структура образа

Образ использует multi-stage build:
1. **Builder stage**: Node.js 22 Alpine для сборки приложения
2. **Production stage**: Nginx Alpine для обслуживания статических файлов

Финальный размер образа: ~50 MB

## Переменные окружения

В текущей версии приложение не использует переменные окружения, но вы можете добавить их через:

```yaml
# docker-compose.yml
environment:
  - NODE_ENV=production
  - CUSTOM_VAR=value
```

## Порты

- **80** (внутри контейнера) - Nginx веб-сервер
- **3000** (на хосте) - маппинг на хост машину

Вы можете изменить порт хоста в `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Теперь доступно на порту 8080
```

## Troubleshooting

### Ошибка "port already in use"
```bash
# Найти процесс, использующий порт
lsof -i :3000

# Или изменить порт в docker-compose.yml
```

### Ошибка при сборке
```bash
# Очистить кэш Docker
docker builder prune -a

# Пересобрать без кэша
docker-compose build --no-cache
```

### Контейнер не запускается
```bash
# Проверить логи
docker-compose logs

# Проверить статус
docker-compose ps
```

## Production деплой

Для production окружения рекомендуется:

1. Использовать конкретную версию образа вместо `latest`
2. Настроить health checks
3. Добавить мониторинг
4. Настроить автоматический перезапуск
5. Использовать reverse proxy (например, Traefik или Nginx Proxy Manager)

Пример с health check:
```yaml
services:
  sprint-simulator:
    build: .
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Обновление

```bash
# Остановить текущий контейнер
docker-compose down

# Получить последние изменения из git
git pull

# Пересобрать и запустить
docker-compose up -d --build
```

