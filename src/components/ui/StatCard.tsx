import type { ReactNode } from 'react'
import { Card } from './Card'
import { classNames } from './classNames'

type StatTone = 'default' | 'brand' | 'danger'

interface StatCardProps {
  label: string
  /** Valor já formatado, ex.: "R$ 1.250,00" */
  value: string
  icon?: ReactNode
  /** Texto de apoio abaixo do valor, ex.: "+12% em relação a outubro" */
  helper?: ReactNode
  tone?: StatTone
  className?: string
}

const valueTones: Record<StatTone, string> = {
  default: 'text-foreground',
  brand: 'text-brand',
  danger: 'text-danger',
}

export function StatCard({ label, value, icon, helper, tone = 'default', className }: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        {icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-control bg-brand-muted text-brand">
            {icon}
          </span>
        )}
      </div>
      <p className={classNames('mt-3 text-2xl font-bold tracking-tight sm:text-3xl', valueTones[tone])}>
        {value}
      </p>
      {helper && <div className="mt-2 text-xs text-muted">{helper}</div>}
    </Card>
  )
}
