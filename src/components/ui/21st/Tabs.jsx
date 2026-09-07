import React, { createContext, useContext, useState } from 'react'

const TabsContext = createContext(null)

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
  orientation = 'horizontal',
}) {
  const [valueState, setValueState] = useState(defaultValue || '')
  const controlled = value !== undefined
  const currentValue = controlled ? value : valueState

  const handleChange = (val) => {
    if (!controlled) setValueState(val)
    if (onValueChange) onValueChange(val)
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange, orientation }}>
      <div className={className} data-orientation={orientation}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '', 'aria-label': ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={[
        "inline-flex flex-wrap items-center gap-1 bg-tea-100 dark:bg-tea-800 p-1 rounded-xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, disabled, className = '' }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const selected = context.value === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && context.onValueChange(value)}
      className={[
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "bg-tea-600 text-white shadow-sm"
          : "text-tea-700 dark:text-tea-300 hover:bg-tea-200/60 dark:hover:bg-tea-700 hover:text-tea-900 dark:hover:text-tea-100",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className = '', forceMount }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  const selected = context.value === value

  if (!selected && !forceMount) return null

  return (
    <div
      role="tabpanel"
      className={[
        "mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-tea-500 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      hidden={!selected}
    >
      {children}
    </div>
  )
}
