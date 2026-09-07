import React from 'react'
import { FiChevronDown } from 'react-icons/fi'

const Select = React.forwardRef(
  ({ className = '', options = [], value, onValueChange, placeholder, disabled, name, id, ...props }, ref) => {
    return (
      <div className={`relative ${className || 'w-full'}`.trim()}>
        <select
          ref={ref}
          id={id}
          name={name}
          value={value ?? ''}
          disabled={disabled}
          onChange={(e) => onValueChange && onValueChange(e.target.value)}
          className={[
            "flex h-11 w-full appearance-none rounded-xl border bg-white dark:bg-tea-900 px-4 pr-10 py-2.5 text-sm text-tea-900 dark:text-tea-100",
            "placeholder:text-tea-400",
            "border-tea-200 dark:border-tea-700 hover:border-tea-300 dark:hover:border-tea-600",
            "focus:outline-none focus:ring-2 focus:ring-tea-500 focus:border-tea-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
          ].join(" ")}
          {...props}
        >
          {placeholder !== undefined && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <FiChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tea-400" />
      </div>
    )
  }
)

Select.displayName = "Select"

function SelectOption({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  )
}

export { Select, SelectOption }
