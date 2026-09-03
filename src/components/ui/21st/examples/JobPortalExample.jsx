import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableHeader as TableHeaderComp,
  Modal,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Avatar,
  AvatarGroup,
  Pagination,
  JobCard,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../index'

// Example: Complete Job Portal Page using 21st.dev components
export function JobPortalExample() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [filters, setFilters] = useState({
    category: '',
    jobType: '',
    location: '',
    salaryRange: '',
  })

  const mockJobs = [
    {
      id: '1',
      title: 'Medical Officer',
      organization: 'National Health Mission Assam',
      department: 'Health & Family Welfare',
      location: 'Guwahati, Assam',
      vacancies: 50,
      qualification: 'MBBS with MCI Registration',
      lastDate: '2026-09-15',
      postedDate: '2026-08-01',
      jobType: 'government',
      category: 'Health',
      salary: '₹56,100 - ₹1,77,500',
      experience: '0-2 years',
      isUrgent: true,
      isFeatured: true,
      applyUrl: 'https://nhm.assam.gov.in/apply/1',
    },
    {
      id: '2',
      title: 'Assistant Professor',
      organization: 'Assam Medical College',
      department: 'Medical Education',
      location: 'Dibrugarh, Assam',
      vacancies: 12,
      qualification: 'MD/MS/DNB in relevant specialty',
      lastDate: '2026-09-20',
      postedDate: '2026-08-05',
      jobType: 'government',
      category: 'Education',
      salary: '₹67,700 - ₹2,08,700',
      experience: '3 years teaching experience',
      isFeatured: false,
      applyUrl: 'https://amc.assam.gov.in/apply/2',
    },
    {
      id: '3',
      title: 'Junior Engineer (Civil)',
      organization: 'PWD Assam',
      department: 'Public Works Department',
      location: 'Multiple Districts',
      vacancies: 200,
      qualification: 'Diploma/Degree in Civil Engineering',
      lastDate: '2026-09-10',
      postedDate: '2026-07-28',
      jobType: 'government',
      category: 'Engineering',
      salary: '₹35,400 - ₹1,12,400',
      experience: '0-3 years',
      isUrgent: true,
      applyUrl: 'https://pwd.assam.gov.in/apply/3',
    },
    {
      id: '4',
      title: 'Software Developer',
      organization: 'AMTRON',
      department: 'IT & Electronics',
      location: 'Guwahati',
      vacancies: 25,
      qualification: 'B.Tech/MCA in Computer Science',
      lastDate: '2026-09-25',
      postedDate: '2026-08-10',
      jobType: 'psu',
      category: 'IT',
      salary: '₹40,000 - ₹1,20,000',
      experience: '1-4 years',
      applyUrl: 'https://amtron.in/careers/4',
    },
    {
      id: '5',
      title: 'Sales Executive',
      organization: 'HDFC Bank',
      department: 'Retail Banking',
      location: 'Guwahati, Jorhat, Silchar',
      vacancies: 100,
      qualification: 'Graduate in any discipline',
      lastDate: '2026-09-30',
      postedDate: '2026-08-12',
      jobType: 'private',
      category: 'Banking',
      salary: '₹25,000 - ₹50,000 + incentives',
      experience: '0-2 years',
      applyUrl: 'https://careers.hdfcbank.com/5',
    },
  ]

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filters.category || job.category === filters.category
    const matchesType = !filters.jobType || job.jobType === filters.jobType
    const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())
    return matchesSearch && matchesCategory && matchesType && matchesLocation
  })

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * 10, currentPage * 10)
  const totalPages = Math.ceil(filteredJobs.length / 10)

  const handleRowClick = (job: any) => {
    setSelectedJob(job)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-tea-50">
      {/* Header */}
      <header className="bg-tea-600 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold font-display">Assam Jobs Portal</h1>
              <Badge variant="success">21st.dev Powered</Badge>
            </div>
            <div className="flex items-center gap-3">
              <AvatarGroup max={4} size="sm">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" fallback="SK" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" fallback="RK" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" fallback="PM" />
              </AvatarGroup>
              <Button variant="ghost" size="sm">Profile</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search jobs by title, organization, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} className="text-tea-400" />}
                placeholder="Search jobs..."
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full sm:w-auto">
                <Filter size={18} className="mr-2" />
                Filters
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-tea-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 border border-tea-200 rounded-lg focus:ring-2 focus:ring-tea-500 focus:border-tea-500"
                    >
                      <option value="">All Categories</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Engineering">Engineering</option>
                      <option value="IT">IT</option>
                      <option value="Banking">Banking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tea-700 mb-2">Job Type</label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                      className="w-full px-3 py-2 border border-tea-200 rounded-lg focus:ring-2 focus:ring-tea-500 focus:border-tea-500"
                    >
                      <option value="">All Types</option>
                      <option value="government">Government</option>
                      <option value="psu">PSU</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tea-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Enter city/district"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full px-3 py-2 border border-tea-200 rounded-lg focus:ring-2 focus:ring-tea-500 focus:border-tea-500"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setFilters({category: '', jobType: '', location: '', salaryRange: ''})} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList aria-label="Job categories">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
            <TabsTrigger value="government">Government</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="psu">PSU</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <JobListings jobs={filteredJobs} onRowClick={handleRowClick} />
          </TabsContent>
          <TabsContent value="featured">
            <JobListings jobs={filteredJobs.filter(j => j.isFeatured)} onRowClick={handleRowClick} />
          </TabsContent>
          <TabsContent value="urgent">
            <JobListings jobs={filteredJobs.filter(j => j.isUrgent)} onRowClick={handleRowClick} />
          </TabsContent>
          <TabsContent value="government">
            <JobListings jobs={filteredJobs.filter(j => j.jobType === 'government')} onRowClick={handleRowClick} />
          </TabsContent>
          <TabsContent value="private">
            <JobListings jobs={filteredJobs.filter(j => j.jobType === 'private')} onRowClick={handleRowClick} />
          </TabsContent>
          <TabsContent value="psu">
            <JobListings jobs={filteredJobs.filter(j => j.jobType === 'psu')} onRowClick={handleRowClick} />
          </TabsContent>
        </Tabs>

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

        {/* Job Detail Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedJob?.title}
          size="xl"
        >
          {selectedJob && (
            <JobCard
              job={selectedJob}
              onApply={(id) => { setModalOpen(false); alert(`Applied to job ${id}`); }}
              onSave={(id) => alert(`Saved job ${id}`)}
              onShare={(id) => alert(`Shared job ${id}`)}
            />
          )}
        </Modal>
      </main>
    </div>
  )
}

function JobListings({ jobs, onRowClick }: { jobs: any[]; onRowClick: (job: any) => void }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-tea-400 text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-tea-900 mb-2">No jobs found</h3>
        <p className="text-tea-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onApply={(id) => alert(`Applied to ${id}`)}
          onSave={(id) => alert(`Saved ${id}`)}
          onShare={(id) => alert(`Shared ${id}`)}
          onRowClick={() => {}}
        />
      ))}
    </div>
  )
}

// Icon components (inline for demo)
function Search({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function Filter({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

export default JobPortalExample