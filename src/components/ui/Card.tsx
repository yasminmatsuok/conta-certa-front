import type { HTMLAttributes } from 'react'
import { classNames } from './classNames'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
  /** Borda verde para destacar o cartão principal da tela */
  highlighted?: boolean
}

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

export function Card({
  padding = 'md',
  highlighted = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-card border bg-surface',
        highlighted ? 'border-brand/60 shadow-glow' : 'border-border',
        paddings[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
