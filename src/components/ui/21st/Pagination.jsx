import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'react-icons/fi'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = React.useMemo(() => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    if (showFirstLast && start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (showFirstLast && end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }, [currentPage, totalPages, maxVisiblePages, showFirstLast])

  return (
    <nav className={["flex items-center justify-center gap-1", className].join(" ")} aria-label="Pagination">
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={[
            "p-2 rounded-xl text-tea-600 bg-tea-50 border border-tea-200",
            "hover:bg-tea-100 hover:text-tea-900",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "transition-colors",
          ].join(" ")}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-tea-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={[
                "w-10 h-10 rounded-xl text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-tea-600 text-white shadow-sm"
                  : "text-tea-600 hover:bg-tea-100 hover:text-tea-900",
              ].join(" "))
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={[
            "p-2 rounded-xl text-tea-600 bg-tea-50 border border-tea-200",
            "hover:bg-tea-100 hover:text-tea-900",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "transition-colors",
          ].join(" ")}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </nav>
  )
}

export { Pagination }