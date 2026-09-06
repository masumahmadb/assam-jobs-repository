import React, { useState } from 'react'
import TopBar from '../../components/common/TopBar.jsx'
import { useLanguage } from '../../contexts/LanguageContext.jsx'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Select, Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Modal, Input, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, Avatar, AvatarGroup, Pagination } from '../../components/ui/21st'
import { FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye, FiDownload, FiClock, FiUsers, FiBriefcase, FiDollarSign, FiActivity, FiCheckCircle, FiXCircle, FiClock, FiEdit, FiTrash2, FiEye, FiDownload, FiMoreHorizontal } from 'react-icons/fi'

const mockJobs = [
  { id: '1', title: 'Medical Officer', department: 'Health Dept', vacancies: 50, status: 'active', applications: 245, posted: '2026-08-01', deadline: '2026-09-15', type: 'government' },
  { id: '2', title: 'Software Developer', department: 'IT Dept', vacancies: 25, status: 'active', applications: 180, posted: '2026-08-05', deadline: '2026-09-25', type: 'psu' },
  { id: '3', title: 'Junior Engineer', department: 'PWD', vacancies: 200, status: 'active', applications: 1200, posted: '2026-07-28', deadline: '2026-09-10', type: 'government' },
  { id: '4', title: 'Assistant Professor', department: 'Education', vacancies: 12, status: 'draft', applications: 0, posted: '2026-08-10', deadline: '2026-09-20', type: 'government' },
  { id: '5', title: 'Sales Executive', department: 'Sales', vacancies: 50, status: 'expired', applications: 320, posted: '2026-07-15', deadline: '2026-08-15', type: 'private' },
]

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  draft: 'bg-tea-100 text-tea-700 dark:bg-tea-800 dark:text-tea-300',
  expired: 'bg-muga-100 text-muga-700 dark:bg-muga-900/30 dark:text-muga-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

