import type { HTMLAttributes } from 'react'
import { classNames } from './classNames'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'
/** default = borda cinza, brand = borda verde com brilho, white = borda branca (alertas) */
export type CardTone = 'default' | 'brand' | 'white'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
  tone?: CardTone
}

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

const tones: Record<CardTone, string> = {
  default: 'border-border',
  brand: 'border-brand shadow-glow-soft',
  white: 'border-foreground',
}

export function Card({ padding = 'md', tone = 'default', className, children, ...rest }: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-card border bg-linear-to-b from-surface-raised to-surface',
        tones[tone],
        paddings[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
