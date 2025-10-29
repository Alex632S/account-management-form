import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTableSettingsStore } from '../../src/stores/tableSettings' // ← относительный путь
import { ColumnField } from '../../src/types/accounts' // ← относительный путь

describe('tableSettings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('загружает настройки по умолчанию', () => {
    const store = useTableSettingsStore()

    expect(store.columnSettings).toHaveLength(0)
    expect(store.availableTags).toEqual([
      'админ',
      'пользователь',
      'тестовый',
      'производство',
    ])
  })

  it('сохраняет настройки', () => {
    const store = useTableSettingsStore()
    const newSettings = {
      columns: [
        { field: ColumnField.LOGIN, header: 'Логин', visible: true },
        { field: ColumnField.TYPE, header: 'Тип', visible: false },
      ],
      tags: ['новый', 'тег'],
    }

    store.saveSettings(newSettings)

    expect(store.columnSettings).toEqual(newSettings.columns)
    expect(store.availableTags).toEqual(newSettings.tags)
  })

  it('фильтрует видимые колонки', () => {
    const store = useTableSettingsStore()
    store.columnSettings = [
      { field: ColumnField.LOGIN, header: 'Логин', visible: true },
      { field: ColumnField.TYPE, header: 'Тип', visible: false },
      { field: ColumnField.PASSWORD, header: 'Пароль', visible: true },
    ]

    const visible = store.visibleColumns

    expect(visible).toHaveLength(2)
    expect(visible[0].field).toBe(ColumnField.LOGIN)
    expect(visible[1].field).toBe(ColumnField.PASSWORD)
  })
})
