import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeEmployerLoginIfLink } from '../firebase/employerAuth.js'

export default function EmployerVerify() {
  const [status, setStatus] = useState('verifying')
  const navigate = useNavigate()

  useEffect(() => {
    completeEmployerLoginIfLink()
      .then((user) => {
        if (user) navigate('/employer/dashboard')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'error') {
    return (
      <div className="p-6 text-center space-y-2">
        <p className="text-red-600">This link is invalid or has expired.</p>
        <button onClick={() => navigate('/employer/login')} className="btn-primary py-2 px-4 mt-2">
          Try Again
        </button>
      </div>
    )
  }

  return <div className="p-6 text-center text-tea-900/60">Signing you in...</div>
}
