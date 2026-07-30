import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUpWithEmail } from '../../firebase/auth.js'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUpWithEmail({ name, email, password })
      navigate('/profile')
    } catch (err) {
      setError('Could not create account. The email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-sand-50">
      <h1 className="text-2xl font-display font-semibold text-tea-700 mb-6">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border border-tea-100 rounded-xl2 px-4 py-3" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-tea-100 rounded-xl2 px-4 py-3" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" className="w-full border border-tea-100 rounded-xl2 px-4 py-3" />
        {error && <p className="text-gamosa-500 text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? '...' : 'Sign Up'}</button>
      </form>
      <p className="text-sm text-center mt-6 text-tea-900/70">
        Already have an account? <Link to="/login" className="text-tea-600 font-medium">Sign in</Link>
      </p>
    </div>
  )
}
