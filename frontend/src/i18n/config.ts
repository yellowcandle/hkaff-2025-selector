import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import locale files
import commonTC from '../locales/tc/common.json'
import commonEN from '../locales/en/common.json'

// Language detection from localStorage
const getStoredLanguage = (): 'tc' | 'en' => {
  try {
    const stored = localStorage.getItem('hkaff_2025_selections')
    if (stored) {
      const data = JSON.parse(stored)
      return data.preferences?.language || 'tc'
    }
  } catch (error) {
    console.warn('Failed to load language preference from localStorage')
  }
  return 'tc'
}

const resources = {
  tc: {
    common: commonTC
  },
  en: {
    common: commonEN
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(), // Load from localStorage
    fallbackLng: 'tc',

    ns: ['common'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false
    }
  })

// Sync language changes to localStorage
i18n.on('languageChanged', (lng: string) => {
  try {
    const stored = localStorage.getItem('hkaff_2025_selections')
    const data = stored ? JSON.parse(stored) : {
      version: 1,
      last_updated: new Date().toISOString(),
      selections: [],
      preferences: { language: 'tc' }
    }

    data.preferences.language = lng as 'tc' | 'en'
    data.last_updated = new Date().toISOString()
    localStorage.setItem('hkaff_2025_selections', JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save language preference:', error)
  }
})

export default i18n