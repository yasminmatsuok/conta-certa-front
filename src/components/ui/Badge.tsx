import type { ReactNode } from 'react'
import { classNames } from './classNames'

type BadgeTone = 'brand' | 'neutral' | 'warning' | 'danger'

interface BadgeProps {
  tone?: BadgeTone
  icon?: ReactNode
  className?: string
  children: ReactNode
}

const tones: Record<BadgeTone, string> = {
  brand: 'bg-brand-muted text-brand',
  neutral: 'bg-surface-raised text-muted',
  warning: 'bg-warning-muted text-warning',
  danger: 'bg-danger-muted text-danger',
}

export function Badge({ tone = 'brand', icon, className, children }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
