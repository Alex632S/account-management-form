<template>
  <div class="account-management">
    <div class="toolbar">
      <Button
        :label="t.toolbar.addAccount"
        icon="pi pi-plus"
        @click="handleAddAccount"
        v-tooltip="t.toolbar.addAccountTooltip"
      />
      <Button
        :label="t.toolbar.saveChanges"
        icon="pi pi-save"
        @click="handleSaveAllChanges"
        :disabled="!accountsStore.hasUnsavedChanges"
        v-tooltip="
          accountsStore.hasUnsavedChanges
            ? t.toolbar.saveChangesTooltip
            : t.toolbar.noChangesTooltip
        "
      />
      <Button
        icon="pi pi-cog"
        @click="showSettingsModal = true"
        class="p-button-secondary"
        v-tooltip="t.toolbar.settings"
      />
    </div>

    <DataTable
      showGridlines
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :value="accountsStore.accounts"
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
              @click="handleDeleteAccount(data.id)"
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
                  :options="tableSettingsStore.availableTags"
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

    <SettingsModal
      :model-value="showSettingsModal"
      :column-settings="tableSettingsStore.columnSettings"
      :available-tags="tableSettingsStore.availableTags"
      @update:model-value="showSettingsModal = $event"
      @save-settings="handleSaveSettings"
    />

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import MultiSelect from 'primevue/multiselect'
import Toast from 'primevue/toast'
import ValidatedField from '@/components/ValidatedField.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import { ru } from '@/locales/ru'
import {
  AccountType,
  ColumnField,
  type AccountTypeOption,
  type ColumnSetting,
} from '@/types/accounts.ts'

import { useAccountsStore } from '@/stores/accounts'
import { useTableSettingsStore } from '@/stores/tableSettings'
import { useValidation } from '@/composables/useValidation'
import { useNotifications } from './composables/useNotifications'

const t = ru

// Stores
const accountsStore = useAccountsStore()
const tableSettingsStore = useTableSettingsStore()

// Composables
const { loginRules, passwordRules, labelsRules } = useValidation(t)
const { showSuccess, showInfo, showWarn, showError } = useNotifications(t)

// Local state
const loading = ref(false)
const showSettingsModal = ref(false)

// Account types
const accountTypes = ref<AccountTypeOption[]>([
  { label: t.accountTypes.ldap, value: AccountType.LDAP },
  { label: t.accountTypes.local, value: AccountType.LOCAL },
])

// Computed - видимые колонки включая действия
const visibleColumns = computed(() => {
  const visibleSettings = tableSettingsStore.visibleColumns
  return [
    ...visibleSettings,
    {
      field: ColumnField.ACTIONS,
      header: t.table.actions.header,
      visible: true,
    },
  ]
})

// Event handlers
const handleAddAccount = () => {
  accountsStore.addNewAccount()
  showInfo('newAccount')
}

const handleDeleteAccount = (id: number) => {
  const account = accountsStore.deleteAccount(id)
  showWarn('delete', account?.login)
}

const handleSaveAllChanges = () => {
  accountsStore.markAllAsTouched()

  if (!accountsStore.validateAllAccounts) {
    showError('validation')
    return
  }

  accountsStore.saveAccounts()
  showSuccess('save')
}

const handleSaveSettings = (settings: {
  columns: ColumnSetting[]
  tags: string[]
}) => {
  tableSettingsStore.saveSettings(settings)
  showSuccess('settings')
}

// Field handlers
const onAccountTypeChange = (account: any) => {
  accountsStore.updateAccountType(account, account.type)
}

const onFieldBlur = (account: any) => {
  accountsStore.markAccountTouched(account)
}

const onFieldChange = () => {
  accountsStore.setHasUnsavedChanges(true)
}

const onValidation = (account: any, isValid: boolean) => {
  accountsStore.setAccountValidation(account, isValid)
}

// Lifecycle
onMounted(() => {
  accountsStore.loadAccounts()
  tableSettingsStore.loadSettings()
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
