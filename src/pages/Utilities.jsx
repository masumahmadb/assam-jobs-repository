import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopBar from '../components/common/TopBar.jsx'
import CVBuilder from '../components/cv/CVBuilder.jsx'
import PhotoResizer from '../components/vault/PhotoResizer.jsx'
import DocumentScanner from '../components/vault/DocumentScanner.jsx'
import DocumentVault from '../components/vault/DocumentVault.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

const TABS = [
  { key: 'cv', label: 'CV Builder', Comp: CVBuilder },
  { key: 'resizer', label: 'Photo Resizer', Comp: PhotoResizer },
  { key: 'scanner', label: 'Scanner', Comp: DocumentScanner },
  { key: 'vault', label: 'Vault', Comp: DocumentVault }
]

export default function Utilities() {
  const { t } = useLanguage()
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') || 'cv')
  const Active = TABS.find((t) => t.key === tab).Comp

  return (
    <>
      <TopBar title={t('utilities')} />
      <div className="flex gap-2 px-4 pt-3 overflow-x-auto bg-white border-b border-tea-100 sticky top-[56px] z-20">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`text-xs px-3 py-2 rounded-full whitespace-nowrap mb-2 ${tab === key ? 'bg-tea-600 text-white' : 'bg-tea-50 text-tea-700'}`}>
            {label}
          </button>
        ))}
      </div>
      <Active />
    </>
  )
}
