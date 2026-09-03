import React from 'react'

const buttonVariants = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    default: "bg-tea-600 text-white hover:bg-tea-700 active:bg-tea-800 shadow-sm",
    destructive: "bg-muga-500 text-white hover:bg-muga-600 active:bg-muga-700 shadow-sm",
    outline: "border-2 border-tea-600 bg-transparent hover:bg-tea-50 hover:text-tea-700",
    secondary: "bg-tea-100 text-tea-900 hover:bg-tea-200 active:bg-tea-300",
    ghost: "bg-transparent hover:bg-tea-100 hover:text-tea-900",
    link: "text-tea-600 underline-offset-4 hover:underline",
  },
  sizes: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-lg px-3",
    lg: "h-11 rounded-xl px-8",
    xl: "h-12 rounded-xl px-6 text-base",
    icon: "h-10 w-10",
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variants
  size?: keyof typeof buttonVariants.sizes
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    const className = [
      buttonVariants.base,
      buttonVariants.variants[variant],
      buttonVariants.sizes[size],
      className,
    ].filter(Boolean).join(" ")

    return (
      <Comp
        className={className}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }