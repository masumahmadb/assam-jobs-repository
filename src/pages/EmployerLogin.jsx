import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { FiMail, FiLock, FiEye, FiEyeOff, FiBuilding2, FiUsers, FiBriefcase, FiShield, FiZap, FiHeart, FiStar } from 'react-icons/fi'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/21st'

export default function EmployerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: Implement employer sign in
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/employer/dashboard')
    } catch (err) {
      setError('Could not sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-tea-50 via-sand-50 to-white dark:from-tea-900 dark:via-tea-950 dark:to-tea-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-tea-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-muga-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl text-tea-600 dark:text-tea-400 mb-6">
            <span className="w-10 h-10 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-tea-600 dark:text-tea-400">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span className="font-display font-bold text-xl text-tea-900 dark:text-tea-100">Assam Jobs</span>
          </Link>
          <p className="text-tea-600 dark:text-tea-400 mt-2">Employer Portal</p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6 animate-slide-up">
          <span className="px-3 py-1 bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 text-xs font-medium rounded-full flex items-center gap-1">
            <FiBuilding2 size={12} /> Employer Portal
          </span>
          <span className="px-3 py-1 bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 text-xs font-medium rounded-full flex items-center gap-1">
            <FiShield size={12} /> Verified Employers
          </span>
        </div>

        {/* Login Card */}
        <Card className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center mx-auto mb-4 text-tea-600 dark:text-tea-400">
              <FiBuilding2 size={24} />
            </div>
            <CardTitle className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">Employer Sign In</CardTitle>
            <p className="text-tea-600 dark:text-tea-400 mt-1">Access your employer dashboard</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-muga-50 dark:bg-muga-900/30 border border-muga-200 dark:border-muga-800 rounded-xl text-sm text-muga-700 dark:text-muga-300 animate-slide-down">
                <FiAlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="input-label">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employer@company.com"
                  leftIcon={<FiMail size={18} />}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="input-label">Password</label>
                  <Link to="/employer/forgot-password" className="text-sm text-tea-600 dark:text-tea-400 hover:text-tea-700 dark:hover:text-tea-300">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  leftIcon={<FiLock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-tea-400 hover:text-tea-600 dark:hover:text-tea-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-tea-300 text-tea-600 focus:ring-tea-500" />
                  <span className="text-sm text-tea-600 dark:text-tea-400">Remember me</span>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-4">
            <p className="text-center text-sm text-tea-600 dark:text-tea-400">
              Don't have an employer account?{' '}
              <Link to="/employer/signup" className="text-tea-600 dark:text-tea-400 font-medium hover:text-tea-700 dark:hover:text-tea-300 underline underline-offset-2">
                Register as Employer
              </Link>
            </p>
            <p className="text-center text-sm text-tea-500 dark:text-tea-500 mt-3">
              <Link to="/login" className="text-tea-600 dark:text-tea-400 hover:underline">
                ← Back to Job Seeker Login
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up">
          {[
            { icon: FiUsers, title: 'Verified Candidates', desc: 'Access verified profiles' },
            { icon: FiBriefcase, title: 'Post Jobs Free', desc: 'Unlimited job postings' },
            { icon: FiZap, title: 'Instant Reach', desc: 'Reach 50,000+ candidates' },
          ].map((feature, i) => {
            return (
              <div key={feature.title} className="card p-4 text-center group">
                <div className="w-10 h-10 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-tea-600 dark:text-tea-400">
                  <feature.icon size={20} />
                </div>
                <h4 className="font-semibold text-tea-900 dark:text-tea-100">{feature.title}</h4>
                <p className="text-sm text-tea-600 dark:text-tea-400 mt-1">{feature.desc}</p>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-tea-500 dark:text-tea-500 mt-8">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-tea-600 dark:text-tea-400 hover:underline">Terms of Service</Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-tea-600 dark:text-tea-400 hover:underline">Privacy Policy</Link>
</p>
      </div>
    </div>
  )
}

export default EmployerLogin