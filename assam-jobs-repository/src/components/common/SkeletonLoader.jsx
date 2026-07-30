import React from 'react'

export function JobCardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-8 w-24" />
    </div>
  )
}

export function ListSkeleton({ count = 4, Item = JobCardSkeleton }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <Item key={i} />)}
    </div>
  )
}
