import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { classNames } from './classNames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
  /** Elemento à direita, ex.: botão de mostrar a senha */
  rightSlot?: ReactNode
}

export function Input({
  label,
  hint,
  error,
  leftIcon,
  rightSlot,
  id,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-2 block text-sm">
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-foreground">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={classNames(
            'h-13 w-full rounded-control border bg-surface-raised px-4 text-foreground transition-colors',
            'placeholder:text-subtle focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            leftIcon ? 'pl-12' : undefined,
            rightSlot ? 'pr-12' : undefined,
            error ? 'border-danger' : 'border-border-strong focus:border-brand',
          )}
          {...rest}
        />
        {rightSlot && (
          <span className="absolute inset-y-0 right-3 flex items-center text-muted">{rightSlot}</span>
        )}
      </div>
      {message && (
        <p id={messageId} className={classNames('mt-2 text-xs', error ? 'text-danger' : 'text-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}
