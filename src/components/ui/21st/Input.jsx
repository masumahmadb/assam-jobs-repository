import React, { useId } from 'react'

const Input = React.forwardRef(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-tea-900 dark:text-tea-100 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-tea-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              "flex h-11 w-full rounded-xl border bg-white dark:bg-tea-900 px-4 py-2.5 text-sm text-tea-900 dark:text-tea-100",
              "placeholder:text-tea-400",
              "border-tea-200 dark:border-tea-700 hover:border-tea-300 dark:hover:border-tea-600",
              "focus:outline-none focus:ring-2 focus:ring-tea-500 focus:border-tea-500",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-tea-50",
              "transition-all duration-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-muga-500 focus:ring-muga-500 focus:border-muga-500",
              className,
            ].filter(Boolean).join(" ")}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-tea-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-muga-500" role="alert">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-tea-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
