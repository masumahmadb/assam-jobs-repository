import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiChevronDown } from 'react-icons/fi'

const DropdownMenuContext = createContext(null)

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event) {
      const trigger = triggerRef.current
      const inContent = event.target.closest && event.target.closest('[data-dropdown-content]')
      if (trigger && !trigger.contains(event.target) && !inContent) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, className = "", asChild = false }) {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  const handleToggle = () => ctx.setOpen(!ctx.open)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: ctx.triggerRef,
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e)
        handleToggle()
      },
      'aria-haspopup': 'true',
      'aria-expanded': ctx.open,
    })
  }

  return (
    <button
      ref={ctx.triggerRef}
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-tea-700 dark:text-tea-200 bg-tea-50 dark:bg-tea-800 border border-tea-200 dark:border-tea-700 rounded-xl hover:bg-tea-100 dark:hover:bg-tea-700 focus:outline-none focus:ring-2 focus:ring-tea-500 transition-colors ${className}`}
      aria-haspopup="true"
      aria-expanded={ctx.open}
    >
      {children}
      <FiChevronDown size={14} className={`transition-transform ${ctx.open ? 'rotate-180' : ''}`} />
    </button>
  )
}

export function DropdownMenuContent({ children, align = 'start', className = "" }) {
  const ctx = useContext(DropdownMenuContext)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!ctx || !ctx.open) return

    const updatePosition = () => {
      const trigger = ctx.triggerRef.current
      const content = contentRef.current
      if (!trigger || !content) return

      const rect = trigger.getBoundingClientRect()
      content.style.top = `${rect.bottom + 6}px`
      if (align === 'end') {
        content.style.left = `${Math.max(8, rect.right - content.offsetWidth)}px`
      } else {
        content.style.left = `${rect.left}px`
      }
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [ctx, align])

  if (!ctx || !ctx.open) return null

  return createPortal(
    <div
      ref={contentRef}
      data-dropdown-content=""
      className={["fixed z-50 min-w-[10rem] rounded-xl border border-tea-100 dark:border-tea-700 bg-white dark:bg-tea-900 p-1 shadow-xl animate-scale-in", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>,
    document.body
  )
}

export function DropdownMenuItem({ children, onClick, className = "", disabled, inset }) {
  const ctx = useContext(DropdownMenuContext)

  return (
    <button
      type="button"
      onClick={(e) => {
        if (onClick) onClick(e)
        if (ctx) ctx.setOpen(false)
      }}
      disabled={disabled}
      className={[
        "flex w-full cursor-default select-none items-center rounded-xl px-3 py-2 text-left text-sm outline-none transition-colors",
        "focus:bg-tea-100 dark:focus:bg-tea-800 focus:text-tea-900 dark:focus:text-tea-100",
        disabled && "pointer-events-none opacity-50",
        inset && "pl-8",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  )
}

export function DropdownMenuCheckboxItem({ children, checked, onCheckedChange, className = "", disabled, inset }) {
  return (
    <label
      className={[
        "relative flex cursor-default select-none items-center rounded-xl py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "focus:bg-tea-100 dark:focus:bg-tea-800",
        disabled && "pointer-events-none opacity-50",
        inset && "pl-8",
        className,
      ].filter(Boolean).join(" ")}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-tea-300 text-tea-600 focus:ring-2 focus:ring-tea-500"
        />
      </span>
      <span className="pl-2">{children}</span>
    </label>
  )
}

export function DropdownMenuSeparator({ className = "" }) {
  return <div className={["-mx-1 my-1 h-px bg-tea-100 dark:bg-tea-800", className].filter(Boolean).join(" ")} />
}

export function DropdownMenuLabel({ children, className = "", inset }) {
  return (
    <div className={["px-2 py-1.5 text-sm font-semibold text-tea-600 dark:text-tea-300", inset && "pl-8", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  )
}
