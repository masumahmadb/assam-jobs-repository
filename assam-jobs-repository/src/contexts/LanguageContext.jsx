import React, { createContext, useContext, useState } from 'react'
import { translations } from '../utils/i18n.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en')

  function changeLanguage(code) {
    setLang(code)
    localStorage.setItem('lang', code)
  }

  function t(key) {
    return translations[lang]?.[key] ?? translations.en[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
