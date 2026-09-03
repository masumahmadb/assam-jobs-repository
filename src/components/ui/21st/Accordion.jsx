import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-icons/fi'

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
  allowToggle?: boolean
}

export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
  allowToggle = true,
}: AccordionProps) {
  const [valueState, setValueState] = useState<string | string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  )

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : valueState

  const handleChange = (itemValue: string) => {
    let newValue: string | string[]
    if (type === 'single') {
      newValue = currentValue === itemValue && allowToggle ? '' : itemValue
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      if (currentArray.includes(itemValue)) {
        newValue = currentArray.filter(v => v !== itemValue)
      } else {
        newValue = [...currentArray, itemValue]
      }
    }
    if (!value) setValueState(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className={["space-y-3", className].join(" ")}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, {
          value: Array.isArray(currentValue) ? currentValue : [currentValue],
          onValueChange: handleChange,
        } as any)
      })}
    </div>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function AccordionItem({ value, children, className = "", disabled }: AccordionItemProps) {
  return (
    <div className={["border border-tea-100 rounded-xl overflow-hidden bg-white", disabled && "opacity-50", className].filter(Boolean).join(" ")}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, { itemValue: value, disabled } as any)
      })}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className = "" }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionTrigger must be used within AccordionItem")

  const { itemValue, open, onToggle, disabled } = context

  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle()}
      disabled={disabled}
      className={[
        "flex items-center justify-between w-full px-5 py-4 text-left text-tea-900 font-medium",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-tea-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:bg-tea-50 transition-colors",
      ].join(" ")}
      aria-expanded={true}
      aria-controls={`accordion-content-${value}`}
    >
      <span>{children}</span>
      <ChevronDown size={18} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className = "" }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionContent must be used within AccordionItem")

  const { open } = context

  return (
    <div
      hidden={!open}
      className={["overflow-hidden transition-all duration-300 ease-in-out", className].join(" ")}
    >
      <div className="px-5 pb-4 pt-0 text-tea-700">
        {children}
      </div>
    </div>
  )
}

const AccordionContext = React.createContext<{
  itemValue: string
  open: boolean
  onToggle: () => void
  disabled: boolean
} | null>(null)

export function AccordionItemProvider({ children, value, disabled }: { value: string; children: React.ReactNode; disabled?: boolean }) {
  const context = React.useContext(AccordionItemContext)
  if (!context) throw new Error("AccordionItemProvider must be used within Accordion")

  const { openItems, onToggle } = context
  const open = Array.isArray(openItems) ? openItems.includes(value) : openItems === value

  return (
    <AccordionContext.Provider value={{ itemValue: value, open, onToggle: () => context.onToggle(value), disabled }}>
      <AccordionItem value={value} disabled={disabled}>
        {children}
      </AccordionItem>
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = React.createContext<{
  openItems: string | string[]
  onToggle: (value: string) => void
} | null>(null)

function AccordionWithContext({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
  allowToggle = true,
}: AccordionProps) {
  const [valueState, setValueState] = React.useState<string | string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  )

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : valueState

  const handleToggle = (itemValue: string) => {
    let newValue: string | string[]
    if (type === 'single') {
      newValue = currentValue === itemValue && allowToggle ? '' : itemValue
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      if (currentArray.includes(itemValue)) {
        newValue = currentArray.filter(v => v !== itemValue)
      } else {
        newValue = [...currentArray, itemValue]
      }
    }
    if (!value) setValueState(newValue)
  }

  return (
    <AccordionItemContext.Provider value={{ openItems: currentValue, onToggle }}>
      <div className={["space-y-2", className].join(" ")}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child
          return React.cloneElement(child) // Context provides the values
        })}
      </div>
    </AccordionItemContext.Provider>
  )
}

// Simplified exports
export const AccordionRoot = ({ type = 'single', defaultValue, value, onValueChange, children, className = "", allowToggle = true }: AccordionProps) => {
  const [valueState, setValueState] = React.useState<string | string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  )

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : valueState

  const handleToggle = (itemValue: string) => {
    let newValue: string | string[]
    if (type === 'single') {
      newValue = currentValue === itemValue && allowToggle ? '' : itemValue
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      if (currentArray.includes(itemValue)) {
        newValue = currentArray.filter(v => v !== itemValue)
      } else {
        newValue = [...currentArray, itemValue]
      }
    }
    if (!value) setValueState(newValue)
    onValueChange?.(newValue)
  }

  return (
    <AccordionItemContext.Provider value={{ openItems: currentValue, onToggle }}>
      <div className={["space-y-2", className].join(" ")}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child
          return React.cloneElement(child)
        })}
      </div>
    </AccordionItemContext.Provider>
  )
}

export function AccordionItem({ value, children, className = "", disabled }: AccordionItemProps) {
  const context = React.useContext(AccordionItemContext)
  const open = Array.isArray(value) ? false : (context?.openItems === value || (Array.isArray(context?.openItems) && context.openItems.includes(value)))

  return (
    <AccordionContext.Provider value={{ itemValue: value, open, onToggle: () => context?.onToggle(value), disabled }}>
      <div className={["border border-tea-100 rounded-xl overflow-hidden bg-white", disabled && "opacity-50", className].filter(Boolean).join(" ")}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child
          return React.cloneElement(child)
        })}
      </div>
    </AccordionContext.Provider>
  )
}

const AccordionItemContextInner = React.createContext<{
  itemValue: string
  open: boolean
  onToggle: () => void
  disabled: boolean
} | null>(null)

export { AccordionItem, AccordionTrigger, AccordionContent }