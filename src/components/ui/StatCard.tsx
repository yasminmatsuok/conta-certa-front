import type { ReactNode } from 'react'
import { Card } from './Card'
import { classNames } from './classNames'

/**
 * brand   = cartão em destaque: borda verde, ícone em círculo verde e valor verde
 * outline = ícone verde em círculo com contorno
 * white   = ícone em círculo branco
 */
type StatVariant = 'brand' | 'outline' | 'white'

interface StatCardProps {
  label: string
  /** Valor já formatado, ex.: "R$ 312,40" */
  value: string
  icon: ReactNode
  variant?: StatVariant
  className?: string
}

const iconStyles: Record<StatVariant, string> = {
  brand: 'bg-linear-to-b from-brand-light to-brand-dark text-on-brand shadow-glow',
  outline: 'border-2 border-brand text-brand',
  white: 'bg-foreground text-background',
}

export function StatCard({ label, value, icon, variant = 'outline', className }: StatCardProps) {
  return (
    <Card tone={variant === 'brand' ? 'brand' : 'default'} className={className}>
      <div className="flex items-center gap-4">
        <span
          className={classNames(
            'grid size-13 shrink-0 place-items-center rounded-pill',
            iconStyles[variant],
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted">{label}</p>
          <p
            className={classNames(
              'mt-1 text-2xl font-bold tracking-tight',
              variant === 'brand' ? 'text-brand' : 'text-foreground',
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  )
}
