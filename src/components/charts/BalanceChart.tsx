import type { BalancePoint } from '../../types/dashboard'
import { formatCurrency, formatDayMonth } from '../../utils/format'

interface BalanceChartProps {
  /** Saldo real, do começo do mês até hoje */
  history: BalancePoint[]
  /** Saldo previsto, de hoje até o fim do mês */
  forecast: BalancePoint[]
}

// Gráfico de linha desenhado à mão em SVG (sem biblioteca).
const WIDTH = 800
const HEIGHT = 220
const PADDING_X = 12
const PADDING_Y = 18
const GRID_LINES = 3

/** Converte "AAAA-MM-DD" em número de dias, para posicionar no eixo X */
function toDayNumber(isoDate: string): number {
  const [year = 0, month = 1, day = 1] = isoDate.split('-').map(Number)
  return Date.UTC(year, month - 1, day) / 86_400_000
}

export function BalanceChart({ history, forecast }: BalanceChartProps) {
  const first = history[0]
  const today = history[history.length - 1]

  if (!first || !today || history.length < 2) {
    return (
      <p className="rounded-control border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        Ainda não há movimentações suficientes para desenhar o gráfico deste mês.
      </p>
    )
  }

  const all = [...history, ...forecast]
  const last = all[all.length - 1] ?? today

  const days = all.map((point) => toDayNumber(point.date))
  const minDay = Math.min(...days)
  const dayRange = Math.max(...days) - minDay || 1

  const balances = all.map((point) => point.balance)
  const minBalance = Math.min(...balances)
  const balanceRange = Math.max(...balances) - minBalance || 1

  const x = (point: BalancePoint) =>
    PADDING_X + ((toDayNumber(point.date) - minDay) / dayRange) * (WIDTH - PADDING_X * 2)
  const y = (point: BalancePoint) =>
    HEIGHT - PADDING_Y - ((point.balance - minBalance) / balanceRange) * (HEIGHT - PADDING_Y * 2)

  const toPath = (points: BalancePoint[]) =>
    points.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point).toFixed(1)} ${y(point).toFixed(1)}`).join(' ')

  const historyPath = toPath(history)
  const areaPath = `${historyPath} L${x(today).toFixed(1)} ${HEIGHT} L${x(first).toFixed(1)} ${HEIGHT} Z`
  const forecastPath = forecast.length > 0 ? toPath([today, ...forecast]) : null

  const gridYs = Array.from(
    { length: GRID_LINES },
    (_, index) => PADDING_Y + (index * (HEIGHT - PADDING_Y * 2)) / (GRID_LINES - 1),
  )

  const todayPercent = (x(today) / WIDTH) * 100
  const description =
    `Saldo de ${formatCurrency(first.balance)} em ${formatDayMonth(first.date)} ` +
    `para ${formatCurrency(today.balance)} hoje` +
    (forecastPath ? `, com previsão de ${formatCurrency(last.balance)} em ${formatDayMonth(last.date)}.` : '.')

  return (
    <figure>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={description}>
        <defs>
          <linearGradient id="balance-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridYs.map((gridY) => (
          <line key={gridY} x1="0" x2={WIDTH} y1={gridY} y2={gridY} stroke="var(--color-border)" strokeWidth="1" />
        ))}

        <path d={areaPath} fill="url(#balance-area)" />
        <path
          d={historyPath}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px var(--color-brand))' }}
        />

        {forecastPath && (
          <>
            <path
              d={forecastPath}
              fill="none"
              stroke="var(--color-foreground)"
              strokeWidth="2.5"
              strokeDasharray="9 9"
              strokeLinecap="round"
            />
            <circle cx={x(last)} cy={y(last)} r="6" fill="var(--color-foreground)" />
          </>
        )}

        <circle
          cx={x(today)}
          cy={y(today)}
          r="7"
          fill="var(--color-brand)"
          style={{ filter: 'drop-shadow(0 0 6px var(--color-brand))' }}
        />
      </svg>

      {/* Rótulos do eixo X em HTML, para o texto não encolher junto com o SVG */}
      <figcaption className="relative mt-2 flex h-5 justify-between text-xs text-muted">
        <span>{formatDayMonth(first.date)}</span>
        {forecastPath ? (
          <>
            <span className="absolute -translate-x-1/2" style={{ left: `${todayPercent}%` }}>
              Hoje
            </span>
            <span>{formatDayMonth(last.date)}</span>
          </>
        ) : (
          <span>Hoje</span>
        )}
      </figcaption>
    </figure>
  )
}
