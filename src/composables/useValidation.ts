export function useValidation(t: any) {
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
      if (!value || value.length === 0) return true
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

  return {
    loginRules,
    passwordRules,
    labelsRules,
    headerRule,
  }
}
