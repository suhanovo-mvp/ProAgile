#!/bin/bash

# Скрипт для публикации проекта на GitHub

set -e

echo "🚀 Публикация проекта на GitHub"
echo "================================"
echo ""

# Проверка Git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен!"
    echo "Установите Git: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git найден: $(git --version)"
echo ""

# Запрос данных пользователя
read -p "📝 Введите ваш GitHub username: " GITHUB_USER
read -p "📝 Введите название репозитория [sprint-planning-simulator]: " REPO_NAME
REPO_NAME=${REPO_NAME:-sprint-planning-simulator}

echo ""
echo "📋 Параметры:"
echo "  - Username: $GITHUB_USER"
echo "  - Repository: $REPO_NAME"
echo "  - URL: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

read -p "❓ Продолжить? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "❌ Отменено"
    exit 0
fi

echo ""

# Инициализация Git (если нужно)
if [ ! -d .git ]; then
    echo "📦 Инициализация Git репозитория..."
    git init
    echo "✅ Git репозиторий инициализирован"
else
    echo "✅ Git репозиторий уже существует"
fi

echo ""

# Настройка Git (если нужно)
if [ -z "$(git config user.name)" ]; then
    read -p "📝 Введите ваше имя для Git: " GIT_NAME
    git config user.name "$GIT_NAME"
fi

if [ -z "$(git config user.email)" ]; then
    read -p "📝 Введите ваш email для Git: " GIT_EMAIL
    git config user.email "$GIT_EMAIL"
fi

echo "✅ Git настроен:"
echo "  - Name: $(git config user.name)"
echo "  - Email: $(git config user.email)"
echo ""

# Добавление файлов
echo "📁 Добавление файлов..."
git add .
echo "✅ Файлы добавлены"
echo ""

# Проверка статуса
echo "📊 Статус репозитория:"
git status --short
echo ""

# Создание коммита
echo "💾 Создание коммита..."
git commit -m "Initial commit: Sprint Planning Simulator

- Интерактивный симулятор планирования спринтов
- 20 пользовательских историй на русском языке
- Drag & Drop интерфейс
- Docker конфигурация
- Полная документация" || echo "⚠️  Нет изменений для коммита"

echo ""

# Переименование ветки в main
echo "🔄 Переименование ветки в main..."
git branch -M main
echo "✅ Ветка переименована"
echo ""

# Добавление remote
REMOTE_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

if git remote | grep -q origin; then
    echo "🔗 Remote origin уже существует, обновляем URL..."
    git remote set-url origin "$REMOTE_URL"
else
    echo "🔗 Добавление remote origin..."
    git remote add origin "$REMOTE_URL"
fi

echo "✅ Remote настроен: $REMOTE_URL"
echo ""

# Отправка на GitHub
echo "📤 Отправка на GitHub..."
echo ""
echo "⚠️  ВАЖНО: GitHub больше не принимает пароли для аутентификации!"
echo "Используйте Personal Access Token:"
echo "1. Перейдите: https://github.com/settings/tokens"
echo "2. Generate new token (classic)"
echo "3. Выберите scopes: repo, workflow"
echo "4. Скопируйте токен"
echo "5. При запросе пароля вставьте токен"
echo ""

read -p "❓ Готовы отправить на GitHub? (y/n): " PUSH_CONFIRM
if [ "$PUSH_CONFIRM" != "y" ]; then
    echo "❌ Push отменен"
    echo "Вы можете отправить позже командой: git push -u origin main"
    exit 0
fi

echo ""
git push -u origin main

echo ""
echo "✅ Проект успешно опубликован на GitHub!"
echo ""
echo "🌐 Ссылки:"
echo "  - Репозиторий: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "  - Settings: https://github.com/$GITHUB_USER/$REPO_NAME/settings"
echo "  - Actions: https://github.com/$GITHUB_USER/$REPO_NAME/actions"
echo ""
echo "📝 Следующие шаги:"
echo "  1. Настройте GitHub Pages (Settings → Pages)"
echo "  2. Добавьте темы к репозиторию"
echo "  3. Включите Issues и Discussions"
echo "  4. Настройте Docker Hub secrets (если нужно)"
echo ""
echo "🎉 Готово!"
