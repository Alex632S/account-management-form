import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, AccountType } from '@/types/accounts'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const originalAccounts = ref<Account[]>([])
  const hasUnsavedChanges = ref(false)
  let nextId = 1

  const loadAccounts = () => {
    const saved = localStorage.getItem('accounts')
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
  }

  const saveAccounts = () => {
    const accountsToSave = accounts.value.map((acc) => ({
      id: acc.id,
      labels: acc.labelsArray ? acc.labelsArray.map((text) => ({ text })) : [],
      type: acc.type,
      login: acc.login,
      password: acc.type === 'local' ? acc.password : null,
      touched: acc.touched,
    }))

    localStorage.setItem('accounts', JSON.stringify(accountsToSave))
    originalAccounts.value = JSON.parse(JSON.stringify(accountsToSave))
    hasUnsavedChanges.value = false
  }

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
    return newAccount
  }

  const deleteAccount = (id: number) => {
    const account = accounts.value.find((acc: Account) => acc.id === id)
    accounts.value = accounts.value.filter((acc: Account) => acc.id !== id)
    hasUnsavedChanges.value = true
    return account
  }

  const updateAccountType = (account: Account, type: AccountType | null) => {
    account.type = type
    if (type === 'ldap') {
      account.password = null
    }
    account.touched = true
    hasUnsavedChanges.value = true
  }

  const markAccountTouched = (account: Account) => {
    account.touched = true
  }

  const markAllAsTouched = () => {
    accounts.value.forEach((account) => {
      account.touched = true
    })
  }

  const setAccountValidation = (account: Account, isValid: boolean) => {
    account.isValid = isValid
  }

  const validateAllAccounts = computed(() => {
    return accounts.value.every((account) => account.isValid)
  })

  const setHasUnsavedChanges = (value: boolean) => {
    hasUnsavedChanges.value = value
  }

  return {
    accounts,
    originalAccounts,
    hasUnsavedChanges,
    validateAllAccounts,
    loadAccounts,
    saveAccounts,
    addNewAccount,
    deleteAccount,
    updateAccountType,
    markAccountTouched,
    markAllAsTouched,
    setAccountValidation,
    setHasUnsavedChanges,
  }
})