import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiMapPin, FiCalendar, FiSettings, FiLogOut, FiEdit, FiShield, FiBookOpen, FiAward, FiClock, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { logOut } from '../../firebase/auth.js'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge, Avatar, AvatarGroup, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Input, Select } from '../components/ui/21st'
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

function Profile() {
  const { user, profile, updateProfile } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})

  const handleSignOut = async () => {
    await logOut()
    navigate('/login')
  }

  const openEditModal = () => {
    setEditForm({
      name: profile?.name || '',
      education_level: profile?.education_level || '',
      birth_year: profile?.birth_year || '',
      caste_status: profile?.caste_status || '',
      assam_district: profile?.assam_district || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(editForm)
      setShowEditModal(false)
    } catch (err) {
      console.error('Profile update failed:', err)
    }
  }

  const profileCompletion = React.useMemo(() => {
    if (!profile) return 0
    const fields = ['name', 'education_level', 'birth_year', 'caste_status', 'assam_district', 'phone', 'address']
    const filled = fields.filter(f => profile[f]).length
    return Math.round((filled / fields.length) * 100)
  }, [profile])

  const getCompletionColor = (pct) => {
    if (pct >= 80) return 'success'
    if (pct >= 50) return 'warning'
    return 'destructive'
  }

  return (
    <>
      <TopBar title="Profile" />
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Profile Header */}
        <div className="animate-slide-up mb-6">
          <div className="card bg-gradient-to-r from-tea-600 via-tea-700 to-tea-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-muga-500/20 blur-3xl" />
            </div>
            <div className="relative p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <Avatar
                    src={null}
                    alt={profile?.name || user?.displayName || 'User'}
                    fallback={profile?.name?.[0]?.toUpperCase() || user?.displayName?.[0]?.toUpperCase() || 'U'}
                    size="xl"
                  />
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold">
                      {profile?.name || user?.displayName || 'User'}
                    </h1>
                    <p className="text-white/80">{user?.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="success-outline" className="flex items-center gap-1">
                        <FiCheckCircle size={14} />
                        Profile {profileCompletion}% Complete
                      </Badge>
                      <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden ml-3">
                        <div
                          className="h-full bg-white transition-all duration-500"
                          style={{width: `${profileCompletion}%`}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button variant="outline" size="lg" onClick={() => setShowEditModal(true)} className="border-white/30 text-white hover:bg-white/10">
                    <FiEdit size={18} className="mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleSignOut} className="border-white/30 text-white hover:bg-white/10">
                    <FiLogOut size={18} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-slide-up" style={{animationDelay: '100ms'}}>
            <div className="card p-4 text-center">
              <div className="text-2xl font-display font-bold text-tea-600 dark:text-tea-400">50+</div>
              <div className="text-sm text-tea-600 dark:text-tea-400">Applications</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-display font-bold text-tea-600 dark:text-tea-400">12</div>
              <div className="text-sm text-tea-600 dark:text-tea-400">Saved Jobs</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-display font-bold text-tea-600 dark:text-tea-400">8</div>
              <div className="text-sm text-tea-600 dark:text-tea-400">Applications Submitted</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-display font-bold text-tea-600 dark:text-tea-400">95%</div>
              <div className="text-sm text-tea-600 dark:text-tea-400">Profile Strength</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 animate-slide-up" style={{animationDelay: '200ms'}}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'profile', label: 'Profile', icon: FiUser },
              { id: 'applications', label: 'Applications', icon: FiFileText },
              { id: 'saved', label: 'Saved Jobs', icon: FiHeart },
              { id: 'settings', label: 'Settings', icon: FiSettings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                  ${activeTab === tab.id
                    ? 'bg-tea-600 text-white shadow-sm'
                    : 'bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 hover:bg-tea-200 dark:hover:bg-tea-700'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Personal Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiUser size={20} className="text-tea-600 dark:text-tea-400" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Full Name</label>
                      <p className="text-tea-900 dark:text-tea-100">{profile?.name || user?.displayName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="input-label">Email</label>
                      <p className="text-tea-900 dark:text-tea-100">{user?.email}</p>
                    </div>
                    <div>
                      <label className="input-label">Education Level</label>
                      <p className="text-tea-900 dark:text-tea-100">{profile?.education_level || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="input-label">Birth Year</label>
                      <p className="text-tea-900 dark:text-tea-100">{profile?.birth_year || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="input-label">Category</label>
                      <p className="text-tea-900 dark:text-tea-100">
                        <Badge variant="outline">{profile?.caste_status || 'Not set'}</Badge>
                      </p>
                    </div>
                    <div>
                      <label className="input-label">District</label>
                      <p className="text-tea-900 dark:text-tea-100">{profile?.assam_district || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="input-label">Phone</label>
                      <p className="text-tea-900 dark:text-tea-100">{profile?.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="input-label">Address</label>
                      <p className="text-tea-900 dark:text-tea-100">{profile?.address || 'Not set'}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={openEditModal}>
                    <FiEdit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>

              {/* Education & Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBookOpen size={20} className="text-tea-600 dark:text-tea-400" />
                    Education & Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                      <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Education Level</p>
                      <p className="font-medium text-tea-900 dark:text-tea-100">{profile?.education_level || 'Not specified'}</p>
                    </div>
                    <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                      <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Category</p>
                      <p className="font-medium text-tea-900 dark:text-tea-100">
                        <Badge variant="outline">{profile?.caste_status || 'Not specified'}</Badge>
                      </p>
                    </div>
                    <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                      <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">District</p>
                      <p className="font-medium text-tea-900 dark:text-tea-100">{profile?.assam_district || 'Not specified'}</p>
                    </div>
                    <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                      <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Birth Year</p>
                      <p className="font-medium text-tea-900 dark:text-tea-100">{profile?.birth_year || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiMail size={20} className="text-tea-600 dark:text-tea-400" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                      <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Email</p>
                      <p className="font-medium text-tea-900 dark:text-tea-100 break-all">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                      <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Phone</p>
                      <p className="font-medium text-tea-900 dark:text-tea-100">{profile?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  {profile?.address && (
                    <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                      <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Address</p>
                      <p className="font-medium text-tea-900 dark:text-tea-100">{profile.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FiFileText size={20} className="text-tea-600 dark:text-tea-400" />
                      My Applications
                    </span>
                    <Badge variant="outline">12 Total</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: '1', title: 'Medical Officer', org: 'NHM Assam', status: 'submitted', date: '2026-08-15', deadline: '2026-09-15' },
                      { id: '2', title: 'Assistant Professor', org: 'Assam Medical College', status: 'under_review', date: '2026-08-10', deadline: '2026-09-20' },
                      { id: '3', title: 'Junior Engineer', org: 'PWD Assam', status: 'pending', date: '2026-08-05', deadline: '2026-09-10' },
                    ].map((app) => (
                      <div key={app.id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-tea-900 dark:text-tea-100">{app.title}</h4>
                          <p className="text-sm text-tea-600 dark:text-tea-400">{app.org}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant={
                            app.status === 'submitted' ? 'success' :
                            app.status === 'under_review' ? 'warning' :
                            'ghost'
                          }>
                            {app.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-tea-600 dark:text-tea-400">Applied: {app.date}</span>
                          <Badge variant="outline" className={new Date(app.deadline) < new Date() ? 'destructive' : 'outline'}>
                            Deadline: {app.deadline}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FiHeart size={20} className="text-muga-500" />
                      Saved Jobs
                    </span>
                    <Badge variant="outline">8 Saved</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: '1', title: 'Medical Officer', org: 'NHM Assam', deadline: '2026-09-15', type: 'government' },
                      { id: '2', title: 'Software Developer', org: 'AMTRON', deadline: '2026-09-25', type: 'psu' },
                      { id: '3', title: 'Sales Executive', org: 'HDFC Bank', deadline: '2026-09-30', type: 'private' },
                    ].map((job) => (
                      <div key={job.id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-semibold text-tea-900 dark:text-tea-100 truncate">{job.title}</h4>
                            <Badge variant="outline" className={`bg-${job.type === 'government' ? 'blue' : job.type === 'psu' ? 'amber' : 'purple'}-100 text-${job.type === 'government' ? 'blue' : job.type === 'psu' ? 'amber' : 'purple'}-700`}>
                              {job.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-tea-600 dark:text-tea-400">{job.org}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant={new Date(job.deadline) < new Date() ? 'destructive' : 'outline'}>
                            <FiClock size={12} className="mr-1" />
                            {job.deadline}
                          </Badge>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Notifications Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBell size={20} className="text-tea-600 dark:text-tea-400" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-tea-900 dark:text-tea-100">Job Alerts</p>
                      <p className="text-sm text-tea-600 dark:text-tea-400">Get notified about new matching jobs</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-tea-300 text-tea-600 focus:ring-tea-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-tea-900 dark:text-tea-100">Application Deadlines</p>
                      <p className="text-sm text-tea-600 dark:text-tea-400">Reminders before deadlines</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-tea-300 text-tea-600 focus:ring-tea-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-tea-900 dark:text-tea-100">Weekly Digest</p>
                      <p className="text-sm text-tea-600 dark:text-tea-400">Weekly summary of new jobs</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-tea-300 text-tea-600 focus:ring-tea-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Language & Region */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiSettings size={20} className="text-tea-600 dark:text-tea-400" />
                    Language & Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Preferred Language</label>
                      <Select
                        value="en"
                        options={[
                          { value: 'en', label: 'English' },
                          { value: 'as', label: 'অসমীয়া (Assamese)' },
                          { value: 'hi', label: 'हिंदी (Hindi)' },
                          { value: 'bn', label: 'বাংলা (Bengali)' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="input-label">Home District</label>
                      <Select
                        value=""
                        options={districts}
                        placeholder="Select your district"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="border-muga-200 dark:border-muga-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muga-600 dark:text-muga-400">
                    <FiShield size={20} />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FiShield size={18} className="mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FiUser size={18} className="mr-2" />
                    Manage Sessions
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut}>
                    <FiLogOut size={18} className="mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
</div>
    </div>
  </>
)
}

export default Profile