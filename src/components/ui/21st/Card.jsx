import React from 'react'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        "bg-white rounded-2xl border border-tea-100 shadow-sm hover:shadow-md",
        "transition-all duration-300",
        "overflow-hidden",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={["flex flex-col space-y-1.5 p-6", className].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={["text-xl font-semibold text-tea-900 leading-tight", className].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={["text-tea-600 text-sm", className].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={["p-6 pt-0", className].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={["flex items-center gap-3 p-6 pt-0 border-t border-tea-100", className].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }