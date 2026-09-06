import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopBar from '../components/common/TopBar.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { SectorExplorer } from '../components/jobs/SectorExplorer.jsx'
import JobList from '../components/jobs/JobList.jsx'
import { Card, CardHeader, CardTitle, Input, Select, Button, Badge, SelectOption } from '../components/ui/21st'

function Jobs() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [jobType, setJobType] = useState(searchParams.get('type') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'health', label: 'Health & Medical' },
    { value: 'education', label: 'Education & Teaching' },
    { value: 'engineering', label: 'Engineering & Technical' },
    { value: 'admin', label: 'Administration' },
    { value: 'banking', label: 'Banking & Finance' },
    { value: 'railway', label: 'Railway & Transport' },
    { value: 'psu', label: 'PSU & Central Govt' },
    { value: 'police', label: 'Police & Defence' },
    { value: 'agriculture', label: 'Agriculture & Allied' },
    { value: 'it', label: 'IT & Software' },
    { value: 'other', label: 'Others' },
  ]

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'government', label: 'Government' },
    { value: 'psu', label: 'PSU' },
    { value: 'private', label: 'Private' },
    { value: 'contract', label: 'Contract' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'deadline', label: 'Deadline Soon' },
    { value: 'vacancies', label: 'Most Vacancies' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (category) params.set('category', category)
    if (jobType) params.set('type', jobType)
    if (location) params.set('location', location)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setCategory('')
    setJobType('')
    setLocation('')
    setSortBy('newest')
    setSearchParams({ q: searchQuery })
  }

  const hasActiveFilters = category || jobType || location || sortBy !== 'newest'

  return (
    <>
      <TopBar title="Jobs" />
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Page Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-tea-900 dark:text-tea-100">Find Your Dream Job</h1>
              <p className="text-tea-600 dark:text-tea-400 mt-1">
                Discover 15,000+ verified government & private jobs across Assam
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <FiFilter size={18} className="mr-2" />
                Filters {hasActiveFilters && <span className="ml-2 px-2 py-0.5 text-xs bg-tea-100 dark:bg-tea-800 text-tea-700 dark:text-tea-300 rounded-full">Active</span>}
              </Button>
              <Button variant="secondary" onClick={clearFilters} disabled={!hasActiveFilters}>
                Clear All
              </Button>
            </div>
          </div>

          {/* Search Bar */}
<form onSubmit={handleSearch} className="card p-4 mb-6 animate-slide-up">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-tea-400" size={20} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs by title, organization, keyword..."
                    className="input pl-12 pr-4"
                  />
                </div>
              <Button type="submit" className="btn-primary whitespace-nowrap">
                <FiSearch size={18} className="mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Quick Filters Bar */}
          <div className="flex flex-wrap gap-3 mb-6 animate-slide-up" style={{animationDelay: '100ms'}}>
            <Select
              value={category}
              onValueChange={setCategory}
              options={categories}
              className="w-full sm:w-48"
              placeholder="Category"
            />
            <Select
              value={jobType}
              onValueChange={setJobType}
              options={jobTypes}
              className="w-full sm:w-40"
              placeholder="Job Type"
            />
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (City/District)"
              leftIcon={<FiMapPin size={18} />}
              className="w-full sm:w-48"
            />
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              options={sortOptions}
              className="w-full sm:w-44"
              placeholder="Sort By"
            />
          </div>

          {showFilters && (
            <div className="card p-4 space-y-4 animate-slide-down" style={{animationDelay: '100ms'}}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-tea-900 dark:text-tea-100">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasActiveFilters}>
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="input-label">Category</label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    placeholder="All Categories"
                    options={categories}
                  />
                </div>
                <div>
                  <label className="input-label">Job Type</label>
                  <Select
                    value={jobType}
                    onValueChange={setJobType}
                    placeholder="All Types"
                    options={jobTypes}
                  />
                </div>
                <div>
                  <label className="input-label">Location</label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City/District"
                    leftIcon={<FiMapPin size={18} />}
                  />
                </div>
                <div>
                  <label className="input-label">Sort By</label>
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                    placeholder="Sort By"
                    options={sortOptions}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-tea-100 dark:border-tea-700">
                <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
                  Clear All Filters
                </Button>
                <Button onClick={handleSearch}>
                  <FiSearch size={16} className="mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          )}

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-6 flex-wrap animate-slide-up" style={{animationDelay: '100ms'}}>
            <span className="text-sm text-tea-600 dark:text-tea-400 mr-2">Quick:</span>
            {[
              { label: 'Urgent', value: 'urgent' },
              { label: 'Featured', value: 'featured' },
              { label: 'Government', value: 'government' },
              { label: 'Private', value: 'private' },
              { label: 'PSU', value: 'psu' },
              { label: 'This Week', value: 'this-week' },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={category === filter.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCategory(category === filter.value ? '' : filter.value)}
                className="whitespace-nowrap"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sector Explorer */}
        <SectorExplorer />

        {/* Job Listings */}
        <JobList />
      </div>
    </>
  )
}

export default Jobs