import React from 'react'
import TopBar from '../components/common/TopBar.jsx'
import JobList from '../components/jobs/JobList.jsx'
import SectorExplorer from '../components/jobs/SectorExplorer.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function Jobs() {
  const { t } = useLanguage()
  return (
    <>
      <TopBar title={t('jobs')} />
      <div className="p-4 pb-0">
        <SectorExplorer />
      </div>
      <JobList />
    </>
  )
}