const typeColors = {
  government: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  private: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  psu: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

function EmployerDashboard() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('jobs')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({
    title: '', department: '', vacancies: '', status: 'draft', type: 'government', deadline: '', description: ''
  })

  const handleNewJob = () => {
    setEditingJob(null)
    setFormData({ title: '', department: '', vacancies: '', status: 'draft', type: 'government', deadline: '', description: '' })
    setModalOpen(true)
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({ ...job })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Save job
    setModalOpen(false)
  }

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * 10, currentPage * 10)
  const totalPages = Math.ceil(filteredJobs.length / 10)

  return (
    <>
      <TopBar title="Employer Dashboard" />
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-tea-900 dark:text-tea-100">Employer Dashboard</h1>
              <p className="text-tea-600 dark:text-tea-400 mt-1">Manage your job postings and applications</p>
            </div>
            <Button onClick={handleNewJob} size="lg">
              <FiPlus size={18} className="mr-2" />
              Post New Job
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up" style={{animationDelay: '100ms'}}>
            {[
              { label: 'Active Jobs', value: '3', icon: FiBriefcase, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
              { label: 'Total Applications', value: '1,645', icon: FiUsers, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
              { label: 'Draft Jobs', value: '1', icon: FiClock, color: 'bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300' },
              { label: 'Expired Jobs', value: '1', icon: FiXCircle, color: 'bg-muga-100 dark:bg-muga-900/30 text-muga-700 dark:text-muga-300' },
            ].map((stat, i) => (
              <div key={stat.label} className="card-hover p-5 group" style={{animationDelay: `${i * 50}ms`}}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-tea-900 dark:text-tea-100">{stat.value}</div>
                    <div className="text-sm text-tea-600 dark:text-tea-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card p-4 mb-6 animate-slide-up" style={{animationDelay: '100ms'}}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-tea-400" size={20} />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, department..."
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'expired', label: 'Expired' },
                  { value: 'pending', label: 'Pending' },
                ]}
                className="w-full sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" onValueChange={setActiveTab} className="mb-6">
          <TabsList aria-label="Dashboard sections">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            {/* Jobs Table */}
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Vacancies</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedJobs.map((job) => (
                        <TableRow key={job.id} className="hover:bg-tea-50 dark:hover:bg-tea-800/50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-tea-900 dark:text-tea-100">{job.title}</p>
                              <p className="text-sm text-tea-600 dark:text-tea-400">{job.department}</p>
                            </div>
                          </TableCell>
                          <TableCell>{job.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={typeColors[job.type]}>{job.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{job.vacancies}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[job.status]}>{job.status}</Badge>
                          </TableCell>
                          <TableCell className="font-medium text-tea-600 dark:text-tea-400">{job.applications}</TableCell>
                          <TableCell>
                            <span className={new Date(job.deadline) < new Date() ? 'text-muga-600 font-medium' : 'text-tea-600 dark:text-tea-400'}>
                              {job.deadline}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(job)} className="text-tea-600 hover:text-tea-900">
                                <FiEdit size={16} />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-tea-600 hover:text-tea-900">
                                <FiEye size={16} />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muga-600 hover:text-muga-900">
                                <FiTrash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedJobs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-tea-500 dark:text-tea-400">
                            No jobs found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                  <CardDescription>Manage and review applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: '1', job: 'Medical Officer', candidate: 'Priya Sharma', email: 'priya@email.com', applied: '2026-08-15', status: 'under_review' },
                      { id: '2', job: 'Software Developer', candidate: 'Rahul Kumar', email: 'rahul@email.com', applied: '2026-08-14', status: 'shortlisted' },
                      { id: '3', job: 'Junior Engineer', candidate: 'Anita Das', email: 'anita@email.com', applied: '2026-08-13', status: 'pending' },
                    ].map((app) => (
                      <div key={app.id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-semibold text-tea-900 dark:text-tea-100">{app.job}</h4>
                            <Badge variant="outline" className={typeColors.government}>Government</Badge>
                          </div>
                          <p className="text-sm text-tea-600 dark:text-tea-400">{app.candidate} • {app.email}</p>
                          <div className="flex items-center gap-3 text-sm text-tea-600 dark:text-tea-400 mt-1">
                            <span className="flex items-center gap-1"><FiCalendar size={12} /> Applied: {app.applied}</span>
                            <Badge variant={
                              app.status === 'shortlisted' ? 'success' :
                              app.status === 'under_review' ? 'warning' :
                              'ghost'
                            }>{app.status}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button variant="outline" size="sm">View Profile</Button>
                          <Button variant="outline" size="sm">Message</Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <FiMoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Shortlist</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-muga-600">Reject</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="p-6">
                    <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">Total Views</h3>
                    <p className="text-3xl font-display font-bold text-tea-600 dark:text-tea-400">12,450</p>
                    <p className="text-sm text-tea-600 dark:text-tea-400 mt-1">+12% from last month</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">Applications Received</h3>
                    <p className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">1,645</p>
                    <p className="text-sm text-tea-600 dark:text-tea-400 mt-1">+18% from last month</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-tea-900 dark:text-tea-100 mb-2">Conversion Rate</h3>
                    <p className="text-3xl font-display font-bold text-muga-600 dark:text-muga-400">13.2%</p>
                    <p className="text-sm text-tea-600 dark:text-tea-400 mt-1">Above industry average</p>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Applications Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-tea-50 dark:bg-tea-800/50 rounded-xl flex items-center justify-center">
                      <span className="text-tea-400">Chart placeholder - integrate with Recharts/Chart.js</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Profile</CardTitle>
                    <CardDescription>Manage your organization's public profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Organization Name" placeholder="Your organization name" value="Assam Health Department" />
                      <Input label="Website" placeholder="https://yourwebsite.com" value="https://health.assam.gov.in" />
                      <Input label="Contact Email" placeholder="hr@organization.com" value="hr@health.assam.gov.in" />
                      <Input label="Contact Phone" placeholder="+91 361 234 5678" value="+91 361 234 5678" />
                    </div>
                    <div>
                      <label className="input-label">Organization Description</label>
                      <textarea className="input min-h-[100px] resize-y" placeholder="Describe your organization...">Assam Health Department is committed to providing quality healthcare services...</textarea>
                    </div>
                    <Button className="w-full md:w-auto">Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default EmployerDashboard