import { ArrowRight, Calculator, SlidersHorizontal, TriangleAlert } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getDebtStatusMeta } from '../components/debts/debtStatus'
import { PageHeader } from '../components/layout/PageHeader'
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, StatCard } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { PATHS } from '../routes/paths'
import { listDebts } from '../services/debtService'
import type { Debt } from '../types/debt'
import { formatCurrency, formatDayMonth, formatPercent } from '../utils/format'

function pluralDebts(count: number): string {
  return `${count} ${count === 1 ? 'dívida' : 'dívidas'}`
}

export function DebtsPage() {
  const load = useCallback((signal: AbortSignal) => listDebts(signal), [])
  const { state, reload } = useAsync(load)

  return (
    <>
      <PageHeader
        title="Minhas dívidas"
        description="Veja quanto você deve e quais dívidas estão caras."
        actions={
          // O protótipo ainda não tem a tela de cadastro de dívida
          <Button disabled title="Cadastro de dívida ainda não disponível">
            + Cadastrar dívida
          </Button>
        }
      />

      {state.status === 'loading' && <LoadingState label="Carregando dívidas..." />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
      {state.status === 'success' &&
        (state.data.length === 0 ? (
          <EmptyState
            title="Nenhuma dívida cadastrada"
            description="Quando você cadastrar uma dívida, ela aparece aqui com a taxa de juros comparada à média."
          />
        ) : (
          <DebtList debts={state.data} />
        ))}
    </>
  )
}

interface DebtListProps {
  debts: Debt[]
}

function DebtList({ debts }: DebtListProps) {
  const total = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const highInterest = debts.filter((debt) => debt.status === 'JUROS_ALTOS').length

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          variant="brand"
          label="Total devido"
          value={formatCurrency(total)}
          icon={<Calculator size={24} aria-hidden="true" />}
        />
        <StatCard
          variant="outline"
          label="Dívidas ativas"
          value={pluralDebts(debts.length)}
          icon={<SlidersHorizontal size={24} aria-hidden="true" />}
        />
        <StatCard
          variant="white"
          cardTone={highInterest > 0 ? 'white' : 'default'}
          label="Com juros acima da média"
          value={pluralDebts(highInterest)}
          icon={<TriangleAlert size={24} aria-hidden="true" />}
        />
      </div>

      <ul className="grid gap-5 lg:grid-cols-2">
        {debts.map((debt) => (
          <li key={debt.id}>
            <DebtCard debt={debt} />
          </li>
        ))}
      </ul>
    </div>
  )
}

interface DebtCardProps {
  debt: Debt
}

function DebtCard({ debt }: DebtCardProps) {
  const status = getDebtStatusMeta(debt.status)
  const installments =
    debt.installmentsPaid !== null && debt.installmentsTotal !== null
      ? `${debt.installmentsPaid} de ${debt.installmentsTotal}`
      : '—'

  return (
    <Card tone={debt.status === 'JUROS_ALTOS' ? 'white' : 'default'} className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{debt.name}</h2>
          <p className="text-sm text-muted">{debt.type}</p>
        </div>
        <Badge tone={status.badgeTone}>{status.label}</Badge>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight">{formatCurrency(debt.balance)}</p>

      <dl className="mt-4 space-y-3 border-t border-border pt-4">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Taxa de juros</dt>
          <dd className="font-bold">{formatPercent(debt.monthlyRate)} a.m.</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Parcelas</dt>
          <dd className="font-bold">{installments}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Próximo vencimento</dt>
          <dd className="font-bold">{formatDayMonth(debt.nextDueDate)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-end">
        <Link
          to={PATHS.debtDetail(debt.id)}
          aria-label={`Ver detalhes de ${debt.name}`}
          className="inline-flex items-center gap-2 font-bold text-brand hover:underline"
        >
          Ver detalhes
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}
