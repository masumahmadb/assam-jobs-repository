import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Select, Tabs, TabsList, TabsTrigger, TabsContent, Avatar, AvatarGroup, Pagination, Modal, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '../components/ui/21st'
import { FiUsers, FiBriefcase, FiFileText, FiSettings, FiShield, FiActivity, FiTrendingUp, FiDatabase, FiBell, FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, FiEye, FiDownload, FiMoreHorizontal, FiUserPlus, FiCheckCircle, FiXCircle, FiClock, FiBuilding2 } from 'react-icons/fi'

const mockUsers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@email.com', role: 'user', status: 'active', joined: '2026-01-15', applications: 12 },
  { id: '2', name: 'Rahul Kumar', email: 'rahul@email.com', role: 'user', status: 'active', joined: '2026-02-20', applications: 8 },
  { id: '3', name: 'Anita Das', email: 'anita@email.com', role: 'user', status: 'suspended', joined: '2026-03-10', applications: 5 },
  { id: '4', name: 'Rajesh Singh', email: 'rajesh@email.com', role: 'employer', status: 'active', joined: '2026-01-10', company: 'Health Dept' },
  { id: '5', name: 'Sneha Patel', email: 'sneha@email.com', role: 'user', status: 'active', joined: '2026-02-28', applications: 3 },
  { id: '6', name: 'AMTRON HR', email: 'hr@amtron.in', role: 'employer', status: 'active', joined: '2025-11-15', company: 'AMTRON' },
]

const mockJobs = [
  { id: '1', title: 'Medical Officer', org: 'NHM Assam', type: 'government', status: 'active', applications: 245, posted: '2026-08-01' },
  { id: '2', title: 'Software Developer', org: 'AMTRON', type: 'psu', status: 'active', applications: 180, posted: '2026-08-05' },
  { id: '3', title: 'Junior Engineer', org: 'PWD', type: 'government', status: 'active', applications: 1200, posted: '2026-07-28' },
  { id: '4', title: 'Assistant Professor', org: 'Assam Medical College', type: 'government', status: 'draft', applications: 0, posted: '2026-08-10' },
  { id: '5', title: 'Sales Executive', org: 'HDFC Bank', type: 'private', status: 'expired', applications: 320, posted: '2026-07-15' },
]

const stats = [
  { label: 'Total Users', value: '52,341', change: '+12%', trend: 'up', icon: FiUsers, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Active Jobs', value: '1,247', change: '+8%', trend: 'up', icon: FiBriefcase, color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Total Applications', value: '1,42,356', change: '+15%', trend: 'up', icon: FiFileText, color: 'text-purple-600 dark:text-purple-400' },
  { label: 'Employers', value: '234', change: '+5%', trend: 'up', icon: FiBuilding2, color: 'text-amber-600 dark:text-amber-400' },
  { label: 'Pending Reviews', value: '23', change: '-5', trend: 'down', icon: FiClock, color: 'text-amber-600 dark:text-amber-400' },
  { label: 'System Health', value: '99.9%', change: '0%', trend: 'neutral', icon: FiShield, color: 'text-emerald-600 dark:text-emerald-400' },
]

