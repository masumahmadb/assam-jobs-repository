import React from 'react'

const Progress = React.forwardRef(
  ({ value = 0, max = 100, className = '', indicatorClassName = '', ...props }, ref) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={["relative w-full overflow-hidden rounded-full bg-tea-100 dark:bg-tea-800", className].join(" ")}
        {...props}
      >
        <div
          className={["h-full bg-tea-600 dark:bg-tea-400 transition-all duration-500", indicatorClassName].filter(Boolean).join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
