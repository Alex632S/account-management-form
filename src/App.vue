<template>
  <div class="account-management">
    <div class="toolbar">
      <Button
        label="Добавить учетную запись"
        icon="pi pi-plus"
        @click="addNewAccount"
        v-tooltip="'Создать новую учетную запись'"
      />
      <Button
        label="Сохранить изменения"
        icon="pi pi-save"
        @click="saveAllChanges"
        :disabled="!hasUnsavedChanges"
        v-tooltip="
          hasUnsavedChanges
            ? 'Сохранить все изменения'
            : 'Нет изменений для сохранения'
        "
      />
      <Button
        icon="pi pi-cog"
        @click="openSettings"
        class="p-button-secondary"
        v-tooltip="'Открыть настройки таблицы'"
      />
    </div>

    <DataTable
      showGridlines
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :value="accounts"
      class="p-datatable-sm"
      :loading="loading"
    >
      <Column
        v-for="col in visibleColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :style="col.style"
      >
        <template #body="{ data, field }">
          <!-- Действия -->
          <div v-if="field === ColumnField.ACTIONS" class="actions-column">
            <Button
              icon="pi pi-trash"
              class="p-button-danger p-button-text"
              @click="deleteAccount(data.id)"
              v-tooltip="'Удалить учетную запись'"
            />
          </div>

          <!-- Метки -->
          <div v-else-if="field === ColumnField.LABELS">
            <ValidatedField
              v-model="data.labelsArray"
              :rules="labelsRules"
              :touched="data.touched"
              @change="onFieldChange"
              @validation="onValidation(data, $event)"
            >
              <template
                #default="{
                  modelValue,
                  updateModelValue,
                  blur,
                  change,
                  class: fieldClass,
                }"
              >
                <MultiSelect
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  @blur="blur"
                  @change="change"
                  :class="fieldClass"
                  :options="availableTags"
                  placeholder="Выберите метки"
                  :maxSelectedLabels="3"
                  display="chip"
                  :selectLabel="'Выбрать'"
                  :deselectLabel="'Убрать'"
                  :selectedItemsLabel="'{0} элементов выбрано'"
                  :emptyFilterMessage="'Результаты не найдены'"
                  :emptyMessage="'Нет доступных меток'"
                  v-tooltip="
                    'Выберите метки из списка. Поле необязательное. Каждая метка не более 50 символов.'
                  "
                />
              </template>
            </ValidatedField>
          </div>

          <!-- Тип записи -->
          <div v-else-if="field === ColumnField.TYPE">
            <ValidatedField
              v-model="data.type"
              :required="true"
              :touched="data.touched"
              @change="onAccountTypeChange(data)"
              @validation="onValidation(data, $event)"
            >
              <template
                #default="{
                  modelValue,
                  updateModelValue,
                  blur,
                  change,
                  class: fieldClass,
                }"
              >
                <Dropdown
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  @blur="blur"
                  @change="change"
                  :class="fieldClass"
                  :options="accountTypes"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Выбрать тип"
                  :emptyMessage="'Нет доступных типов'"
                  :emptyFilterMessage="'Результаты не найдены'"
                  v-tooltip="
                    'Выберите тип учетной записи. LDAP - для интеграции с Active Directory, Локальная - для хранения в локальной базе данных.'
                  "
                />
              </template>
            </ValidatedField>
          </div>

          <!-- Логин -->
          <div v-else-if="field === ColumnField.LOGIN">
            <ValidatedField
              v-model="data.login"
              :required="true"
              :rules="loginRules"
              :touched="data.touched"
              @blur="onFieldBlur(data)"
              @change="onFieldChange"
              @validation="onValidation(data, $event)"
            >
              <template
                #default="{
                  modelValue,
                  updateModelValue,
                  blur,
                  change,
                  class: fieldClass,
                }"
              >
                <InputText
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  @blur="blur"
                  @input="change"
                  :class="fieldClass"
                  :maxlength="100"
                  placeholder="Введите логин пользователя"
                  v-tooltip="
                    'Введите уникальный логин пользователя. Обязательное поле. Минимум 3 символа. Допустимы буквы, цифры и символ подчеркивания.'
                  "
                />
              </template>
            </ValidatedField>
          </div>

          <!-- Пароль -->
          <div v-else-if="field === ColumnField.PASSWORD">
            <ValidatedField
              v-if="data.type === AccountType.LOCAL"
              v-model="data.password"
              :required="data.type === AccountType.LOCAL"
              :rules="data.type === AccountType.LOCAL ? passwordRules : []"
              :touched="data.touched"
              @blur="onFieldBlur(data)"
              @change="onFieldChange"
              @validation="onValidation(data, $event)"
            >
              <template
                #default="{
                  modelValue,
                  updateModelValue,
                  blur,
                  change,
                  class: fieldClass,
                }"
              >
                <Password
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  @blur="blur"
                  @input="change"
                  :class="fieldClass"
                  :maxlength="100"
                  placeholder="Введите пароль"
                  :feedback="false"
                  :toggleMask="true"
                  :promptLabel="'Сложность пароля'"
                  :weakLabel="'Простой'"
                  :mediumLabel="'Средний'"
                  :strongLabel="'Сложный'"
                  :toggleMaskLabel="'Показать/скрыть пароль'"
                />
              </template>
            </ValidatedField>
            <span
              v-else
              class="password-placeholder"
              v-tooltip="'Пароль не требуется для учетных записей типа LDAP'"
              >—</span
            >
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="empty-state">
          <i class="pi pi-users empty-icon"></i>
          <h3>Нет учетных записей</h3>
          <p>
            Нажмите кнопку "Добавить учетную запись" чтобы создать первую запись
          </p>
        </div>
      </template>

      <template #loading>
        <div class="loading-state">
          <i class="pi pi-spinner pi-spin"></i>
          <span>Загрузка данных...</span>
        </div>
      </template>
    </DataTable>

    <!-- Модальное окно настроек -->
    <Dialog
      v-model:visible="showSettings"
      header="Настройки таблицы"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="settings-content">
        <h4>Настройки колонок</h4>
        <DataTable :value="tempColumnSettings" class="p-datatable-sm">
          <Column field="header" header="Название колонки">
            <template #body="{ data }">
              <ValidatedField
                v-model="data.header"
                :required="true"
                :rules="[headerRule]"
              >
                <template
                  #default="{
                    modelValue,
                    updateModelValue,
                    blur,
                    change,
                    class: fieldClass,
                  }"
                >
                  <InputText
                    :model-value="modelValue"
                    @update:model-value="updateModelValue"
                    @blur="blur"
                    @input="change"
                    :class="fieldClass"
                    placeholder="Введите название колонки"
                    v-tooltip="'Максимум 50 символов.'"
                  />
                </template>
              </ValidatedField>
            </template>
          </Column>

          <Column field="visible" header="Видимость">
            <template #body="{ data }">
              <Checkbox
                v-model="data.visible"
                :binary="true"
                :trueValue="true"
                :falseValue="false"
                v-tooltip="
                  data.visible
                    ? 'Колонка отображается в таблице'
                    : 'Колонка скрыта из таблицы'
                "
              />
            </template>
          </Column>
        </DataTable>

        <div class="tags-settings mt-4">
          <h4>Настройки тегов</h4>
          <p class="settings-description">
            Теги, которые будут доступны для выбора в поле "Метки". Введите тег
            и нажмите Enter
          </p>
          <Chips
            v-model="tempAvailableTags"
            separator=","
            class="w-full"
            :addOnBlur="true"
            :allowDuplicate="false"
            v-tooltip="
              'Добавляйте теги, которые будут отображаться в выпадающем списке меток. Вводите тег и нажимайте Enter для добавления.'
            "
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Сохранить настройки"
          icon="pi pi-check"
          @click="applySettings"
          v-tooltip="'Применить изменения настроек и закрыть окно'"
        />
        <Button
          label="Отмена"
          icon="pi pi-times"
          @click="cancelSettings"
          class="p-button-text"
          v-tooltip="'Закрыть окно без сохранения изменений'"
        />
      </template>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import MultiSelect from 'primevue/multiselect'
