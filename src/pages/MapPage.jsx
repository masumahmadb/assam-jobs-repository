import React from 'react'
import TopBar from '../components/common/TopBar.jsx'
import EligibilityMap from '../components/map/EligibilityMap.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function MapPage() {
  const { t } = useLanguage()
  return (
    <>
      <TopBar title={t('map')} />
      <EligibilityMap />
    </>
  )
}
