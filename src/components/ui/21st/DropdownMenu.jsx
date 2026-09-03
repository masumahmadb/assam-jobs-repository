"use client"

import React, { useRef, useEffect, useState } from 'react'
import { ChevronDown, Check, ChevronRight } from 'react-icons/fi'
import { createPortal } from 'react-dom'

export interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <>{children}</>
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function DropdownMenuTrigger({
  children,
  className = "",
  asChild = false,
}: DropdownMenuTriggerProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
          contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const Content = ({ children }: { children: React.ReactNode }) => {
    if (!open) return null

    return createPortal(
      <div
        ref={contentRef}
        className="fixed z-50 min-w-[12rem] overflow-hidden rounded-xl border border-tea-100 bg-white p-1 shadow-lg"
        style={{
          // Position will be set by the trigger
        }}
        ref={contentRef}
      >
        <div className="p-1">{children}</div>
      </div>,
      document.body
    )
  }

  const Trigger = asChild ? (
    <>{children}</>
  ) : (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-tea-700 bg-tea-50 border border-tea-200 rounded-xl hover:bg-tea-100 focus:outline-none focus:ring-2 focus:ring-tea-500 transition-colors ${className}`}
      aria-haspopup="true"
      aria-expanded={open}
    >
      {children}
      <ChevronDown size={14} className={open ? 'rotate-180' : ''} />
    </button>
  )

  return (
    <div className="relative inline-block">
      {Trigger}
      <DropdownMenuContentRef open={open} contentRef={contentRef} triggerRef={triggerRef}>
        {children}
      </DropdownMenuContentRef>
    </div>
  )
}

function DropdownMenuContentRef({ open, children, contentRef, triggerRef }: { open: boolean; children: React.ReactNode; contentRef: React.RefObject<HTMLDivElement>; triggerRef: React.RefObject<HTMLButtonElement> }) {
  if (!open) return null

  const contentRefInternal = useRef<HTMLDivElement>(null)
  const ref = contentRef || contentRefInternal

  useEffect(() => {
    if (!open || !triggerRef.current || !ref.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const updatePosition = () => {
      if (!ref.current) return
      const triggerRect = triggerRef.current?.getBoundingClientRect()
      if (!triggerRect) return
      
      ref.current.style.top = `${triggerRect.bottom + 8}px`
      ref.current.style.left = `${triggerRect.left}px`
      ref.current.style.width = `${Math.max(triggerRect.width, 200)}px`
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, triggerRef, ref])

  if (!open) return null

  return createPortal(
    <div
      ref={ref}
      className="fixed z-50 min-w-[12rem] overflow-hidden rounded-xl border border-tea-100 bg-white p-1 shadow-xl"
    >
      <div className="p-1">{children}</div>
    </div>,
    document.body
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  inset?: boolean
}

export function DropdownMenuItem({ children, onClick, className = "", disabled, inset }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors",
        "focus:bg-tea-100 focus:text-tea-900",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      ].filter(Boolean).join(" "))
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
  inset?: boolean
}

export function DropdownMenuCheckboxItem({ children, checked, onCheckedChange, className = "", disabled, inset }: DropdownMenuCheckboxItemProps) {
  return (
    <label className={["relative flex cursor-default select-none items-center rounded-xl py-1.5 pl-8 pr-2 text-sm outline-none transition-colors", "focus:bg-tea-100", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className].filter(Boolean).join(" ")}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-tea-300 text-tea-600 focus:ring-2 focus:ring-tea-500"
        />
      </span>
      <span className="pl-2">{children}</span>
    </label>
  )
}

interface DropdownMenuSeparatorProps {
  className?: string
}

export function DropdownMenuSeparator({ className = "" }: DropdownMenuSeparatorProps) {
  return <div className={["-mx-1 my-1 h-px bg-tea-100", className].filter(Boolean).join(" ")} />
}

interface DropdownMenuLabelProps {
  children: React.ReactNode
  className?: string
  inset?: boolean
}

export function DropdownMenuLabel({ children, className = "", inset }: DropdownMenuLabelProps) {
  return <div className={["px-2 py-1.5 text-sm font-semibold text-tea-600", inset && "pl-8", className].filter(Boolean).join(" ")}>{children}</div>
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel }