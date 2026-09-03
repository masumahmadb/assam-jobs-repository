import React from 'react'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-xl',
}

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-tea-300',
  busy: 'bg-muga-500',
  away: 'bg-amber-500',
}

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const showFallback = !src || imageError
  const initials = fallback || (alt ? alt.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?')

  return (
    <div
      className={["relative inline-flex shrink-0", shapeClasses[shape], sizeClasses[size], className].filter(Boolean).join(" ")}
      {...props}
    >
      {!showFallback && src && (
        <img
          src={src}
          alt={alt || ''}
          onError={() => setImageError(true)}
          className={["w-full h-full object-cover", shapeClasses[shape]].join(" ")}
        />
      )}
      {showFallback && (
        <div
          className={[
            "flex items-center justify-center bg-tea-100 text-tea-600 font-medium",
            "w-full h-full",
            shapeClasses[shape],
          ].join(" ")}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={[
            "absolute bottom-0 right-0 border-2 border-white",
            "rounded-full",
            statusColors[status],
            statusSizes[size],
          ].join(" ")}
        />
      )}
    </div>
  )
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  overlap?: number
}

export function AvatarGroup({
  children,
  max = 5,
  size = 'md',
  overlap = 8,
  className = '',
  ...props
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children)
  const visibleChildren = childrenArray.slice(0, max)
  const remaining = childrenArray.length - max

  const overlapStyles = {
    '--avatar-overlap': `${overlap}px`,
  } as React.CSSProperties

  return (
    <div className={["flex -space-x-[var(--avatar-overlap)]", className].join(" ")} style={overlapStyles} {...props}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="relative z-[auto]" style={{ zIndex: visibleChildren.length - index }}>
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={[
            "flex items-center justify-center bg-tea-100 text-tea-600 font-medium font-mono",
            "border-2 border-white",
            "rounded-full",
            "flex-shrink-0",
            size === 'xs' && 'w-6 h-6 text-[10px]',
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-10 h-10 text-sm',
            size === 'lg' && 'w-12 h-12 text-base',
            size === 'xl' && 'w-16 h-16 text-lg',
          ].filter(Boolean).join(" ")}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }