import React from 'react'

const Card = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        "bg-white dark:bg-tea-900 rounded-2xl border border-tea-100 dark:border-tea-800 shadow-sm hover:shadow-md",
        "transition-all duration-300",
        "overflow-hidden",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={["flex flex-col space-y-1.5 p-6", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={["text-xl font-semibold text-tea-900 dark:text-tea-100 leading-tight", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={["text-tea-600 dark:text-tea-400 text-sm", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={["p-6 pt-0", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={["flex items-center gap-3 p-6 pt-0 border-t border-tea-100 dark:border-tea-800", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
