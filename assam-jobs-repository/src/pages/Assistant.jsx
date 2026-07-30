import React from 'react'
import TopBar from '../components/common/TopBar.jsx'
import AIAssistant from '../components/assistant/AIAssistant.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function Assistant() {
  const { t } = useLanguage()
  return (
    <>
      <TopBar title={t('assistant')} />
      <AIAssistant />
    </>
  )
}
