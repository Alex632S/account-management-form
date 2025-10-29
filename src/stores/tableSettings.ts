import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ColumnSetting } from '@/types/accounts'

export const useTableSettingsStore = defineStore('tableSettings', () => {
  const columnSettings = ref<ColumnSetting[]>([])
  const availableTags = ref<string[]>([
    'админ',
    'пользователь',
    'тестовый',
    'производство',
  ])
  const tempColumnSettings = ref<ColumnSetting[]>([])
  const tempAvailableTags = ref<string[]>([])
  const showSettingsModal = ref(false)

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('tableSettings')
    const savedTags = localStorage.getItem('availableTags')

    if (savedSettings) {
      columnSettings.value = JSON.parse(savedSettings)
    }

    if (savedTags) {
      availableTags.value = JSON.parse(savedTags)
    }
  }

  const saveSettings = () => {
    localStorage.setItem('tableSettings', JSON.stringify(columnSettings.value))
    localStorage.setItem('availableTags', JSON.stringify(availableTags.value))
  }

  const openSettings = () => {
    tempColumnSettings.value = JSON.parse(JSON.stringify(columnSettings.value))
    tempAvailableTags.value = [...availableTags.value]
    showSettingsModal.value = true
  }

  const applySettings = () => {
    columnSettings.value = JSON.parse(JSON.stringify(tempColumnSettings.value))
    availableTags.value = [...tempAvailableTags.value]
    saveSettings()
    showSettingsModal.value = false
  }

  const cancelSettings = () => {
    showSettingsModal.value = false
  }

  const visibleColumns = computed(() => {
    return columnSettings.value.filter((col: ColumnSetting) => col.visible)
  })

  return {
    columnSettings,
    availableTags,
    tempColumnSettings,
    tempAvailableTags,
    showSettingsModal,
    visibleColumns,
    loadSettings,
    saveSettings,
    openSettings,
    applySettings,
    cancelSettings,
  }
})
