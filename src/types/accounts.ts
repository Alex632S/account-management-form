//! Тех. долг
//@ts-ignore
export enum AccountType {
  LDAP = 'ldap',
  LOCAL = 'local',
}
//! Тех. долг
//@ts-ignore
export enum ColumnField {
  LABELS = 'labels',
  TYPE = 'type',
  LOGIN = 'login',
  PASSWORD = 'password',
  ACTIONS = 'actions',
}

export interface Account {
  id: number
  labelsArray: string[]
  type: AccountType | null
  login: string
  password: string | null
  touched: boolean
  isValid?: boolean
}

export interface ColumnSetting {
  field: ColumnField
  header: string
  visible: boolean
  style?: string
}

export interface AccountTypeOption {
  label: string
  value: AccountType
}
