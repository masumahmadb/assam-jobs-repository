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
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <button onClick={handleGoogle} className="btn-outline w-full py-3 mt-3">
        Sign in with Google
      </button>

      <p className="text-center text-sm text-tea-900/60 mt-4">
        Don't have an account? <Link to="/signup" className="text-tea-700 font-medium">Sign up</Link>
      </p>

      <div className="border-t border-tea-100 mt-6 pt-6">
        <p className="text-center text-sm text-tea-900/60 mb-3">Are you an employer?</p>
        <Link to="/employer/login" className="btn-outline w-full py-3 text-center">
          Post a Job
        </Link>
      </div>
    </div>
  )
}
