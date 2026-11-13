import type { ReactNode } from 'react'
import { classNames } from './classNames'

/** brand = "Em dia", white = "Juros altos", outline = "Atenção" */
type BadgeTone = 'brand' | 'white' | 'outline'

interface BadgeProps {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}

const tones: Record<BadgeTone, string> = {
  brand: 'border-brand bg-brand text-on-brand',
  white: 'border-foreground bg-foreground text-background',
  outline: 'border-foreground bg-transparent text-foreground',
}

export function Badge({ tone = 'brand', className, children }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-badge border px-2 py-0.5 text-xs font-bold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
