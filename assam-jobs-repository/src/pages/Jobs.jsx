import React from 'react'
import TopBar from '../components/common/TopBar.jsx'
import JobList from '../components/jobs/JobList.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function Jobs() {
  const { t } = useLanguage()
  return (
    <>
      <TopBar title={t('jobs')} />
      <JobList />
    </>
  )
}
