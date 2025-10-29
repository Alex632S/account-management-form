import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from '../../src/stores/accounts' // ← исправленный путь

describe('accounts store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('добавляет новую учетную запись', () => {
    const store = useAccountsStore()

    store.addNewAccount()

    expect(store.accounts).toHaveLength(1)
    expect(store.accounts[0]).toMatchObject({
      id: 1,
      labelsArray: [],
      type: null,
      login: '',
      password: '',
      touched: false,
      isValid: false,
    })
    expect(store.hasUnsavedChanges).toBe(true)
  })

  it('удаляет учетную запись', () => {
    const store = useAccountsStore()
    store.addNewAccount()
    store.addNewAccount()

    const deletedAccount = store.deleteAccount(1)

    expect(store.accounts).toHaveLength(1)
    expect(store.accounts[0].id).toBe(2)
    expect(deletedAccount?.id).toBe(1)
    expect(store.hasUnsavedChanges).toBe(true)
  })

  it('обновляет тип учетной записи', () => {
    const store = useAccountsStore()
    store.addNewAccount()
    const account = store.accounts[0]

    store.updateAccountType(account, 'ldap')

    expect(account.type).toBe('ldap')
    expect(account.password).toBeNull()
    expect(account.touched).toBe(true)
    expect(store.hasUnsavedChanges).toBe(true)
  })

  it('помечает все учетные записи как touched', () => {
    const store = useAccountsStore()
    store.addNewAccount()
    store.addNewAccount()

    store.markAllAsTouched()

    store.accounts.forEach((account) => {
      expect(account.touched).toBe(true)
    })
  })

  it('валидирует все учетные записи', () => {
    const store = useAccountsStore()
    store.addNewAccount()
    store.addNewAccount()

    // Все записи невалидны изначально
    expect(store.validateAllAccounts).toBe(false)

    // Делаем записи валидными
    store.accounts.forEach((account) => {
      store.setAccountValidation(account, true)
    })

    expect(store.validateAllAccounts).toBe(true)
  })
})
