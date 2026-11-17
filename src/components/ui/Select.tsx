import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import { classNames } from './classNames'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  error?: string
  /** As <option> da lista */
  children: ReactNode
}

/** Lista de opções com rótulo, no mesmo visual do <Input> */
export function Select({ label, hint, error, id, className, children, ...rest }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const messageId = `${selectId}-message`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={selectId} className="mb-2 block text-sm">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={classNames(
            'h-13 w-full cursor-pointer appearance-none rounded-control border bg-surface-raised pl-4 pr-10 text-foreground',
            'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-danger' : 'border-border-strong focus:border-brand',
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          aria-hidden="true"
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
