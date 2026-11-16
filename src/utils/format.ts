/**
 * Formatação de valores para exibição.
 * Convenção com a API: datas em "AAAA-MM-DD", meses em "AAAA-MM", valores e taxas como número.
 */

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 312.4 -> "R$ 312,40" */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** 14.5 -> "14,5%" */
export function formatPercent(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

/** "2026-11-16" -> "16/11" */
export function formatDayMonth(isoDate: string): string {
  const [, month = '', day = ''] = isoDate.split('-')
  return `${day.slice(0, 2)}/${month}`
}

function monthToDate(isoMonth: string): Date {
  const [year, month] = isoMonth.split('-').map(Number)
  return new Date(year ?? 0, (month ?? 1) - 1, 1)
}

/** "2028-03" ou "2028-03-10" -> "março de 2028" */
export function formatMonthLong(isoMonth: string): string {
  return monthToDate(isoMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

/** "2028-03" ou "2028-03-10" -> "mar/2028" */
export function formatMonthShort(isoMonth: string): string {
  const date = monthToDate(isoMonth)
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  return `${month}/${date.getFullYear()}`
}

/** "2026-11-16" -> "NOV" */
export function formatMonthAbbrev(isoDate: string): string {
  return monthToDate(isoDate)
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .toUpperCase()
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** Data de hoje no fuso do usuário, em "AAAA-MM-DD" */
export function todayIso(): string {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Mês atual em "AAAA-MM" */
export function currentMonth(): string {
  return todayIso().slice(0, 7)
}

/** Os últimos `count` meses, do mais recente para o mais antigo, em "AAAA-MM" */
export function listRecentMonths(count: number): string[] {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
  })
}

/** Lê o que a pessoa digitou num campo de dinheiro: "1.250,90" ou "86.9" -> número; inválido -> null */
export function parseMoney(text: string): number | null {
  const cleaned = text.replace(/R\$/gi, '').replace(/\s/g, '')
  if (cleaned === '') return null
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null
  return Number(normalized)
}
