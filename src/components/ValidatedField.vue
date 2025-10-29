<template>
  <div class="validated-field">
    <div class="field-wrapper">
      <slot
        :model-value="modelValue"
        :update-model-value="handleInput"
        :blur="handleBlur"
        :change="handleChange"
        :class="fieldClasses"
        :is-valid="isValid"
        :is-invalid="showError"
      >
        <!-- Fallback для обратной совместимости -->
        <component
          :is="component"
          v-bind="componentProps"
          :model-value="modelValue"
          @update:model-value="handleInput"
          @blur="handleBlur"
          @change="handleChange"
          :class="fieldClasses"
        />
      </slot>
    </div>
    <div v-if="showError && errorMessage" class="error-message">
      <i class="pi pi-exclamation-circle error-icon"></i>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: any //! Дополнить типами 
  component?: any //! Дополнить типами  
  componentProps?: Record<string, any> //! Дополнить типами 
  rules?: ((value: any) => string | boolean)[] //! Дополнить типами 
  required?: boolean
  touched?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  component: null,
  componentProps: () => ({}),
  rules: () => [],
  required: false,
  touched: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: any] //! Дополнить типами 
  blur: []
  change: []
  validation: [isValid: boolean]
}>()

// Вычисляем ошибки валидации
const errors = computed(() => {
  const errors: string[] = []

  if (
    props.required &&
    (!props.modelValue ||
      (Array.isArray(props.modelValue) && props.modelValue.length === 0) ||
      (typeof props.modelValue === 'string' && props.modelValue.trim() === ''))
  ) {
    errors.push('Это поле обязательно для заполнения')
  }

  // Применяем кастомные правила
  props.rules.forEach((rule) => {
    const result = rule(props.modelValue)
    if (typeof result === 'string') {
      errors.push(result)
    }
  })

  return errors
})

const errorMessage = computed(() => {
  return errors.value[0] || ''
})

const isValid = computed(() => {
  return errors.value.length === 0
})

const showError = computed(() => {
  return props.touched && !isValid.value
})

const fieldClasses = computed(() => ({
  'field-invalid': showError.value,
  'field-valid': props.touched && isValid.value && props.modelValue,
}))

const handleInput = (value: any) => {
  emit('update:modelValue', value)
}

const handleBlur = () => {
  emit('blur')
  emit('validation', isValid.value)
}

const handleChange = () => {
  emit('change')
  emit('validation', isValid.value)
}

// Экспортируем computed свойства для использования в слоте
defineExpose({
  isValid,
  showError,
  errorMessage,
  fieldClasses,
})
</script>

<style scoped>
.validated-field {
  width: 100%;
}

.field-wrapper {
  width: 100%;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #e24c4c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-icon {
  font-size: 0.875rem;
}

:deep(.field-invalid .p-component) {
  border-color: #e24c4c !important;
}
</style>
