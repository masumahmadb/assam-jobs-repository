import React, { createContext, useContext, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const AccordionRootContext = createContext(null)
const AccordionItemContext = createContext(null)

export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
  allowToggle = true,
}) {
  const [valueState, setValueState] = useState(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  )

  const isControlled = value !== undefined
  const controlledItems = Array.isArray(value) ? value : value ? [value] : []
  const openItems = isControlled ? controlledItems : valueState

  const toggleItem = (itemValue) => {
    let newItems
    if (type === 'single') {
      newItems = openItems.includes(itemValue) && allowToggle ? [] : [itemValue]
    } else {
      newItems = openItems.includes(itemValue)
        ? openItems.filter(v => v !== itemValue)
        : [...openItems, itemValue]
    }
    if (!isControlled) setValueState(newItems)
    if (onValueChange) onValueChange(type === 'single' ? (newItems[0] || '') : newItems)
  }

  return (
    <AccordionRootContext.Provider value={{ openItems, toggleItem }}>
      <div className={["space-y-3", className].join(" ")}>
        {children}
      </div>
    </AccordionRootContext.Provider>
  )
}

export function AccordionItem({ value, children, className = '', disabled }) {
  const root = useContext(AccordionRootContext)
  if (!root) throw new Error("AccordionItem must be used within Accordion")

  const open = root.openItems.includes(value)

  return (
    <AccordionItemContext.Provider value={{ itemValue: value, open, disabled, toggle: () => !disabled && root.toggleItem(value) }}>
      <div className={["border border-tea-100 dark:border-tea-800 rounded-xl overflow-hidden bg-white dark:bg-tea-900", disabled && "opacity-50", className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export function AccordionTrigger({ children, className = '' }) {
  const item = useContext(AccordionItemContext)
  if (!item) throw new Error("AccordionTrigger must be used within AccordionItem")

  return (
    <button
      type="button"
      onClick={item.toggle}
      disabled={item.disabled}
      className={[
        "flex items-center justify-between w-full px-5 py-4 text-left text-tea-900 dark:text-tea-100 font-medium",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-tea-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:bg-tea-50 dark:hover:bg-tea-800/50 transition-colors",
        className,
      ].join(" ")}
      aria-expanded={item.open}
    >
      <span>{children}</span>
      <FiChevronDown size={18} className={`transition-transform duration-200 ${item.open ? 'rotate-180' : ''}`} />
    </button>
  )
}

export function AccordionContent({ children, className = '' }) {
  const item = useContext(AccordionItemContext)
  if (!item) throw new Error("AccordionContent must be used within AccordionItem")

  return (
    <div
      hidden={!item.open}
      className={["overflow-hidden transition-all duration-300 ease-in-out", className].join(" ")}
    >
      <div className="px-5 pb-4 pt-0 text-tea-700 dark:text-tea-300">
        {children}
      </div>
    </div>
  )
}
