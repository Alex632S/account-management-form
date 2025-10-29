### Приложение для управления учетными записями

Стек:

- Vue.js 3 + Composition API
- TypeScript
- Pinia
- Primevue
- Vitest

## Как запустить

```bash
# Установка зависимостей
npm install
```

# Запуск в режиме разработки
```bash
npm run dev
```

# Сборка для production
```bash
npm run build
```
## Тестирование

### Общий запуск всех тестов

```bash
# Запуск всех тестов
npm run test

# Запуск один раз (без watch mode)
npm run test:run
```

### Запуск конкретных тестов

```bash
# Тесты для accounts store
npm run test tests/stores/accounts.test.ts

# Тесты для tableSettings store  
npm run test tests/stores/tableSettings.test.ts

# Тесты для валидации
npm run test tests/composables/useValidation.test.ts
```

