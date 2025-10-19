# Инструкция по размещению на GitHub

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на [GitHub](https://github.com) и войдите в аккаунт
2. Нажмите кнопку "New repository" или "+"
3. Заполните данные:
   - **Repository name**: `sprint-planning-simulator`
   - **Description**: "Интерактивный симулятор планирования спринтов для обучения Agile/Scrum"
   - **Public** или **Private** - на ваш выбор
   - **НЕ** инициализируйте с README, .gitignore или license (они уже есть в проекте)
4. Нажмите "Create repository"

## Шаг 2: Подключение локального репозитория

```bash
cd /path/to/sprint-planning-simulator

# Инициализация git (если еще не сделано)
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: Sprint Planning Simulator"

# Подключение к GitHub репозиторию
git remote add origin https://github.com/YOUR_USERNAME/sprint-planning-simulator.git

# Отправка на GitHub
git branch -M main
git push -u origin main
```

## Шаг 3: Настройка GitHub Actions (опционально)

GitHub Actions уже настроен в `.github/workflows/docker-build.yml`. Для работы с Docker Hub:

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте secrets:
   - `DOCKER_USERNAME` - ваш логин Docker Hub
   - `DOCKER_PASSWORD` - токен доступа Docker Hub

## Шаг 4: Деплой на GitHub Pages (опционально)

```bash
# Установить gh-pages
pnpm add -D gh-pages

# Добавить в package.json
{
  "scripts": {
    "predeploy": "pnpm run build",
    "deploy": "gh-pages -d client/dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/sprint-planning-simulator"
}

# Задеплоить
pnpm run deploy
```

После деплоя:
1. Перейдите в Settings → Pages
2. Source должен быть установлен на `gh-pages` branch
3. Приложение будет доступно по адресу из `homepage`

## Шаг 5: Обновление README

Не забудьте обновить в README.md:
- Ссылку на репозиторий
- Ссылку на live demo (если используете GitHub Pages)
- Ваши контактные данные

## Полезные команды Git

```bash
# Проверить статус
git status

# Добавить изменения
git add .

# Закоммитить
git commit -m "Описание изменений"

# Отправить на GitHub
git push

# Посмотреть историю
git log --oneline

# Создать новую ветку
git checkout -b feature/new-feature

# Переключиться на main
git checkout main

# Слить ветку
git merge feature/new-feature
```

## Рекомендации

1. **Используйте осмысленные коммиты**: `feat:`, `fix:`, `docs:`, `refactor:`
2. **Создавайте ветки для новых функций**: не работайте напрямую в main
3. **Добавьте темы и теги**: для лучшей видимости репозитория
4. **Включите Issues**: для отслеживания багов и предложений
5. **Добавьте badges**: статус сборки, лицензия, версия

## Пример badges для README

```markdown
![Build Status](https://github.com/YOUR_USERNAME/sprint-planning-simulator/workflows/Docker%20Build%20and%20Push/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
```

## Troubleshooting

### Ошибка аутентификации
Используйте Personal Access Token вместо пароля:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Выберите scopes: `repo`, `workflow`
4. Используйте токен вместо пароля при push

### Конфликты при push
```bash
# Получить изменения с GitHub
git pull origin main --rebase

# Разрешить конфликты
# Затем продолжить
git rebase --continue

# Отправить
git push
```

