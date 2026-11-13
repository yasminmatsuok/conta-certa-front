import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { classNames } from './classNames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
}

export function Input({ label, hint, error, leftIcon, id, className, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-subtle">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={classNames(
            'h-12 w-full rounded-control border bg-surface px-4 text-foreground transition-colors',
            'placeholder:text-subtle focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            leftIcon ? 'pl-11' : undefined,
            error ? 'border-danger focus:border-danger' : 'border-border focus:border-brand',
          )}
          {...rest}
        />
      </div>
      {message && (
        <p id={messageId} className={classNames('mt-2 text-xs', error ? 'text-danger' : 'text-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}
