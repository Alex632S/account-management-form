<template>
  <div class="account-management">
    <div class="toolbar">
      <Button
        :label="t.toolbar.addAccount"
        icon="pi pi-plus"
        @click="addNewAccount"
        v-tooltip="t.toolbar.addAccountTooltip"
      />
      <Button
        :label="t.toolbar.saveChanges"
        icon="pi pi-save"
        @click="saveAllChanges"
        :disabled="!hasUnsavedChanges"
        v-tooltip="
          hasUnsavedChanges
            ? t.toolbar.saveChangesTooltip
            : t.toolbar.noChangesTooltip
        "
      />
      <Button
        icon="pi pi-cog"
        @click="openSettings"
        class="p-button-secondary"
        v-tooltip="t.toolbar.settings"
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
              v-tooltip="t.table.actions.delete"
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
                  :placeholder="t.columns.labels.placeholder"
                  :maxSelectedLabels="3"
                  display="chip"
                  :selectLabel="t.columns.labels.multiselect.selectLabel"
                  :deselectLabel="t.columns.labels.multiselect.deselectLabel"
                  :selectedItemsLabel="
                    t.columns.labels.multiselect.selectedItemsLabel
                  "
                  :emptyFilterMessage="
                    t.columns.labels.multiselect.emptyFilterMessage
                  "
                  :emptyMessage="t.columns.labels.multiselect.emptyMessage"
                  v-tooltip="t.columns.labels.tooltip"
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
                  :placeholder="t.columns.type.placeholder"
                  :emptyMessage="t.columns.type.emptyMessage"
                  :emptyFilterMessage="t.columns.type.emptyFilterMessage"
                  v-tooltip="t.columns.type.tooltip"
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
                  :placeholder="t.columns.login.placeholder"
                  v-tooltip="t.columns.login.tooltip"
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
                  :placeholder="t.columns.password.placeholder"
                  :feedback="false"
                  :toggleMask="true"
                  :promptLabel="t.columns.password.passwordInput.promptLabel"
                  :weakLabel="t.columns.password.passwordInput.weakLabel"
                  :mediumLabel="t.columns.password.passwordInput.mediumLabel"
                  :strongLabel="t.columns.password.passwordInput.strongLabel"
                  :toggleMaskLabel="
                    t.columns.password.passwordInput.toggleMaskLabel
                  "
                />
              </template>
            </ValidatedField>
            <span
              v-else
              class="password-placeholder"
              v-tooltip="t.columns.password.tooltip"
              >—</span
            >
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="empty-state">
          <i :class="t.table.emptyState.icon + ' empty-icon'"></i>
          <h3>{{ t.table.emptyState.title }}</h3>
          <p>{{ t.table.emptyState.description }}</p>
        </div>
      </template>

      <template #loading>
        <div class="loading-state">
          <i class="pi pi-spinner pi-spin"></i>
          <span>{{ t.table.loading }}</span>
        </div>
      </template>
    </DataTable>

    <!-- Модальное окно настроек -->
    <Dialog
      v-model:visible="showSettings"
      :header="t.settings.header"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="settings-content">
        <h4>{{ t.settings.columns.title }}</h4>
        <DataTable :value="tempColumnSettings" class="p-datatable-sm">
          <Column :header="t.settings.columns.name">
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
                    :placeholder="t.settings.columns.namePlaceholder"
                    v-tooltip="t.settings.columns.nameTooltip"
                  />
                </template>
              </ValidatedField>
            </template>
          </Column>

          <Column :header="t.settings.columns.visibility">
            <template #body="{ data }">
              <Checkbox
                v-model="data.visible"
                :binary="true"
                :trueValue="true"
                :falseValue="false"
                v-tooltip="
                  data.visible
                    ? t.settings.columns.visibleTooltip.true
                    : t.settings.columns.visibleTooltip.false
                "
              />
            </template>
          </Column>
        </DataTable>

        <div class="tags-settings mt-4">
          <h4>{{ t.settings.tags.title }}</h4>
          <p class="settings-description">
            {{ t.settings.tags.description }}
          </p>
          <Chips
            v-model="tempAvailableTags"
            separator=","
            class="w-full"
            :addOnBlur="true"
            :allowDuplicate="false"
            v-tooltip="t.settings.tags.tooltip"
          />
        </div>
      </div>

      <template #footer>
        <Button
          :label="t.settings.buttons.save"
          icon="pi pi-check"
          @click="applySettings"
          v-tooltip="t.settings.buttons.saveTooltip"
        />
        <Button
          :label="t.settings.buttons.cancel"
          icon="pi pi-times"
          @click="cancelSettings"
          class="p-button-text"
          v-tooltip="t.settings.buttons.cancelTooltip"
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
import { ru } from '@/locales/ru'
import {
  AccountType,
  ColumnField,
  type Account,
  type ColumnSetting,
  type AccountTypeOption,
} from '@/types/accounts.ts'

const t = ru

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
  { label: t.accountTypes.ldap, value: AccountType.LDAP },
  { label: t.accountTypes.local, value: AccountType.LOCAL },
])

// Column settings (без колонки Действия в настройках)
const columnSettings = ref<ColumnSetting[]>([
  { field: ColumnField.LABELS, header: t.columns.labels.header, visible: true },
  { field: ColumnField.TYPE, header: t.columns.type.header, visible: true },
  { field: ColumnField.LOGIN, header: t.columns.login.header, visible: true },
  {
    field: ColumnField.PASSWORD,
    header: t.columns.password.header,
    visible: true,
  },
])

// Правила валидации
const loginRules = [
  (value: string) => {
    if (value && value.length < 3) {
      return t.validation.login.minLength
    }
    return true
  },
  (value: string) => {
    if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
      return t.validation.login.invalidChars
    }
    return true
  },
]

const passwordRules = [
  (value: string) => {
    if (value && value.length < 6) {
      return t.validation.password.minLength
    }
    return true
  },
]

const labelsRules = [
  (value: string[]) => {
    if (!value || value.length === 0) return true // Необязательное поле

    for (const label of value) {
      if (label.length > 50) {
        return t.validation.labels.maxLength(label)
      }
    }

    return true
  },
]

const headerRule = (value: string) => {
  if (!value || value.trim().length === 0) {
    return t.validation.columnHeader.required
  }
  if (value.length > 50) {
    return t.validation.columnHeader.maxLength
  }
  return true
}

// Computed - видимые колонки включая действия
const visibleColumns = computed(() => {
  const visibleSettings = columnSettings.value.filter(
    (col: ColumnSetting) => col.visible
  )
  // Всегда добавляем колонку действий в конец
  return [
    ...visibleSettings,
    {
      field: ColumnField.ACTIONS,
      header: t.table.actions.header,
      visible: true,
    },
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

    const maxId = accounts.value.reduce(
      (max: number, acc: Account) => Math.max(max, acc.id),
      0
    )
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
    labels: acc.labelsArray
      ? acc.labelsArray.map((text: string) => ({ text }))
      : [],
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
    summary: t.notifications.success.save.title,
    detail: t.notifications.success.save.message,
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
    summary: t.notifications.info.newAccount.title,
    detail: t.notifications.info.newAccount.message,
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
    summary: t.notifications.warn.delete.title,
    detail: t.table.actions.deleteConfirmation(account?.login || ''),
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
      summary: t.notifications.error.validation.title,
      detail: t.notifications.error.validation.message,
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
    summary: t.notifications.success.settings.title,
    detail: t.notifications.success.settings.message,
    life: 3000,
  })
}

// Отмена настроек
const cancelSettings = () => {
  showSettings.value = false
}

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
