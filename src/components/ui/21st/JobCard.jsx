import React from 'react'
import { MapPin, Clock, Building2, Briefcase, Tag, ExternalLink, Calendar, AlertCircle } from 'react-icons/fi'
import { Card, CardContent, CardFooter } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Avatar } from './Avatar'

export interface JobCardProps {
  job: {
    id: string
    title: string
    organization: string
    department?: string
    location?: string
    vacancies?: string | number
    qualification?: string
    lastDate?: string
    postedDate?: string
    jobType?: 'government' | 'private' | 'psu' | 'contract'
    category?: string
    logo?: string
    applyUrl?: string
    isUrgent?: boolean
    isFeatured?: boolean
    salary?: string
    experience?: string
  }
  onApply?: (jobId: string) => void
  onSave?: (jobId: string) => void
  onShare?: (jobId: string) => void
  showActions?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

const typeColors = {
  government: 'bg-blue-100 text-blue-700',
  private: 'bg-purple-100 text-purple-700',
  psu: 'bg-amber-100 text-amber-700',
  contract: 'bg-green-100 text-green-700',
}

const urgencyColors = {
  urgent: 'bg-muga-100 text-muga-700 border-muga-300',
  normal: 'bg-tea-100 text-tea-700 border-tea-200',
}

export function JobCard({
  job,
  onApply,
  onSave,
  onShare,
  showActions = true,
  variant = 'default',
}: JobCardProps) {
  const isUrgent = job.isUrgent || (job.lastDate && new Date(job.lastDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl border border-tea-100 p-4 hover:border-tea-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="font-semibold text-tea-900 truncate">{job.title}</h3>
              <Badge variant="outline" className={typeColors[job.jobType || 'government']}>
                {job.jobType || 'Government'}
              </Badge>
              {job.isFeatured && (
                <Badge variant="warning">Featured</Badge>
              )}
              {isUrgent && (
                <Badge variant="destructive" className="animate-pulse">
                  Urgent
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-tea-600 mb-2 flex-wrap">
              {job.organization && (
                <span className="flex items-center gap-1">
                  <span className="text-tea-400">Building2</span>
                  <span className="truncate max-w-[150px]">{job.organization}</span>
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <span className="text-tea-400">MapPin</span>
                  <span>{job.location}</span>
                </span>
              )}
              {job.lastDate && (
                <span className={["flex items-center gap-1", isUrgent ? 'text-muga-600 font-medium' : 'text-tea-600'].join(" ")}>
                  <span className="text-tea-400">Calendar</span>
                  <span>Last: {job.lastDate}</span>
                </span>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => onApply?.(job.id)}
                className="px-3 py-1.5 bg-tea-600 text-white text-sm font-medium rounded-lg hover:bg-tea-700 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className={[
      "overflow-hidden",
      job.isFeatured && "ring-2 ring-amber-400",
      isUrgent && "ring-1 ring-muga-300",
    ].filter(Boolean).join(" ")}>
      <div className={["p-5 pb-0", isUrgent && "bg-muga-50/50 border-t-2 border-muga-400"].filter(Boolean).join(" ")}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-lg font-semibold text-tea-900 truncate">{job.title}</h3>
              <Badge variant="outline" className={typeColors[job.jobType || 'government']}>
                {job.jobType || 'Government'}
              </Badge>
              {job.category && (
                <Badge variant="ghost">{job.category}</Badge>
              )}
              {job.isFeatured && (
                <Badge variant="warning">⭐ Featured</Badge>
              )}
              {isUrgent && (
                <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                  <span>⚠</span> Urgent
                </Badge>
              )}
            </div>
            <p className="text-tea-600 text-sm mb-3 line-clamp-2">{job.department || job.organization}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-tea-600 mb-4">
              {job.organization && (
                <div className="flex items-center gap-1.5">
                  <span className="text-tea-400">Building2</span>
                  <span className="font-medium text-tea-900">{job.organization}</span>
                </div>
              )}
              {job.department && (
                <div className="flex items-center gap-1.5">
                  <span className="text-tea-400">Building2</span>
                  <span>{job.department}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-1.5 text-tea-600">
                  <span className="text-tea-400">MapPin</span>
                  <span>{job.location}</span>
                </div>
              )}
              {job.vacancies && (
                <div className="flex items-center gap-1.5 text-tea-600">
                  <span className="text-tea-400">Briefcase</span>
                  <span>{job.vacancies} Posts</span>
                </div>
              )}
              {job.qualification && (
                <div className="flex items-center gap-1.5 text-tea-600">
                  <span className="text-tea-400">GraduationCap</span>
                  <span className="truncate max-w-[150px]">{job.qualification}</span>
                </div>
              )}
              {job.experience && (
                <div className="flex items-center gap-1.5 text-tea-600">
                  <span className="text-tea-400">Briefcase</span>
                  <span>{job.experience}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="text-tea-400">IndianRupee</span>
                  <span>{job.salary}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-tea-100">
              {job.postedDate && (
                <div className="flex items-center gap-1.5 text-sm text-tea-600">
                  <span className="text-tea-400">Calendar</span>
                  <span>Posted: {job.postedDate}</span>
                </div>
              )}
              {job.lastDate && (
                <div className={["flex items-center gap-1.5 text-sm font-medium", isUrgent ? 'text-muga-600' : 'text-tea-600'].join(" ")}>
                  <span className="text-tea-400">Calendar</span>
                  <span>Last Date: {job.lastDate}</span>
                  {isUrgent && <span className="text-xs bg-muga-100 text-muga-700 px-2 py-0.5 rounded-full animate-pulse">URGENT</span>}
                </div>
              )}
            </div>
          </div>

          {job.logo && (
            <Avatar
              src={job.logo}
              alt={job.organization}
              fallback={job.organization?.charAt(0)}
              size="lg"
            />
          )}
        </div>
      </div>

      <CardContent className="pt-0">
        {job.description && (
          <p className="text-tea-700 mb-4 line-clamp-3">{job.description}</p>
        )}
        
        {(job.vacancies || job.qualification || job.experience || job.salary) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-4 bg-tea-50/50 rounded-xl">
            {job.vacancies && (
              <div className="text-center p-3 bg-white rounded-lg border border-tea-100">
                <div className="text-2xl font-bold text-tea-600">{job.vacancies}</div>
                <div className="text-xs text-tea-500">Vacancies</div>
              </div>
            )}
            {job.qualification && (
              <div className="text-center p-3 bg-white rounded-lg border border-tea-100">
                <div className="text-sm font-medium text-tea-600 truncate">{job.qualification}</div>
                <div className="text-xs text-tea-500">Qualification</div>
              </div>
            )}
            {job.experience && (
              <div className="text-center p-3 bg-white rounded-lg border border-tea-100">
                <div className="text-sm font-medium text-tea-600">{job.experience}</div>
                <div className="text-xs text-tea-500">Experience</div>
              </div>
            )}
            {job.salary && (
              <div className="text-center p-3 bg-white rounded-lg border border-tea-100">
                <div className="text-sm font-medium text-emerald-600">{job.salary}</div>
                <div className="text-xs text-tea-500">Salary</div>
              </div>
            )}
          </div>
        )}

        {job.lastDate && isUrgent && (
          <div className="mb-4 p-3 bg-muga-50 border border-muga-200 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-muga-100 rounded-lg text-muga-600">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="font-medium text-muga-800">Application Deadline Approaching!</p>
              <p className="text-sm text-muga-600">Last date to apply: <strong>{job.lastDate}</strong></p>
            </div>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex-wrap gap-3">
          <Button
            onClick={() => onApply?.(job.id)}
            size="lg"
            className="flex-1 sm:flex-none"
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            onClick={() => onSave?.(job.id)}
            aria-label="Save job"
          >
            <Bookmark size={18} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onShare?.(job.id)}
            aria-label="Share job"
          >
            <Share2 size={18} />
          </Button>
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-tea-600 bg-tea-50 border border-tea-200 rounded-xl hover:bg-tea-100 transition-colors"
            >
              <ExternalLink size={16} />
              Official Site
            </a>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export { JobCard }