import Chips from 'primevue/chips'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import ValidatedField from '@/components/ValidatedField.vue'
import { AccountType, ColumnField, type Account, type ColumnSetting, type AccountTypeOption } from '@/types/accounts.ts'

// Toast
const toast = useToast()

// Refs
const accounts = ref<Account[]>([])
const loading = ref(false)
const showSettings = ref(false)
const availableTags = ref<string[]>([
  'админ',
  'пользователь',
  'тестовый',
  'производство',
])
const tempAvailableTags = ref<string[]>([])
const tempColumnSettings = ref<ColumnSetting[]>([])
const hasUnsavedChanges = ref(false)
const originalAccounts = ref<Account[]>([])

// Account types
const accountTypes = ref<AccountTypeOption[]>([
  { label: 'LDAP', value: AccountType.LDAP },
  { label: 'Локальная', value: AccountType.LOCAL },
])

// Column settings (без колонки Действия в настройках)
const columnSettings = ref<ColumnSetting[]>([
  { field: ColumnField.LABELS, header: 'Метки', visible: true },
  { field: ColumnField.TYPE, header: 'Тип записи', visible: true },
  { field: ColumnField.LOGIN, header: 'Логин', visible: true },
  { field: ColumnField.PASSWORD, header: 'Пароль', visible: true },
])

