import React from 'react'
import { FiMapPin, FiBriefcase, FiHome, FiExternalLink, FiCalendar, FiAlertCircle, FiBookmark, FiShare2, FiBookOpen } from 'react-icons/fi'
import { Card, CardContent, CardFooter } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Avatar } from './Avatar'

const typeColors = {
  government: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  private: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  psu: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  contract: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

export function JobCard({
  job,
  onApply,
  onSave,
  onShare,
  showActions = true,
  variant = 'default',
}) {
  const isUrgent = job.isUrgent || (job.lastDate && new Date(job.lastDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-tea-900 rounded-xl border border-tea-100 dark:border-tea-800 p-4 hover:border-tea-200 dark:hover:border-tea-700 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="font-semibold text-tea-900 dark:text-tea-100 truncate">{job.title}</h3>
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
            <div className="flex items-center gap-4 text-sm text-tea-600 dark:text-tea-400 mb-2 flex-wrap">
              {job.organization && (
                <span className="flex items-center gap-1">
                  <FiHome size={14} className="text-tea-400" />
                  <span className="truncate max-w-[150px]">{job.organization}</span>
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <FiMapPin size={14} className="text-tea-400" />
                  <span>{job.location}</span>
                </span>
              )}
              {job.lastDate && (
                <span className={["flex items-center gap-1", isUrgent ? 'text-muga-600 font-medium' : 'text-tea-600 dark:text-tea-400'].join(" ")}>
                  <FiCalendar size={14} className="text-tea-400" />
                  <span>Last: {job.lastDate}</span>
                </span>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => onApply && onApply(job.id)}
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
      <div className={["p-5 pb-0", isUrgent && "bg-muga-50/50 dark:bg-muga-900/10 border-t-2 border-muga-400"].filter(Boolean).join(" ")}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-lg font-semibold text-tea-900 dark:text-tea-100 truncate">{job.title}</h3>
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
            <p className="text-tea-600 dark:text-tea-400 text-sm mb-3 line-clamp-2">{job.department || job.organization}</p>

            <div className="flex flex-wrap gap-4 text-sm text-tea-600 dark:text-tea-400 mb-4">
              {job.organization && (
                <div className="flex items-center gap-1.5">
                  <FiHome size={14} className="text-tea-400" />
                  <span className="font-medium text-tea-900 dark:text-tea-100">{job.organization}</span>
                </div>
              )}
              {job.department && (
                <div className="flex items-center gap-1.5">
                  <FiHome size={14} className="text-tea-400" />
                  <span>{job.department}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-1.5 text-tea-600 dark:text-tea-400">
                  <FiMapPin size={14} className="text-tea-400" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.vacancies && (
                <div className="flex items-center gap-1.5 text-tea-600 dark:text-tea-400">
                  <FiBriefcase size={14} className="text-tea-400" />
                  <span>{job.vacancies} Posts</span>
                </div>
              )}
              {job.qualification && (
                <div className="flex items-center gap-1.5 text-tea-600 dark:text-tea-400">
                  <FiBookOpen size={14} className="text-tea-400" />
                  <span className="truncate max-w-[150px]">{job.qualification}</span>
                </div>
              )}
              {job.experience && (
                <div className="flex items-center gap-1.5 text-tea-600 dark:text-tea-400">
                  <FiBriefcase size={14} className="text-tea-400" />
                  <span>{job.experience}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="text-tea-400">₹</span>
                  <span>{job.salary}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-tea-100 dark:border-tea-800">
              {job.postedDate && (
                <div className="flex items-center gap-1.5 text-sm text-tea-600 dark:text-tea-400">
                  <FiCalendar size={14} className="text-tea-400" />
                  <span>Posted: {job.postedDate}</span>
                </div>
              )}
              {job.lastDate && (
                <div className={["flex items-center gap-1.5 text-sm font-medium", isUrgent ? 'text-muga-600' : 'text-tea-600 dark:text-tea-400'].join(" ")}>
                  <FiCalendar size={14} className="text-tea-400" />
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
              fallback={job.organization && job.organization.charAt(0)}
              size="lg"
            />
          )}
        </div>
      </div>

      <CardContent className="pt-0">
        {job.description && (
          <p className="text-tea-700 dark:text-tea-300 mb-4 line-clamp-3">{job.description}</p>
        )}

        {(job.vacancies || job.qualification || job.experience || job.salary) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-4 bg-tea-50/50 dark:bg-tea-800/30 rounded-xl">
            {job.vacancies && (
              <div className="text-center p-3 bg-white dark:bg-tea-900 rounded-lg border border-tea-100 dark:border-tea-800">
                <div className="text-2xl font-bold text-tea-600 dark:text-tea-400">{job.vacancies}</div>
                <div className="text-xs text-tea-500">Vacancies</div>
              </div>
            )}
            {job.qualification && (
              <div className="text-center p-3 bg-white dark:bg-tea-900 rounded-lg border border-tea-100 dark:border-tea-800">
                <div className="text-sm font-medium text-tea-600 dark:text-tea-400 truncate">{job.qualification}</div>
                <div className="text-xs text-tea-500">Qualification</div>
              </div>
            )}
            {job.experience && (
              <div className="text-center p-3 bg-white dark:bg-tea-900 rounded-lg border border-tea-100 dark:border-tea-800">
                <div className="text-sm font-medium text-tea-600 dark:text-tea-400">{job.experience}</div>
                <div className="text-xs text-tea-500">Experience</div>
              </div>
            )}
            {job.salary && (
              <div className="text-center p-3 bg-white dark:bg-tea-900 rounded-lg border border-tea-100 dark:border-tea-800">
                <div className="text-sm font-medium text-emerald-600">{job.salary}</div>
                <div className="text-xs text-tea-500">Salary</div>
              </div>
            )}
          </div>
        )}

        {job.lastDate && isUrgent && (
          <div className="mb-4 p-3 bg-muga-50 dark:bg-muga-900/20 border border-muga-200 dark:border-muga-800 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-muga-100 dark:bg-muga-900/40 rounded-lg text-muga-600 dark:text-muga-300">
              <FiAlertCircle size={20} />
            </div>
            <div>
              <p className="font-medium text-muga-800 dark:text-muga-200">Application Deadline Approaching!</p>
              <p className="text-sm text-muga-600 dark:text-muga-300">Last date to apply: <strong>{job.lastDate}</strong></p>
            </div>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex-wrap gap-3">
          <Button
            onClick={() => onApply && onApply(job.id)}
            size="lg"
            className="flex-1 sm:flex-none"
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            onClick={() => onSave && onSave(job.id)}
            aria-label="Save job"
          >
            <FiBookmark size={18} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onShare && onShare(job.id)}
            aria-label="Share job"
          >
            <FiShare2 size={18} />
          </Button>
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-tea-600 dark:text-tea-300 bg-tea-50 dark:bg-tea-800 border border-tea-200 dark:border-tea-700 rounded-xl hover:bg-tea-100 dark:hover:bg-tea-700 transition-colors"
            >
              <FiExternalLink size={16} />
              Official Site
            </a>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
