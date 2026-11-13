import { classNames } from './classNames'

type ProgressTone = 'brand' | 'white'
type ProgressSize = 'sm' | 'md'

interface ProgressBarProps {
  value: number
  max?: number
  /** Descrição da barra para leitores de tela, ex.: "Progresso do plano" */
  label: string
  tone?: ProgressTone
  size?: ProgressSize
  className?: string
}

const tones: Record<ProgressTone, string> = {
  brand: 'bg-brand',
  white: 'bg-foreground',
}

const sizes: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
}

/** Só a barra: títulos e valores ficam por conta de quem usa, como no protótipo */
export function ProgressBar({
  value,
  max = 100,
  label,
  tone = 'brand',
  size = 'md',
  className,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={classNames(
        'w-full overflow-hidden rounded-pill bg-surface-raised',
        sizes[size],
        className,
      )}
    >
      <div
        className={classNames('h-full rounded-pill transition-[width] duration-500', tones[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
