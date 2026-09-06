import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUpWithEmail, signInWithGoogle } from '../../firebase/auth.js'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { FiMail, FiLock, FiEye, FiEyeOff, FiGoogle, FiUser, FiArrowRight, FiShield, FiZap, FiHeart, FiStar, FiUserPlus, FiCheckCircle, FiPhone, FiMapPin } from 'react-icons/fi'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, Select } from '../../components/ui/21st'

const educationLevels = [
  { value: '', label: 'Select Education Level' },
  { value: '10th', label: '10th Pass' },
  { value: '12th', label: '12th Pass' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'postgraduate', label: 'Post Graduate' },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'iti', label: 'ITI / Vocational' },
  { value: 'other', label: 'Other' },
]

const categories = [
  { value: '', label: 'Select Category' },
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
  { value: 'ph', label: 'PH (Physically Handicapped)' },
  { value: 'ex_serviceman', label: 'Ex-Serviceman' },
]

const birthYearOptions = Array.from({ length: 60 }, (_, i) => 2006 - i).map(y => ({ value: String(y), label: String(y) })).concat({ value: '', label: 'Select Year' }).reverse()

const districts = [
  { value: '', label: 'Select District' },
  { value: 'guwahati', label: 'Guwahati (Kamrup Metro)' },
  { value: 'kamrup', label: 'Kamrup (Rural)' },
  { value: 'dibrugarh', label: 'Dibrugarh' },
  { value: 'jorhat', label: 'Jorhat' },
  { value: 'silchar', label: 'Silchar (Cachar)' },
  { value: 'nagaon', label: 'Nagaon' },
  { value: 'tinsukia', label: 'Tinsukia' },
  { value: 'tepur', label: 'Tezpur (Sonitpur)' },
  { value: 'bongaigaon', label: 'Bongaigaon' },
  { value: 'dhubri', label: 'Dhubri' },
  { value: 'goalpara', label: 'Goalpara' },
  { value: 'barpeta', label: 'Barpeta' },
  { value: 'kokrajhar', label: 'Kokrajhar' },
  { value: 'baksa', label: 'Baksa' },
  { value: 'chirang', label: 'Chirang' },
  { value: 'udalguri', label: 'Udalguri' },
  { value: 'karbi_anglong', label: 'Karbi Anglong' },
  { value: 'diima_hasao', label: 'Dima Hasao' },
  { value: 'hajong', label: 'Hojai' },
  { value: 'south_salmara', label: 'South Salmara' },
  { value: 'west_karbi_anglong', label: 'West Karbi Anglong' },
  { value: 'biswanath', label: 'Biswanath' },
  { value: 'charaideo', label: 'Charaideo' },
  { value: 'majuli', label: 'Majuli' },
  { value: 'other', label: 'Other' },
]

