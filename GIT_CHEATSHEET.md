# Git Шпаргалка для публикации на GitHub

## 🚀 Быстрый старт (3 команды)

```bash
# 1. Создайте репозиторий на GitHub.com
# 2. Затем выполните:

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sprint-planning-simulator.git
git branch -M main
git push -u origin main
```

---

## 📝 Пошаговая инструкция

### 1️⃣ Создание репозитория на GitHub

1. Откройте https://github.com
2. Нажмите "+" → "New repository"
3. Название: `sprint-planning-simulator`
4. **НЕ ставьте галочки** (README, .gitignore, license уже есть!)
5. Нажмите "Create repository"

### 2️⃣ Инициализация локального репозитория

```bash
cd sprint-planning-simulator
git init
```

### 3️⃣ Настройка Git (первый раз)

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "your.email@example.com"
```

### 4️⃣ Добавление файлов

```bash
# Добавить все файлы
git add .

# Проверить, что будет закоммичено
git status
```

### 5️⃣ Создание коммита

```bash
git commit -m "Initial commit: Sprint Planning Simulator"
```

### 6️⃣ Подключение к GitHub

```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/sprint-planning-simulator.git

# Проверить
git remote -v
```

### 7️⃣ Отправка на GitHub

```bash
git branch -M main
git push -u origin main
```

**Аутентификация:**
- Username: ваш GitHub username
- Password: **Personal Access Token** (НЕ пароль!)
  - Создать: https://github.com/settings/tokens
  - Scopes: `repo`, `workflow`

---

## 🔑 Получение Personal Access Token

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. Выберите scopes:
   - ✅ `repo` (все подпункты)
   - ✅ `workflow`
4. "Generate token"
5. **СКОПИРУЙТЕ ТОКЕН** (показывается только один раз!)
6. Используйте его вместо пароля при `git push`

---

## 🛠️ Полезные команды

### Проверка статуса

```bash
git status              # Текущий статус
git status -s           # Краткий статус
git log --oneline       # История коммитов
git remote -v           # Список remote
```

### Работа с изменениями

```bash
git add file.txt        # Добавить конкретный файл
git add .               # Добавить все файлы
git add *.js            # Добавить все .js файлы

git commit -m "message" # Закоммитить
git commit -am "msg"    # Add + commit (только для tracked файлов)

git push                # Отправить на GitHub
git pull                # Получить с GitHub
```

### Отмена изменений

```bash
git checkout -- file.txt    # Отменить изменения в файле
git reset HEAD file.txt     # Убрать из staging
git reset --soft HEAD~1     # Отменить последний коммит (изменения остаются)
git reset --hard HEAD~1     # Отменить последний коммит (удалить изменения!)
```

### Работа с ветками

```bash
git branch                  # Список веток
git branch feature-name     # Создать ветку
git checkout feature-name   # Переключиться на ветку
git checkout -b feature     # Создать и переключиться

git merge feature-name      # Слить ветку в текущую
git branch -d feature-name  # Удалить ветку
```

### Работа с remote

```bash
git remote -v                       # Показать remote
git remote add origin URL           # Добавить remote
git remote set-url origin NEW_URL   # Изменить URL
git remote remove origin            # Удалить remote
```

---

## 🐛 Решение проблем

### "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/sprint-planning-simulator.git
```

### "failed to push some refs"

```bash
git pull origin main --rebase
git push
```

### "Permission denied (publickey)"

```bash
# Используйте HTTPS вместо SSH
git remote set-url origin https://github.com/YOUR_USERNAME/sprint-planning-simulator.git
```

### Случайно закоммитили node_modules

```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

---

## 📦 Автоматические скрипты

### Вариант 1: Интерактивный скрипт

```bash
./publish-to-github.sh
```

### Вариант 2: Ручные команды

```bash
# Замените YOUR_USERNAME на ваш username
GITHUB_USER="YOUR_USERNAME"
REPO_NAME="sprint-planning-simulator"

git init
git add .
git commit -m "Initial commit: Sprint Planning Simulator"
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🎯 Рекомендации

### ✅ Хорошие практики

```bash
# Осмысленные коммиты
git commit -m "feat: add PDF export"
git commit -m "fix: resolve dependency bug"
git commit -m "docs: update README"

# Работа в ветках
git checkout -b feature/dark-theme
# ... изменения ...
git commit -m "feat: add dark theme"
git push -u origin feature/dark-theme
# Создать Pull Request на GitHub
```

### ❌ Плохие практики

```bash
# Неинформативные коммиты
git commit -m "update"
git commit -m "fix"
git commit -m "changes"

# Работа напрямую в main
# Лучше создавайте ветки для новых функций
```

---

## 📚 Дополнительные ресурсы

- **Git документация**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Интерактивное обучение**: https://learngitbranching.js.org

---

## ✨ После публикации

### 1. Настройте GitHub Pages

```bash
# Установить gh-pages
pnpm add -D gh-pages

# Добавить в package.json
"homepage": "https://YOUR_USERNAME.github.io/sprint-planning-simulator",
"scripts": {
  "deploy": "gh-pages -d client/dist"
}

# Задеплоить
pnpm run deploy
```

### 2. Добавьте badges в README

```markdown
![Build](https://github.com/YOUR_USERNAME/sprint-planning-simulator/workflows/Docker%20Build%20and%20Push/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

### 3. Настройте темы репозитория

Settings → Topics:
- `agile`
- `scrum`
- `sprint-planning`
- `react`
- `typescript`
- `docker`

---

## 🎉 Готово!

Ваш проект на GitHub: `https://github.com/YOUR_USERNAME/sprint-planning-simulator`

**Не забудьте:**
- ⭐ Попросить друзей поставить звезду
- 📢 Поделиться в соцсетях
- 📝 Следить за issues
- 🚀 Развивать проект дальше

