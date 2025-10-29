import { describe, it, expect } from 'vitest'
import { useValidation } from '../../src/composables/useValidation' // ← относительный путь

const t = {
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

describe('useValidation', () => {
  const { loginRules, passwordRules, labelsRules, headerRule } =
    useValidation(t)

  describe('loginRules', () => {
    it('валидирует минимальную длину логина', () => {
      expect(loginRules[0]('ab')).toBe(t.validation.login.minLength)
      expect(loginRules[0]('abc')).toBe(true)
      expect(loginRules[0]('abcd')).toBe(true)
    })

    it('валидирует допустимые символы в логине', () => {
      expect(loginRules[1]('user@name')).toBe(t.validation.login.invalidChars)
      expect(loginRules[1]('user-name')).toBe(t.validation.login.invalidChars)
      expect(loginRules[1]('user_name123')).toBe(true)
      expect(loginRules[1]('User123')).toBe(true)
    })
  })

  describe('passwordRules', () => {
    it('валидирует минимальную длину пароля', () => {
      expect(passwordRules[0]('12345')).toBe(t.validation.password.minLength)
      expect(passwordRules[0]('123456')).toBe(true)
      expect(passwordRules[0]('password')).toBe(true)
    })
  })

  describe('labelsRules', () => {
    it('валидирует максимальную длину меток', () => {
      const longLabel = 'a'.repeat(51)
      expect(labelsRules[0]([longLabel])).toBe(
        `Метка "${longLabel}" превышает 50 символов`
      )
      expect(labelsRules[0](['valid'])).toBe(true)
      expect(labelsRules[0]([])).toBe(true)
    })
  })

  describe('headerRule', () => {
    it('валидирует обязательность заголовка', () => {
      expect(headerRule('')).toBe(t.validation.columnHeader.required)
      expect(headerRule('   ')).toBe(t.validation.columnHeader.required)
    })

    it('валидирует максимальную длину заголовка', () => {
      const longHeader = 'a'.repeat(51)
      expect(headerRule(longHeader)).toBe(t.validation.columnHeader.maxLength)
      expect(headerRule('Valid Header')).toBe(true)
    })
  })
})
