import React, { useState } from 'react'
import { sendEmployerLoginLink } from '../firebase/employerAuth.js'

export default function EmployerLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendEmployerLoginLink(email)
      setSent(true)
    } catch (err) {
      setError('Could not send login link. Please check the email and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="p-6 text-center space-y-3">
        <h2 className="text-xl font-semibold text-tea-800">Check your email</h2>
        <p className="text-tea-900/70 text-sm">
          We've sent a sign-in link to <strong>{email}</strong>. Open it on this device to continue.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-tea-800">Employer Sign In</h2>
      <p className="text-sm text-tea-900/60">
        Enter your email to post job openings. No password needed — we'll send you a secure sign-in link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-tea-100 rounded-xl px-4 py-3 bg-white"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Sending...' : 'Send Sign-In Link'}
        </button>
      </form>
    </div>
  )
}
