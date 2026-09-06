import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmail, signInWithGoogle } from '../../firebase/auth.js'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { FiMail, FiLock, FiEye, FiEyeOff, FiGoogle, FiUser, FiArrowRight, FiShield, FiZap, FiHeart, FiStar, FiBuilding2, FiUsers, FiBriefcase } from 'react-icons/fi'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/21st'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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
      setError('Could not sign in. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-tea-50 via-sand-50 to-white dark:from-tea-900 dark:via-tea-950 dark:to-tea-900">
      {/* Background decorations */}
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
          <p className="text-tea-600 dark:text-tea-400 mt-2">Sign in to your account</p>
        </div>

        {/* Features badges */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-slide-up">
          <span className="px-3 py-1 bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 text-xs font-medium rounded-full flex items-center gap-1">
            <FiShield size={12} />
            100% Free
          </span>
          <span className="px-3 py-1 bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 text-xs font-medium rounded-full flex items-center gap-1">
            <FiZap size={12} />
            Offline Ready
          </span>
          <span className="px-3 py-1 bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 text-xs font-medium rounded-full flex items-center gap-1">
            <FiHeart size={12} />
            No Ads
          </span>
        </div>

        {/* Login Card */}
        <Card className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">Welcome Back</CardTitle>
            <p className="text-tea-600 dark:text-tea-400 mt-1">Sign in to access your personalized job feed</p>
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
                  placeholder="your@email.com"
                  leftIcon={<FiMail size={18} />}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="input-label">Password</label>
                  <Link to="/forgot-password" className="text-sm text-tea-600 dark:text-tea-400 hover:text-tea-700 dark:hover:text-tea-300">
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
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-tea-400 hover:text-tea-600 dark:hover:text-tea-300 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </span>
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-tea-300 text-tea-600 focus:ring-tea-500"
                  />
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-tea-200 dark:border-tea-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-tea-900 px-4 text-tea-500 dark:text-tea-400">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              loading={googleLoading}
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.74c-.98.66-2.09 1.06-3.42 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.74c-.98.66-2.09 1.06-3.42 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.72l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          <CardFooter className="pt-4">
            <p className="text-center text-sm text-tea-600 dark:text-tea-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-tea-600 dark:text-tea-400 font-medium hover:text-tea-700 dark:hover:text-tea-300 underline underline-offset-2">
                Sign up
              </Link>
            </p>
            <p className="text-center text-sm text-tea-500 dark:text-tea-500 mt-3">
              Are you an employer?{' '}
              <Link to="/employer/login" className="text-tea-600 dark:text-tea-400 font-medium hover:underline">
                Post a Job
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>

      {/* Features highlight */}
      <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up">
        {[
          { icon: FiShield, title: '100% Free', desc: 'No hidden charges' },
          { icon: FiZap, title: 'Instant Alerts', desc: 'Real-time job alerts' },
          { icon: FiShield, title: 'Verified Jobs', desc: 'From official sources' },
        ].map((feature, i) => (
          <div key={feature.title} className="card p-4 text-center group">
            <div className="w-10 h-10 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-tea-600 dark:text-tea-400">
              <feature.icon size={20} />
            </div>
            <h4 className="font-semibold text-tea-900 dark:text-tea-100">{feature.title}</h4>
            <p className="text-sm text-tea-600 dark:text-tea-400 mt-1">{feature.desc}</p>
          </div>
        ))}
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

export default Login