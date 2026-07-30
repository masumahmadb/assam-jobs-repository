import React, { useEffect, useState } from 'react'
import { getVaultDocuments, deleteVaultDocument } from '../../firebase/firestore.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { ListSkeleton } from '../common/SkeletonLoader.jsx'
import { FiTrash2, FiDownload } from 'react-icons/fi'

export default function DocumentVault() {
  const { user } = useAuth()
  const [docs, setDocs] = useState(null)

  async function load() {
    if (!user) return
    setDocs(await getVaultDocuments(user.uid))
  }

  useEffect(() => { load() }, [user])

  async function handleDelete(id) {
    await deleteVaultDocument(id)
    load()
  }

  return (
    <div className="p-4 pb-24 space-y-3">
      <h2 className="text-lg font-semibold text-tea-800">My Vault</h2>
      {docs === null ? <ListSkeleton count={3} /> : docs.length === 0 ? (
        <p className="text-tea-900/50 text-center py-10">No documents saved yet.</p>
      ) : (
        docs.map((d) => (
          <div key={d.id} className="card flex items-center gap-3">
            <img src={d.url} alt={d.name} className="w-14 h-14 object-cover rounded-lg border" />
            <div className="flex-1">
              <p className="font-medium text-sm">{d.name}</p>
              <p className="text-xs text-tea-900/50">{d.sizeKB} KB</p>
            </div>
            <a href={d.url} download target="_blank" rel="noreferrer" className="p-2"><FiDownload /></a>
            <button onClick={() => handleDelete(d.id)} className="p-2 text-gamosa-500"><FiTrash2 /></button>
          </div>
        ))
      )}
    </div>
  )
}
