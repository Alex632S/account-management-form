export const ru = {
  toolbar: {
    addAccount: 'Добавить учетную запись',
    addAccountTooltip: 'Создать новую учетную запись',
    saveChanges: 'Сохранить изменения',
    saveChangesTooltip: 'Сохранить все изменения',
    noChangesTooltip: 'Нет изменений для сохранения',
    settings: 'Открыть настройки таблицы',
  },

  table: {
    emptyState: {
      icon: 'pi pi-users',
      title: 'Нет учетных записей',
      description:
        'Нажмите кнопку "Добавить учетную запись" чтобы создать первую запись',
    },
    loading: 'Загрузка данных...',
    actions: {
      header: 'Действия',
      delete: 'Удалить учетную запись',
      deleteConfirmation: (login: string) =>
        `Учетная запись "${login || 'без логина'}" была удалена`,
    },
  },

  columns: {
    labels: {
      header: 'Метки',
      placeholder: 'Выберите метки',
      tooltip:
        'Выберите метки из списка. Поле необязательное. Каждая метка не более 50 символов.',
      multiselect: {
        selectLabel: 'Выбрать',
        deselectLabel: 'Убрать',
        selectedItemsLabel: '{0} элементов выбрано',
        emptyFilterMessage: 'Результаты не найдены',
        emptyMessage: 'Нет доступных меток',
      },
    },
    type: {
      header: 'Тип записи',
      placeholder: 'Выбрать тип',
      tooltip:
        'Выберите тип учетной записи. LDAP - для интеграции с Active Directory, Локальная - для хранения в локальной базе данных.',
      emptyMessage: 'Нет доступных типов',
      emptyFilterMessage: 'Результаты не найдены',
    },
    login: {
      header: 'Логин',
      placeholder: 'Введите логин пользователя',
      tooltip:
        'Введите уникальный логин пользователя. Обязательное поле. Минимум 3 символа. Допустимы буквы, цифры и символ подчеркивания.',
    },
    password: {
      header: 'Пароль',
      placeholder: 'Введите пароль',
      tooltip: 'Пароль не требуется для учетных записей типа LDAP',
      passwordInput: {
        promptLabel: 'Сложность пароля',
        weakLabel: 'Простой',
        mediumLabel: 'Средний',
        strongLabel: 'Сложный',
        toggleMaskLabel: 'Показать/скрыть пароль',
      },
    },
  },

  accountTypes: {
    ldap: 'LDAP',
    local: 'Локальная',
  },

  settings: {
    header: 'Настройки таблицы',
    columns: {
      title: 'Настройки колонок',
      name: 'Название колонки',
      visibility: 'Видимость',
      namePlaceholder: 'Введите название колонки',
      nameTooltip: 'Максимум 50 символов.',
      visibleTooltip: {
        true: 'Колонка отображается в таблице',
        false: 'Колонка скрыта из таблицы',
      },
    },
    tags: {
      title: 'Настройки тегов',
      description:
        'Теги, которые будут доступны для выбора в поле "Метки". Введите тег и нажмите Enter',
      tooltip:
        'Добавляйте теги, которые будут отображаться в выпадающем списке меток. Вводите тег и нажимайте Enter для добавления.',
    },
    buttons: {
      save: 'Сохранить настройки',
      saveTooltip: 'Применить изменения настроек и закрыть окно',
      cancel: 'Отмена',
      cancelTooltip: 'Закрыть окно без сохранения изменений',
    },
  },

  notifications: {
    success: {
      save: {
        title: 'Успешно',
        message: 'Все изменения успешно сохранены',
      },
      settings: {
        title: 'Настройки сохранены',
        message: 'Настройки таблицы успешно обновлены',
      },
    },
    info: {
      newAccount: {
        title: 'Новая запись',
        message: 'Добавлена новая учетная запись',
      },
    },
    warn: {
      delete: {
        title: 'Удаление',
        message: 'Учетная запись была удалена',
      },
    },
    error: {
      validation: {
        title: 'Ошибка валидации',
        message: 'Пожалуйста, заполните все обязательные поля корректно',
      },
    },
  },

  validation: {
    login: {
      minLength: 'Логин должен содержать минимум 3 символа',
      invalidChars:
        'Логин может содержать только буквы, цифры и символ подчеркивания',
    },
    password: {
      minLength: 'Пароль должен содержать минимум 6 символов',
    },
    labels: {
      maxLength: (label: string) => `Метка "${label}" превышает 50 символов`,
    },
    columnHeader: {
      required: 'Название колонки не может быть пустым',
      maxLength: 'Название колонки не должно превышать 50 символов',
    },
  },
}
