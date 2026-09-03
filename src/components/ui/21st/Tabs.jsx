import React from 'react'

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
  orientation = "horizontal",
}: TabsProps) {
  const [valueState, setValueState] = React.useState(defaultValue || "")
  const controlled = value !== undefined
  const currentValue = controlled ? value : valueState

  const handleChange = (value: string) => {
    if (!controlled) setValueState(value)
    onValueChange?.(value)
  }

  return (
    <div className={className} data-orientation={orientation}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, {
          value: currentValue,
          onValueChange: handleChange,
        } as any)
      })}
    </div>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  "aria-label"?: string
}

export function TabsList({ children, className = "", "aria-label": ariaLabel }: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center gap-1 bg-tea-100 p-1 rounded-xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function TabsTrigger({ value, children, disabled, className = "" }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const { value: currentValue, onValueChange, orientation } = context
  const selected = currentValue === value

  return (
    <button
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      type="button"
      onClick={() => !disabled && context.onValueChange(value)}
      className={[
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "bg-tea-600 text-white shadow-sm"
          : "text-tea-700 hover:bg-tea-100 hover:text-tea-900",
        "disabled:opacity-50",
        className,
      ].join(" "))
      aria-selected={selected}
      aria-disabled={disabled}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  forceMount?: boolean
}

export function TabsContent({ value, children, className = "", forceMount }: TabsContentProps) {
  const context = React.useContext(TabsContext)
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

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  orientation: 'horizontal' | 'vertical'
} | null>(null)

function TabsProvider({ children, value, onValueChange, orientation }: {
  value: string
  onValueChange: (value: string) => void
  orientation: 'horizontal' | 'vertical'
  children: React.ReactNode
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange, orientation }}>
      {children}
    </TabsContext.Provider>
  )
}

// Update Tabs to use provider
const TabsWithProvider = ({ defaultValue, value, onValueChange, children, className = "", orientation = "horizontal" }: TabsProps) => {
  const [valueState, setValueState] = React.useState(defaultValue || "")
  const controlled = value !== undefined
  const currentValue = controlled ? value : valueState

  const handleChange = (val: string) => {
    if (!controlled) setValueState(val)
    onValueChange?.(val)
  }

  return (
    <TabsProvider value={currentValue} onValueChange={handleChange} orientation={orientation}>
      <div className={className} data-orientation={orientation}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child
          return React.cloneElement(child) // No need to pass props as they use context
        })}
    </TabsProvider>
  )
}

// Override the exports
export { TabsWithProvider as Tabs, TabsList, TabsTrigger, TabsContent }