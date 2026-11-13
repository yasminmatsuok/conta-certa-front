import { classNames } from './classNames'

type ProgressTone = 'brand' | 'warning' | 'danger'

interface ProgressBarProps {
  value: number
  max?: number
  /** Texto exibido acima da barra e usado por leitores de tela */
  label: string
  /** Esconde o texto visível (o label continua acessível) */
  hideLabel?: boolean
  tone?: ProgressTone
  className?: string
}

const tones: Record<ProgressTone, string> = {
  brand: 'bg-brand',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  hideLabel = false,
  tone = 'brand',
  className,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const rounded = Math.round(percent)

  return (
    <div className={className}>
      {!hideLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted">{label}</span>
          <span className="font-semibold">{rounded}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full overflow-hidden rounded-pill bg-surface-raised"
      >
        <div
          className={classNames('h-full rounded-pill transition-[width] duration-500', tones[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
