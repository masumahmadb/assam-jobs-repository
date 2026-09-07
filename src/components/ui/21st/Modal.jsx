import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, closeOnEscape, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className={[
          "relative w-full bg-white dark:bg-tea-900 rounded-2xl shadow-xl overflow-hidden",
          "animate-scale-in",
          "max-h-[90vh] overflow-y-auto",
          sizeClasses[size],
        ].join(' ')}
        role="document"
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 border-b border-tea-100 dark:border-tea-800">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-tea-900 dark:text-tea-100">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-tea-600 dark:text-tea-400">
                  {description}
                </p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-tea-400 hover:text-tea-600 dark:hover:text-tea-300 hover:bg-tea-100 dark:hover:bg-tea-800 transition-colors"
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
