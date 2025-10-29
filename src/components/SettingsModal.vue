<template>
  <Dialog
    :visible="modelValue"
    :header="t.settings.header"
    :modal="true"
    :style="{ width: '500px' }"
    @update:visible="$emit('update:modelValue', $event)"
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
        @click="handleApplySettings"
        v-tooltip="t.settings.buttons.saveTooltip"
      />
      <Button
        :label="t.settings.buttons.cancel"
        icon="pi pi-times"
        @click="handleCancelSettings"
        class="p-button-text"
        v-tooltip="t.settings.buttons.cancelTooltip"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Chips from 'primevue/chips'
import ValidatedField from '@/components/ValidatedField.vue'
import { ru } from '@/locales/ru'
import { useValidation } from '@/composables/useValidation'
import type { ColumnSetting } from '@/types/accounts.ts'

interface Props {
  modelValue: boolean
  columnSettings: ColumnSetting[]
  availableTags: string[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save-settings', settings: { columns: ColumnSetting[]; tags: string[] }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const t = ru
const { headerRule } = useValidation(t)

// Локальные копии для редактирования
const tempColumnSettings = ref<ColumnSetting[]>([])
const tempAvailableTags = ref<string[]>([])

// Инициализация временных данных при открытии модалки
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    tempColumnSettings.value = JSON.parse(JSON.stringify(props.columnSettings))
    tempAvailableTags.value = [...props.availableTags]
  }
})

const handleApplySettings = () => {
  emit('save-settings', {
    columns: JSON.parse(JSON.stringify(tempColumnSettings.value)),
    tags: [...tempAvailableTags.value]
  })
  emit('update:modelValue', false)
}

const handleCancelSettings = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
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
</style>