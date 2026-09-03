import React from 'react'

const badgeVariants = {
  base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  variants: {
    default: "bg-tea-100 text-tea-800",
    secondary: "bg-tea-200 text-tea-900",
    destructive: "bg-muga-100 text-muga-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-sky-100 text-sky-700",
    outline: "border-2 border-tea-200 bg-transparent text-tea-700",
    ghost: "bg-tea-50 text-tea-600",
  },
  sizes: {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0 text-[11px]",
    lg: "px-3 py-1 text-sm",
  },
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants.variants
  size?: keyof typeof badgeVariants.sizes
  dot?: boolean
  dotColor?: string
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "default", dot, dotColor, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[
          badgeVariants.base,
          badgeVariants.variants[variant],
          badgeVariants.sizes[size],
          className,
        ].filter(Boolean).join(" ")}
        {...props}
        ref={ref}
      >
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
            style={{ backgroundColor: dotColor || "currentColor" }}
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }