import { ArrowDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { getCategoryMeta } from '../components/transactions/categoryMeta'
import { Card, EmptyState, ErrorState, LoadingState, MonthSelect } from '../components/ui'
import { classNames } from '../components/ui/classNames'
import { useAsync } from '../hooks/useAsync'
import { listTransactions } from '../services/transactionService'
import type { Transaction, TransactionType } from '../types/transaction'
import { currentMonth, formatCurrency, formatDayMonth, formatMonthLong, todayIso } from '../utils/format'

type Filter = 'TODAS' | TransactionType

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'TODAS', label: 'Todas' },
  { value: 'ENTRADA', label: 'Entradas' },
  { value: 'SAIDA', label: 'Saídas' },
]

export function TransactionsPage() {
  const [searchParams] = useSearchParams()
  // /app/transacoes?tipo=entrada abre o formulário já em "Entrou"
  const initialType: TransactionType = searchParams.get('tipo') === 'entrada' ? 'ENTRADA' : 'SAIDA'

  const [month, setMonth] = useState(currentMonth)
  const [filter, setFilter] = useState<Filter>('TODAS')
  const load = useCallback((signal: AbortSignal) => listTransactions(month, signal), [month])
  const { state, reload, setData } = useAsync(load)

  function handleCreated(created: Transaction) {
    // Só entra na lista se for do mês que está na tela
    if (state.status === 'success' && created.date.startsWith(month)) {
      setData([...state.data, created])
    }
  }

  const monthName = formatMonthLong(month).split(' ')[0]

  return (
    <>
      <PageHeader
        title="Transações"
        description={`Tudo o que entrou e saiu em ${monthName}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Filtrar transações" className="flex gap-2">
              {FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                  className={classNames(
                    'h-12 cursor-pointer rounded-control px-4 font-bold transition',
                    filter === option.value
                      ? 'bg-linear-to-b from-brand-light to-brand-dark text-on-brand shadow-glow'
                      : 'border border-border-strong bg-surface-raised hover:border-foreground',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <MonthSelect value={month} onChange={setMonth} />
          </div>
        }
      />

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {state.status === 'loading' && <LoadingState label="Carregando transações..." />}
          {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
          {state.status === 'success' && (
            <TransactionList transactions={state.data} filter={filter} monthName={monthName ?? ''} />
          )}
        </div>

        <TransactionForm key={initialType} initialType={initialType} onCreated={handleCreated} />
      </div>
    </>
  )
}

interface TransactionListProps {
  transactions: Transaction[]
  filter: Filter
  monthName: string
}

function TransactionList({ transactions, filter, monthName }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title={`Nenhuma transação em ${monthName}`}
        description='Use o formulário "Nova transação" para registrar a primeira.'
      />
    )
  }

  const visible = filter === 'TODAS' ? transactions : transactions.filter((item) => item.type === filter)

  if (visible.length === 0) {
    return (
      <EmptyState
        title={filter === 'ENTRADA' ? 'Nenhuma entrada neste mês' : 'Nenhuma saída neste mês'}
        description="Mude o filtro para ver as outras transações."
      />
    )
  }

  // Agrupa por dia, do mais recente para o mais antigo
  const groups = new Map<string, Transaction[]>()
  for (const item of [...visible].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)) {
    groups.set(item.date, [...(groups.get(item.date) ?? []), item])
  }
  const today = todayIso()

  return (
    <Card>
      {[...groups.entries()].map(([date, items]) => (
        <section key={date} className="border-b border-border pb-2 last:border-b-0 last:pb-0 [&+section]:pt-5">
          <h2 className="mb-2 text-sm font-bold tracking-wide text-muted">
            {date === today ? `HOJE · ${formatDayMonth(date)}` : formatDayMonth(date)}
          </h2>
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <TransactionRow key={item.id} transaction={item} />
            ))}
          </ul>
        </section>
      ))}
    </Card>
  )
}

interface TransactionRowProps {
  transaction: Transaction
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const { label, icon: CategoryIcon } = getCategoryMeta(transaction.category)
  const isIncome = transaction.type === 'ENTRADA'
  const Icon = isIncome ? ArrowDown : CategoryIcon

  return (
    <li className="flex items-center gap-4 py-3">
      <span
        className={classNames(
          'grid size-11 shrink-0 place-items-center rounded-control border',
          isIncome ? 'border-brand bg-brand-muted text-brand' : 'border-border-strong bg-surface-raised',
        )}
      >
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate">{transaction.description}</span>
        <span className="block text-sm text-muted">{label}</span>
      </span>
      <span className={classNames('shrink-0 font-bold', isIncome && 'text-brand')}>
        {isIncome ? '+ ' : '– '}
        {formatCurrency(transaction.amount)}
      </span>
    </li>
  )
}