function Signup() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    education_level: '',
    birth_year: '',
    caste_status: '',
    assam_district: '',
    phone: '',
    address: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const validateStep = (stepNum) => {
    const newErrors = {}
    
    if (stepNum === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (stepNum === 2) {
      if (!formData.education_level) newErrors.education_level = 'Education level is required'
      if (!formData.birth_year) newErrors.birth_year = 'Birth year is required'
      if (!formData.caste_status) newErrors.caste_status = 'Category is required'
      if (!formData.assam_district) newErrors.assam_district = 'District is required'
    }
    
    if (stepNum === 3 && !formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(step)) return

    if (step < 3) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    try {
      await signUpWithEmail({ email: formData.email, password: formData.password })
      
      const { updateProfile } = await import('../../firebase/auth.js')
      await updateProfile({
        name: formData.name,
        education_level: formData.education_level,
        birth_year: formData.birth_year,
        caste_status: formData.caste_status,
        assam_district: formData.assam_district,
        phone: formData.phone,
        address: formData.address,
      })
      
      navigate('/profile-setup')
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err) {
      alert('Google sign-up failed. Please try again.')
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-tea-50 via-sand-50 to-white dark:from-tea-900 dark:via-tea-950 dark:to-tea-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-tea-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-muga-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            {[
              { step: 1, label: 'Account' },
              { step: 2, label: 'Profile' },
              { step: 3, label: 'Finish' },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                  ${step > item.step ? 'bg-tea-600 text-white' : step === item.step ? 'bg-tea-600 text-white ring-4 ring-tea-200 dark:ring-tea-800' : 'bg-tea-100 dark:bg-tea-800 text-tea-600 dark:text-tea-400'}`}
                >
                  {step > item.step ? <FiCheckCircle size={20} /> : item.step}
                </div>
                <span className="text-xs text-tea-600 dark:text-tea-400 mt-1 font-medium">{item.label}</span>
              </div>
            ))}
            <div className="absolute top-5 left-0 right-0 h-1 bg-tea-100 dark:bg-tea-800 -z-10">
              <div className="h-full bg-tea-600 rounded-full transition-all duration-500" style={{width: `${progress}%`}} />
            </div>
          </div>

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
            <p className="text-tea-600 dark:text-tea-400 mt-2">Create your free account</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8 mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
            {[
              { step: 1, label: 'Account' },
              { step: 2, label: 'Profile' },
              { step: 3, label: 'Finish' },
            ].map((item, i) => (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                    ${step > item.step ? 'bg-tea-600 text-white' : step === item.step ? 'bg-tea-600 text-white ring-4 ring-tea-200 dark:ring-tea-800' : 'bg-tea-100 dark:bg-tea-800 text-tea-600 dark:text-tea-400'}`}
                  >
                    {step > item.step ? <FiCheckCircle size={20} /> : item.step}
                  </div>
                  <span className="text-xs text-tea-600 dark:text-tea-400 mt-1 font-medium">{item.label}</span>
                </div>
                {i < 2 && (
                  <div className="flex-1 h-1 bg-tea-100 dark:bg-tea-800 relative">
                    <div className="absolute top-0 left-0 h-full bg-tea-600 rounded-full transition-all duration-500" style={{width: `${(step - 1) * 50}%`}} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form */}
          <Card className="animate-scale-in">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center mx-auto mb-4 text-tea-600 dark:text-tea-400">
                <FiUserPlus size={24} />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">Create Your Account</CardTitle>
              <p className="text-tea-600 dark:text-tea-400 mt-1">Join 50,000+ students finding their dream jobs</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Step 1: Account Details */}
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); if (validateStep(1)) setStep(2) }} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="input-label">Full Name</label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      leftIcon={<FiUser size={18} />}
                      error={errors.name}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="input-label">Email Address</label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      leftIcon={<FiMail size={18} />}
                      error={errors.email}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="input-label">Password</label>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Create a strong password"
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
                      error={errors.password}
                    />
                    {formData.password && (
                      <div className="mt-1">
                        <div className="h-1 bg-tea-100 dark:bg-tea-800 rounded-full overflow-hidden">
                          <div className="h-full bg-tea-600 transition-all duration-300" style={{width: `${Math.min(formData.password.length * 15, 100)}%`}} />
                        </div>
                        <p className="text-xs text-tea-500 dark:text-tea-500 mt-1">
                          {formData.password.length < 6 ? 'Weak' : formData.password.length < 10 ? 'Medium' : 'Strong'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
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
                      error={errors.confirmPassword}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={formData.terms}
                      onChange={(e) => handleChange('terms', e.target.checked)}
                      className="w-4 h-4 rounded border-tea-300 text-tea-600 focus:ring-tea-500"
                    />
                    <label htmlFor="terms" className="text-sm text-tea-600 dark:text-tea-400">
                      I agree to the{' '}
                      <Link to="/terms" className="text-tea-600 dark:text-tea-400 hover:underline">Terms of Service</Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-tea-600 dark:text-tea-400 hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  <Button type="button" onClick={() => validateStep(1) && setStep(2)} className="w-full" size="lg">
                    Continue
                    <FiArrowRight className="ml-2" size={18} />
                  </Button>
                </form>
              )}

              {/* Step 2: Profile Info */}
              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); if (validateStep(2)) setStep(3) }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Full Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled
                        className="bg-tea-50 dark:bg-tea-800"
                      />
                    </div>
                    <div>
                      <label className="input-label">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled
                        className="bg-tea-50 dark:bg-tea-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Education Level</label>
                      <Select
                        value={formData.education_level}
                        onValueChange={(v) => handleChange('education_level', v)}
                        options={educationLevels}
                        placeholder="Select Education Level"
                      />
                    </div>
                    <div>
                      <label className="input-label">Birth Year</label>
                      <Select
                        value={formData.birth_year}
                        onValueChange={(v) => handleChange('birth_year', v)}
                        options={birthYearOptions}
                        placeholder="Select Year"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Category</label>
                      <Select
                        value={formData.caste_status}
                        onValueChange={(v) => handleChange('caste_status', v)}
                        options={categories}
                        placeholder="Select Category"
                      />
                    </div>
                    <div>
                      <label className="input-label">Home District</label>
                      <Select
                        value={formData.assam_district}
                        onValueChange={(v) => handleChange('assam_district', v)}
                        options={districts}
                        placeholder="Select District"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Phone Number</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        leftIcon={<FiPhone size={18} />}
                      />
                    </div>
                    <div>
                      <label className="input-label">Address (Optional)</label>
                      <Input
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Your address"
                        leftIcon={<FiMapPin size={18} />}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms2"
                      required
                      checked={formData.terms}
                      onChange={(e) => handleChange('terms', e.target.checked)}
                      className="w-4 h-4 rounded border-tea-300 text-tea-600 focus:ring-tea-500"
                    />
                    <label htmlFor="terms2" className="text-sm text-tea-600 dark:text-tea-400">
                      I agree to the{' '}
                      <Link to="/terms" className="text-tea-600 dark:text-tea-400 hover:underline">Terms of Service</Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-tea-600 dark:text-tea-400 hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button type="button" onClick={() => validateStep(2) && setStep(3)} className="flex-1" size="lg">
                      Continue
                      <FiArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 3: Terms & Create Account */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-tea-100 dark:bg-tea-800 flex items-center justify-center mx-auto mb-4 text-tea-600 dark:text-tea-400">
                      <FiUserPlus size={32} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-tea-900 dark:text-tea-100">Almost there!</h3>
                    <p className="text-tea-600 dark:text-tea-400 mt-2">Review your details and create your account</p>
                  </div>

                  <div className="card bg-tea-50 dark:bg-tea-800/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tea-600 dark:text-tea-400">Name</span>
                      <span className="font-medium text-tea-900 dark:text-tea-100">{formData.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tea-600 dark:text-tea-400">Email</span>
                      <span className="font-medium text-tea-900 dark:text-tea-100">{formData.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tea-600 dark:text-tea-400">Education</span>
                      <span className="font-medium text-tea-900 dark:text-tea-100">{formData.education_level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tea-600 dark:text-tea-400">District</span>
                      <span className="font-medium text-tea-900 dark:text-tea-100">{formData.assam_district}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tea-600 dark:text-tea-400">Category</span>
                      <Badge variant="outline">{formData.caste_status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={formData.terms}
                      onChange={(e) => handleChange('terms', e.target.checked)}
                      className="w-4 h-4 rounded border-tea-300 text-tea-600 focus:ring-tea-500"
                    />
                    <label htmlFor="terms" className="text-sm text-tea-600 dark:text-tea-400">
                      I agree to the{' '}
                      <Link to="/terms" className="text-tea-600 dark:text-tea-400 hover:underline">Terms of Service</Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-tea-600 dark:text-tea-400 hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button type="button" onClick={handleSubmit} loading={loading} className="flex-1" size="lg">
                      {loading ? 'Creating Account...' : 'Create My Account'}
                      <FiArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Google Sign Up */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-tea-200 dark:border-tea-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-tea-900 px-4 text-tea-500 dark:text-tea-400">Or sign up with</span>
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
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.74c-.98.66-2.09 1.06-3.42 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.72l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </CardContent>

            <CardFooter className="pt-4">
              <p className="text-center text-sm text-tea-600 dark:text-tea-400">
                Already have an account?{' '}
                <Link to="/login" className="text-tea-600 dark:text-tea-400 font-medium hover:text-tea-700 dark:hover:text-tea-300 underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up">
            {[
              { icon: FiShield, title: '100% Free', desc: 'No hidden charges ever' },
              { icon: FiZap, title: 'Instant Alerts', desc: 'Real-time job notifications' },
              { icon: FiShield, title: 'Verified Jobs', desc: 'From official sources only' },
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
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-tea-600 dark:text-tea-400 hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-tea-600 dark:text-tea-400 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup