import { Calendar, ChevronDown } from 'lucide-react'
import { useMemo } from 'react'
import { capitalize, formatMonthLong, listRecentMonths } from '../../utils/format'

interface MonthSelectProps {
  /** Mês escolhido, em "AAAA-MM" */
  value: string
  onChange: (month: string) => void
}

/** Seletor de mês ("Novembro de 2026") com os últimos 12 meses */
export function MonthSelect({ value, onChange }: MonthSelectProps) {
  const months = useMemo(() => {
    const recent = listRecentMonths(12)
    return recent.includes(value) ? recent : [value, ...recent]
  }, [value])

  return (
    <div className="relative">
      <Calendar
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <select
        aria-label="Mês"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 cursor-pointer appearance-none rounded-control border border-border-strong bg-surface-raised pl-11 pr-10 font-medium focus:border-brand focus:outline-none"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {capitalize(formatMonthLong(month))}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  )
}
