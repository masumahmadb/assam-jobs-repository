import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmail, signInWithGoogle } from '../../firebase/auth.js'
import { useLanguage } from '../../contexts/LanguageContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmail({ email, password })
      navigate('/')
    } catch (err) {
      setError('Could not sign in. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-sand-50">
      <h1 className="text-3xl font-display font-semibold text-tea-700 mb-1">Assam Jobs Repository</h1>
      <p className="text-sm text-tea-900/60 mb-6">Sarkari & Private Jobs for Assam Youth</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" className="w-full border border-tea-100 rounded-xl2 px-4 py-3"
        />
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" className="w-full border border-tea-100 rounded-xl2 px-4 py-3"
        />
        {error && <p className="text-gamosa-500 text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? '...' : t('signIn')}</button>
      </form>

      <button onClick={handleGoogle} className="btn-outline w-full mt-3">Continue with Google</button>

      <p className="text-sm text-center mt-6 text-tea-900/70">
        New here? <Link to="/signup" className="text-tea-600 font-medium">Create an account</Link>
      </p>
    </div>
  )
}
