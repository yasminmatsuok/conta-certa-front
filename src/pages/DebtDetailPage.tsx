import { Info, RefreshCw, Star, Target, TriangleAlert } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, Card, ErrorState, FormMessage, LoadingState, ProgressBar } from '../components/ui'
import { buttonClasses } from '../components/ui/buttonStyles'
import { useAsync } from '../hooks/useAsync'
import { PATHS } from '../routes/paths'
import { getErrorMessage } from '../services/api'
import { deleteDebt, getDebt } from '../services/debtService'
import type { DebtDetail, DebtEventType } from '../types/debt'
import { formatCurrency, formatDayMonth, formatPercent } from '../utils/format'

const EVENT_LABELS: Record<DebtEventType, string> = {
  PAGAMENTO: 'Pagamento',
  CADASTRO: 'Cadastro da dívida',
}

export function DebtDetailPage() {
  // Rota com parâmetro: /app/dividas/:id
  const { id = '' } = useParams<{ id: string }>()
  const load = useCallback((signal: AbortSignal) => getDebt(id, signal), [id])
  const { state, reload } = useAsync(load)

  if (state.status === 'loading') {
    return <LoadingState label="Carregando dívida..." />
  }

  if (state.status === 'error') {
    return (
      <>
        <PageHeader eyebrow={<Link to={PATHS.debts}>‹ Dívidas</Link>} title="Dívida" />
        <ErrorState message={state.message} onRetry={reload} />
      </>
    )
  }

  return <DebtDetailContent debt={state.data} />
}

interface DebtDetailContentProps {
  debt: DebtDetail
}

function DebtDetailContent({ debt }: DebtDetailContentProps) {
  const navigate = useNavigate()
  const location = useLocation()
  // "Dívida cadastrada!" / "Dívida atualizada!", enviado pelo formulário ao navegar para cá
  const navigationState: unknown = location.state
  const flash =
    typeof navigationState === 'object' &&
    navigationState !== null &&
    'flash' in navigationState &&
    typeof navigationState.flash === 'string'
      ? navigationState.flash
      : null
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const isAboveMarket = debt.monthlyRate > debt.marketRate
  // A barra mais longa ocupa 92% da largura, como no protótipo
  const scale = Math.max(debt.monthlyRate, debt.marketRate) / 0.92
  const extraPercent =
    debt.marketRate > 0 ? Math.round((debt.monthlyRate / debt.marketRate - 1) * 100) : 0

  async function handleDelete() {
    if (!window.confirm(`Excluir a dívida "${debt.name}"? Isso não pode ser desfeito.`)) return

    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteDebt(debt.id)
      navigate(PATHS.debts)
    } catch (error) {
      setDeleteError(`Não foi possível excluir. ${getErrorMessage(error)}`)
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={
          <nav aria-label="Caminho">
            <Link to={PATHS.debts} className="hover:text-foreground">
              Dívidas
            </Link>
            {' › '}
            <span className="font-bold text-foreground">{debt.name}</span>
          </nav>
        }
        title={debt.name}
        description={debt.type}
        actions={
          <Link to={PATHS.debtEdit(debt.id)} className={buttonClasses({ variant: 'neutral', size: 'sm' })}>
            Editar
          </Link>
        }
      />

      {/* Aviso vindo do formulário de cadastro ou edição */}
      {flash && (
        <FormMessage kind="success" className="mb-5">
          {flash}
        </FormMessage>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <dl className="grid grid-cols-2 gap-5 md:grid-cols-4">
              <SummaryItem label="Valor devido" value={formatCurrency(debt.balance)} />
              <SummaryItem label="Pagamento mínimo" value={formatCurrency(debt.minimumPayment)} />
              <SummaryItem label="Vencimento" value={formatDayMonth(debt.nextDueDate)} />
              <SummaryItem label="Credor" value={debt.creditor} />
            </dl>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              Comparação da taxa de juros
              <Info size={18} className="text-brand" aria-hidden="true" />
            </h2>
            <p className="mt-1 text-sm text-muted">
              Taxa ao mês. A média vem dos dados do Banco Central para esse tipo de crédito.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-lg">Sua taxa</span>
                  <span className="text-2xl font-bold">{formatPercent(debt.monthlyRate)}</span>
                </div>
                <ProgressBar tone="white" label="Sua taxa de juros" value={debt.monthlyRate} max={scale} />
              </div>
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-lg">Média do mercado</span>
                  <span className="text-2xl font-bold text-brand">{formatPercent(debt.marketRate)}</span>
                </div>
                <ProgressBar label="Taxa média do mercado" value={debt.marketRate} max={scale} />
              </div>
            </div>

            <p className="mt-4 text-sm text-muted">
              {isAboveMarket ? (
                <>
                  Você paga <strong className="text-foreground">{extraPercent}% a mais</strong> de juros
                  que a média.
                </>
              ) : (
                'Sua taxa está dentro da média do mercado.'
              )}
            </p>
          </Card>

          {isAboveMarket && (
            <Card tone="white" className="flex items-center gap-4">
              <TriangleAlert size={32} className="shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-bold">Essa taxa parece alta</h2>
                <p className="text-sm">
                  Confira no contrato. Renegociar ou trocar por um empréstimo mais barato pode reduzir
                  o que você paga.
                </p>
              </div>
            </Card>
          )}
        </div>

        <Card className="space-y-4">
          <h2 className="text-xl font-bold">O que fazer agora</h2>

          <Link to={PATHS.plan} className={buttonClasses({ variant: 'primary', size: 'lg', fullWidth: true })}>
            <Target size={20} aria-hidden="true" />
            Ver meu plano
          </Link>
          <Link to={PATHS.learn} className={buttonClasses({ variant: 'outline', size: 'lg', fullWidth: true })}>
            <RefreshCw size={20} aria-hidden="true" />
            Como renegociar
          </Link>
          {debt.relatedTrack && (
            <Link
              to={`${PATHS.learn}?trilha=${debt.relatedTrack.id}`}
              className={buttonClasses({ variant: 'outline', size: 'lg', fullWidth: true, className: 'h-auto min-h-14 py-2 text-center' })}
            >
              <Star size={20} className="shrink-0" aria-hidden="true" />
              Trilha: {debt.relatedTrack.title}
            </Link>
          )}

          <div className="border-t border-border pt-5">
            <h3 className="mb-2 text-lg font-bold">Histórico</h3>
            {debt.history.length === 0 ? (
              <p className="py-4 text-sm text-muted">Nenhum registro ainda.</p>
            ) : (
              <ul>
                {debt.history.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-muted">
                      {formatDayMonth(event.date)} · {EVENT_LABELS[event.type] ?? event.type}
                    </span>
                    <span className="font-bold">{formatCurrency(event.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {deleteError && <FormMessage kind="error">{deleteError}</FormMessage>}

          <Button variant="neutral" size="lg" fullWidth disabled={deleting} onClick={handleDelete}>
            {deleting ? 'Excluindo...' : 'Excluir dívida'}
          </Button>
        </Card>
      </div>
    </>
  )
}

interface SummaryItemProps {
  label: string
  value: string
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-2xl font-bold tracking-tight">{value}</dd>
    </div>
  )
}