// Правила валидации
const loginRules = [
  (value: string) => {
    if (value && value.length < 3) {
      return 'Логин должен содержать минимум 3 символа'
    }
    return true
  },
  (value: string) => {
    if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Логин может содержать только буквы, цифры и символ подчеркивания'
    }
    return true
  },
]

const passwordRules = [
  (value: string) => {
    if (value && value.length < 6) {
      return 'Пароль должен содержать минимум 6 символов'
    }
    return true
  },
]

const labelsRules = [
  (value: string[]) => {
    if (!value || value.length === 0) return true // Необязательное поле

    for (const label of value) {
      if (label.length > 50) {
        return `Метка "${label}" превышает 50 символов`
      }
    }

    return true
  },
]

const headerRule = (value: string) => {
  if (!value || value.trim().length === 0) {
    return 'Название колонки не может быть пустым'
  }
  if (value.length > 50) {
    return 'Название колонки не должно превышать 50 символов'
  }
  return true
}

// Computed - видимые колонки включая действия
const visibleColumns = computed(() => {
  const visibleSettings = columnSettings.value.filter((col: ColumnSetting) => col.visible)
  // Всегда добавляем колонку действий в конец
  return [
    ...visibleSettings,
    { field: ColumnField.ACTIONS, header: 'Действия', visible: true },
  ]
})

// Генератор ID
let nextId = 1

// Загрузка данных из localStorage
const loadAccounts = () => {
  const saved = localStorage.getItem('accounts')
  const savedSettings = localStorage.getItem('tableSettings')
  const savedTags = localStorage.getItem('availableTags')

  if (saved) {
    const savedAccounts = JSON.parse(saved)
    accounts.value = savedAccounts.map((acc: any) => ({
      ...acc,
      labelsArray: acc.labels ? acc.labels.map((label: any) => label.text) : [],
      isValid: false,
    }))
    originalAccounts.value = JSON.parse(JSON.stringify(savedAccounts))

    const maxId = accounts.value.reduce((max: number, acc: Account) => Math.max(max, acc.id), 0)
    nextId = maxId + 1
  }

  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    columnSettings.value = settings
  }

  if (savedTags) {
    availableTags.value = JSON.parse(savedTags)
  }
}