const recentActivity = [
  { id: 1, type: 'user_registered', user: 'Priya Sharma', action: 'registered', time: '2 min ago', icon: FiUserPlus, color: 'text-emerald-600' },
  { id: 2, type: 'job_posted', user: 'AMTRON HR', action: 'posted job', target: 'Software Developer', time: '5 min ago', icon: FiPlus, color: 'text-blue-600' },
  { id: 3, type: 'application_submitted', user: 'Rahul Kumar', action: 'applied to', target: 'Medical Officer', time: '8 min ago', icon: FiFileText, color: 'text-purple-600' },
  { id: 4, type: 'job_approved', user: 'Admin', action: 'approved job', target: 'Junior Engineer (PWD)', time: '15 min ago', icon: FiCheckCircle, color: 'text-emerald-600' },
  { id: 5, type: 'user_suspended', user: 'Anita Das', action: 'suspended', reason: 'Policy violation', time: '1 hour ago', icon: FiXCircle, color: 'text-muga-600' },
]

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userSearch, setUserSearch] = useState('')
  const [userStatusFilter, setUserStatusFilter] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || user.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchesStatus = !userStatusFilter || user.status === userStatusFilter
    const matchesRole = !userRoleFilter || user.role === userRoleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10)
  const totalPages = Math.ceil(filteredUsers.length / 10)

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-tea-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-tea-900 border-r border-tea-100 dark:border-tea-800 transform transition-transform duration-300">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-tea-100 dark:border-tea-800">
              <Link to="/admin" className="flex items-center gap-2 font-display font-bold text-xl text-tea-600 dark:text-tea-400">
                <span className="w-8 h-8 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-tea-600 dark:text-tea-400">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </span>
                <span className="font-display font-bold">Admin</span>
              </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {[
                { id: 'overview', label: 'Overview', icon: FiActivity },
                { id: 'users', label: 'Users', icon: FiUsers },
                { id: 'jobs', label: 'Jobs', icon: FiBriefcase },
                { id: 'content', label: 'Content', icon: FiFileText },
                { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
                { id: 'settings', label: 'Settings', icon: FiSettings },
                { id: 'security', label: 'Security', icon: FiShield },
                { id: 'logs', label: 'Logs', icon: FiDatabase },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${activeTab === item.id
                      ? 'bg-tea-100 dark:bg-tea-800 text-tea-900 dark:text-tea-100'
                      : 'text-tea-600 dark:text-tea-400 hover:bg-tea-100 dark:hover:bg-tea-800'}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-tea-100 dark:border-tea-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tea-100 dark:bg-tea-800 flex items-center justify-center text-tea-600 dark:text-tea-400">
                  <FiShield size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-tea-900 dark:text-tea-100 truncate">Admin User</p>
                  <p className="text-xs text-tea-500 dark:text-tea-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white dark:bg-tea-900 border-b border-tea-100 dark:border-tea-800">
            <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-xl font-display font-bold text-tea-900 dark:text-tea-100">
                {({
                  overview: 'Dashboard Overview',
                  users: 'User Management',
                  jobs: 'Job Management',
                  content: 'Content Management',
                  analytics: 'Analytics & Reports',
                  settings: 'Settings',
                  security: 'Security Center',
                  logs: 'System Logs',
                }[activeTab] || 'Dashboard')}
              </h1>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm"><FiBell size={18} /></Button>
                <div className="w-8 h-8 rounded-full bg-tea-100 dark:bg-tea-800 flex items-center justify-center text-tea-600 dark:text-tea-400">
                  <span className="text-sm font-medium">AD</span>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {stats.map((stat, i) => (
                    <Card key={stat.label} className="card-hover" style={{animationDelay: `${i * 50}ms`}}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-tea-600 dark:text-tea-400">{stat.label}</p>
                          <p className="text-3xl font-display font-bold text-tea-900 dark:text-tea-100 mt-1">{stat.value}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-muga-600' : 'text-tea-500'}`}>
                              {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'} {stat.change}
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-tea-100 dark:bg-tea-800 flex items-center justify-center" style={{color: stat.color}}>
                          <stat.icon size={24} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FiActivity size={20} className="text-tea-600 dark:text-tea-400" />
                        Recent Activity
                      </CardTitle>
                      <Button variant="ghost" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((activity, i) => (
                          <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-tea-50 dark:hover:bg-tea-800/50 transition-colors">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.color}`}>
                              <activity.icon size={18} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-tea-900 dark:text-tea-100">
                                <span className="font-medium">{activity.user}</span> {activity.action} 
                                {activity.target && <span className="font-medium text-tea-600 dark:text-tea-400"> {activity.target}</span>}
                              </p>
                              <p className="text-xs text-tea-500 dark:text-tea-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FiDatabase size={20} className="text-tea-600 dark:text-tea-400" />
                          System Status
                        </CardTitle>
                      </CardHeader>
<CardContent className="space-y-4">
                        <div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                              <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Uptime</p>
                              <p className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">99.99%</p>
                            </div>
                            <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                              <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Response Time</p>
                              <p className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">42ms</p>
                            </div>
                            <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                              <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Active Users</p>
                              <p className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">1,234</p>
                            </div>
                            <div className="p-4 bg-tea-50 dark:bg-tea-800/50 rounded-xl">
                              <p className="text-xs text-tea-500 dark:text-tea-500 mb-1">Storage Used</p>
                              <p className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">2.3 GB / 10 GB</p>
                            </div>
                          </div>
                          <div className="h-2 bg-tea-100 dark:bg-tea-800 rounded-full overflow-hidden">
                            <div className="h-full bg-tea-600 rounded-full" style={{width: '23%'}} />
                          </div>
                          <p className="text-xs text-tea-500 dark:text-tea-500">Storage: 23% used</p>
                        </div>
                      </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel