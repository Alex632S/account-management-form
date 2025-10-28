import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const LightTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eaeef7',
      100: '#d5dcee',
      200: '#abb9dd',
      300: '#8197cd',
      400: '#5774bc',
      500: '#2d51ab',
      600: '#244189',
      700: '#1b3167',
      800: '#122045',
      900: '#091022',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
})