// Сохранение данных в localStorage
const saveAccounts = () => {
  const accountsToSave = accounts.value.map((acc: Account) => ({
    id: acc.id,
    labels: acc.labelsArray ? acc.labelsArray.map((text: String) => ({ text })) : [],
    type: acc.type,
    login: acc.login,
    password: acc.type === AccountType.LOCAL ? acc.password : null,
    touched: acc.touched,
  }))

  localStorage.setItem('accounts', JSON.stringify(accountsToSave))
  originalAccounts.value = JSON.parse(JSON.stringify(accountsToSave))
  hasUnsavedChanges.value = false

  toast.add({
    severity: 'success',
    summary: 'Успешно',
    detail: 'Все изменения успешно сохранены',
    life: 3000,
  })
}

// Добавление новой учетной записи
const addNewAccount = () => {
  const newAccount: Account = {
    id: nextId++,
    labelsArray: [],
    type: null,
    login: '',
    password: '',
    touched: false,
    isValid: false,
  }
  accounts.value.push(newAccount)
  hasUnsavedChanges.value = true

  toast.add({
    severity: 'info',
    summary: 'Новая запись',
    detail: 'Добавлена новая учетная запись',
    life: 3000,
  })
}

// Удаление учетной записи
const deleteAccount = (id: number) => {
  const account = accounts.value.find((acc: Account) => acc.id === id)
  accounts.value = accounts.value.filter((acc: Account) => acc.id !== id)
  hasUnsavedChanges.value = true

  toast.add({
    severity: 'warn',
    summary: 'Удаление',
    detail: `Учетная запись "${account?.login || 'без логина'}" была удалена`,
    life: 3000,
  })
}

// Обработчик изменения типа учетной записи
const onAccountTypeChange = (account: Account) => {
  if (account.type === AccountType.LDAP) {
    account.password = null
  }
  account.touched = true
  hasUnsavedChanges.value = true
}

// Обработчик потери фокуса
const onFieldBlur = (account: Account) => {
  account.touched = true
}

// Обработчик изменения поля
const onFieldChange = () => {
  hasUnsavedChanges.value = true
}

// Обработчик валидации
const onValidation = (account: Account, isValid: boolean) => {
  account.isValid = isValid
}

// Сохранение всех изменений
const saveAllChanges = () => {
  // Помечаем все записи как touched для показа ошибок
  accounts.value.forEach((account: Account) => {
    account.touched = true
  })

  // Валидируем все записи перед сохранением
  const allValid = accounts.value.every((account: Account) => account.isValid)

  if (!allValid) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка валидации',
      detail: 'Пожалуйста, заполните все обязательные поля корректно',
      life: 5000,
    })
    return
  }

  saveAccounts()
}

// Открытие настроек
const openSettings = () => {
  // Создаем временные копии настроек для редактирования
  tempColumnSettings.value = JSON.parse(JSON.stringify(columnSettings.value))
  tempAvailableTags.value = [...availableTags.value]
  showSettings.value = true
}

// Применение настроек
const applySettings = () => {
  // Применяем изменения из временных настроек
  columnSettings.value = JSON.parse(JSON.stringify(tempColumnSettings.value))
  availableTags.value = [...tempAvailableTags.value]

  localStorage.setItem('tableSettings', JSON.stringify(columnSettings.value))
  localStorage.setItem('availableTags', JSON.stringify(availableTags.value))
  showSettings.value = false

  toast.add({
    severity: 'success',
    summary: 'Настройки сохранены',
    detail: 'Настройки таблицы успешно обновлены',
    life: 3000,
  })
}

// Отмена настроек
const cancelSettings = () => {
  // Не применяем изменения, просто закрываем окно
  showSettings.value = false
}

// Загрузка данных при монтировании
onMounted(() => {
  loadAccounts()
})
</script>

<style scoped>
.account-management {
  padding: 1rem;
  margin: 0 2rem;
}

.toolbar {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.actions-column {
  display: flex;
  justify-content: center;
}

.password-placeholder {
  color: #6c757d;
  font-style: italic;
}

.settings-content {
  max-height: 60vh;
  overflow-y: auto;
}

.mt-4 {
  margin-top: 1.5rem;
}

.settings-description {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-weight: 400;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 0.5rem;
  color: #6b7280;
}
</style>
