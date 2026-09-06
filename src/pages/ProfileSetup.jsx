import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { FiArrowRight, FiArrowLeft, FiUser, FiGraduationCap, FiCalendar, FiMapPin, FiShield, FiCheckCircle, FiArrowRight, FiUser, FiGraduationCap, FiCalendar, FiMapPin, FiShield, FiCheckCircle } from 'react-icons/fi'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Select, Progress } from '../components/ui/21st'
import TopBar from '../components/common/TopBar.jsx'

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

const birthYears = Array.from({ length: 60 }, (_, i) => 2006 - i).map(y => ({ value: String(y), label: String(y) }))

const STEPS = [
  { id: 1, title: 'Education', icon: FiGraduationCap, desc: 'Your academic background' },
  { id: 2, title: 'Personal', icon: FiCalendar, desc: 'Birth year & category' },
  { id: 3, title: 'Location', icon: FiMapPin, desc: 'Your home district' },
  { id: 4, title: 'Complete', icon: FiShield, desc: 'All done!' },
]

export default function ProfileSetup() {
  const { profile, updateProfile } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    education_level: profile?.education_level || '',
    birth_year: profile?.birth_year || '',
    caste_status: profile?.caste_status || '',
    assam_district: profile?.assam_district || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validateStep = (stepNum) => {
    const newErrors = {}
    if (stepNum === 1) {
      if (!formData.education_level) newErrors.education_level = 'Education level is required'
    }
    if (stepNum === 2) {
      if (!formData.birth_year) newErrors.birth_year = 'Birth year is required'
      if (!formData.caste_status) newErrors.caste_status = 'Category is required'
    }
    if (stepNum === 3) {
      if (!formData.assam_district) newErrors.assam_district = 'District is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return
    setSaving(true)
    try {
      await updateProfile(formData)
      navigate('/')
    } catch (err) {
      console.error('Profile setup failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const progress = (step / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-sand-50 to-white dark:from-tea-900 dark:via-tea-950 dark:to-tea-900">
      <TopBar title="Complete Your Profile" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">Complete Your Profile</h1>
              <p className="text-tea-600 dark:text-tea-400 mt-1">
                Help us find the best jobs for you
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-tea-600 dark:text-tea-400">
              <span>Step {step} of 4</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative mb-8">
            <div className="absolute top-5 left-0 right-0 h-1 bg-tea-100 dark:bg-tea-800 -z-10">
              <div className="h-full bg-tea-600 rounded-full transition-all duration-500" style={{width: `${progress}%`}} />
            </div>
            <div className="flex items-center justify-between">
              {STEPS.map((stepInfo, i) => (
                <div key={stepInfo.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                    ${step > stepInfo.id ? 'bg-tea-600 text-white' : step === stepInfo.id ? 'bg-tea-600 text-white ring-4 ring-tea-200 dark:ring-tea-800' : 'bg-tea-100 dark:bg-tea-800 text-tea-600 dark:text-tea-400'}`}
                  >
                    {step > stepInfo.id ? <FiCheckCircle size={20} /> : <stepInfo.icon size={20} />}
                  </div>
                  <span className="text-xs text-tea-600 dark:text-tea-400 mt-1 font-medium text-center w-24">{stepInfo.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2 mb-8" />
        </div>

        {/* Form Card */}
        <Card className="animate-scale-in">
          <CardHeader className="border-b border-tea-100 dark:border-tea-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center text-tea-600 dark:text-tea-400">
                <STEPS[step - 1].icon size={22} />
              </div>
              <div>
                <CardTitle>{STEPS[step - 1].title}</CardTitle>
                <CardDescription>{STEPS[step - 1].desc}</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              {/* Step 1: Education */}
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); if (validateStep(1)) setStep(2) }} className="space-y-4">
                  <div>
                    <label className="input-label">Education Level <span className="text-muga-500">*</span></label>
                    <Select
                      value={formData.education_level}
                      onValueChange={(v) => handleChange('education_level', v)}
                      options={educationLevels}
                      placeholder="Select your highest education"
                    />
                    {errors.education_level && <p className="input-error-msg">{errors.education_level}</p>}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-tea-100 dark:border-tea-700">
                    <Button variant="outline" onClick={() => setStep(1)} disabled={step === 1} className="flex-1">Back</Button>
                    <Button type="submit" className="flex-1" size="lg">
                      Continue
                      <FiArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 2: Personal */}
              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); if (validateStep(2)) setStep(3) }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Birth Year <span className="text-muga-500">*</span></label>
                      <Select
                        value={formData.birth_year}
                        onValueChange={(v) => handleChange('birth_year', v)}
                        options={Array.from({ length: 60 }, (_, i) => 2006 - i).map(y => ({ value: String(y), label: String(y) })).concat({ value: '', label: 'Select Year' }).reverse()}
                        placeholder="Select Year"
                      />
                      {errors.birth_year && <p className="input-error-msg">{errors.birth_year}</p>}
                    </div>
                    <div>
                      <label className="input-label">Category <span className="text-muga-500">*</span></label>
                      <Select
                        value={formData.caste_status}
                        onValueChange={(v) => handleChange('caste_status', v)}
                        options={categories}
                        placeholder="Select Category"
                      />
                      {errors.caste_status && <p className="input-error-msg">{errors.caste_status}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-tea-100 dark:border-tea-700">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button type="submit" className="flex-1" size="lg">
                      Continue
                      <FiArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <form onSubmit={(e) => { e.preventDefault(); if (validateStep(3)) setStep(4) }} className="space-y-4">
                  <div>
                    <label className="input-label">Home District <span className="text-muga-500">*</span></label>
                    <Select
                      value={formData.assam_district}
                      onValueChange={(v) => handleChange('assam_district', v)}
                      options={districts}
                      placeholder="Select your home district"
                    />
                    {errors.assam_district && <p className="input-error-msg">{errors.assam_district}</p>}
                  </div>

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

                  <div className="flex items-center justify-between pt-4 border-t border-tea-100 dark:border-tea-700">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button type="submit" className="flex-1" size="lg">
                      Complete Setup
                      <FiCheckCircle className="ml-2" size={18} />
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 4: Complete */}
              {step === 4 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-tea-100 dark:bg-tea-800 flex items-center justify-center mx-auto mb-6 text-tea-600 dark:text-tea-400">
                    <FiCheckCircle size={40} className="text-tea-600 dark:text-tea-400" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100 mb-2">Profile Complete!</h2>
                  <p className="text-tea-600 dark:text-tea-400 mb-6 max-w-md mx-auto">
                    Your profile is now complete. We'll show you personalized job recommendations based on your profile.
                  </p>
                  <div className="card bg-tea-50 dark:bg-tea-800/50 p-4 mb-6">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-tea-800 rounded-xl">
                        <span className="text-tea-600 dark:text-tea-400">Education</span>
                        <span className="font-medium text-tea-900 dark:text-tea-100">{formData.education_level}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-tea-800 rounded-xl">
                        <span className="text-tea-600 dark:text-tea-400">District</span>
                        <span className="font-medium text-tea-900 dark:text-tea-100">{formData.assam_district}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-tea-800 rounded-xl">
                        <span className="text-tea-600 dark:text-tea-400">Category</span>
                        <Badge variant="outline">{formData.caste_status}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-tea-800 rounded-xl">
                        <span className="text-tea-600 dark:text-tea-400">Birth Year</span>
                        <span className="font-medium text-tea-900 dark:text-tea-100">{formData.birth_year}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} loading={saving} className="w-full" size="xl">
                    {saving ? 'Saving...' : 'Start Exploring Jobs'}
                    <FiArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              )}

              {/* Error Messages */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-muga-50 dark:bg-muga-900/30 border border-muga-200 dark:border-muga-800 rounded-xl">
                  <div className="flex items-center gap-2 text-muga-700 dark:text-muga-300 mb-2">
                    <FiAlertCircle size={18} />
                    <span className="font-medium">Please fix the following:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muga-700 dark:text-muga-300">
                    {Object.values(errors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-tea-100 dark:border-tea-700">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <FiArrowLeft className="mr-2" size={18} />
                    Back
                  </Button>
                )}
                {step < 4 && (
                  <Button type="submit" className="flex-1" size="lg">
                    Continue
                    <FiArrowRight className="ml-2" size={18} />
                  </Button>
                )}
                {step === 4 && (
                  <Button onClick={handleSubmit} loading={saving} className="flex-1" size="xl">
                    {saving ? 'Saving...' : 'Start Exploring Jobs'}
                    <FiArrowRight className="ml-2" size={18} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup