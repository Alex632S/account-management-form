import { useToast } from 'primevue/usetoast'

export function useNotifications(t: any) {
  const toast = useToast()

  const showSuccess = (type: 'save' | 'settings') => {
    toast.add({
      severity: 'success',
      summary: t.notifications.success[type].title,
      detail: t.notifications.success[type].message,
      life: 3000,
    })
  }

  const showInfo = (type: 'newAccount') => {
    toast.add({
      severity: 'info',
      summary: t.notifications.info[type].title,
      detail: t.notifications.info[type].message,
      life: 3000,
    })
  }

  const showWarn = (type: 'delete', login?: string) => {
    toast.add({
      severity: 'warn',
      summary: t.notifications.warn[type].title,
      detail: login
        ? t.table.actions.deleteConfirmation(login)
        : t.notifications.warn[type].message,
      life: 3000,
    })
  }

  const showError = (type: 'validation') => {
    toast.add({
      severity: 'error',
      summary: t.notifications.error[type].title,
      detail: t.notifications.error[type].message,
      life: 5000,
    })
  }

  return {
    showSuccess,
    showInfo,
    showWarn,
    showError,
  }
}
