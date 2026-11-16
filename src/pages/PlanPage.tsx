import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FormMessage,
  Input,
  LoadingState,
  ProgressBar,
} from '../components/ui'
import { buttonClasses } from '../components/ui/buttonStyles'
import { classNames } from '../components/ui/classNames'
import { useAsync } from '../hooks/useAsync'
import { PATHS } from '../routes/paths'
import { getErrorMessage } from '../services/api'
import { getPlan, updatePlan } from '../services/planService'
import type { Plan, PlanMethod } from '../types/plan'
import { formatCurrency, formatMonthLong, formatMonthShort, formatPercent, parseMoney } from '../utils/format'

const METHOD_TEXT: Record<PlanMethod, { title: string; description: string }> = {
  AVALANCHE: {
    title: 'Avalanche',
    description: 'Paga primeiro a dívida com juro mais alto. Economiza mais.',
  },
  BOLA_DE_NEVE: {
    title: 'Bola de neve',
    description: 'Paga primeiro a menor dívida. Motiva mais.',
  },
}

export function PlanPage() {
  const load = useCallback((signal: AbortSignal) => getPlan(signal), [])
  const { state, reload, setData } = useAsync(load)

  return (
    <>
      <PageHeader title="Meu plano" description="O caminho para sair das dívidas." />

      {state.status === 'loading' && <LoadingState label="Carregando seu plano..." />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
      {state.status === 'success' &&
        (state.data.order.length === 0 ? (
          <EmptyState
            title="Você ainda não tem um plano"
            description="O plano é montado a partir das suas dívidas. Cadastre uma dívida para começar."
            action={
              <Link to={PATHS.debts} className={buttonClasses({ size: 'sm' })}>
                Ver minhas dívidas
              </Link>
            }
          />
        ) : (
          <div className="grid items-start gap-5 xl:grid-cols-3">
            <PlanOverview plan={state.data} />
            <PlanForm plan={state.data} onSaved={setData} />
          </div>
        ))}
    </>
  )
}

interface PlanOverviewProps {
  plan: Plan
}

function PlanOverview({ plan }: PlanOverviewProps) {
  return (
    <div className="space-y-5 xl:col-span-2">
      <Card tone="brand" className="grid items-center gap-5 md:grid-cols-[auto_1fr] md:gap-10">
        <div>
          <p className="text-sm text-muted">Você fica livre das dívidas em</p>
          <p className="text-4xl font-bold tracking-tight text-brand">
            {formatMonthLong(plan.debtFreeDate)}
          </p>
        </div>
        <div>
          <div className="mb-2 flex justify-between">
            <span>Progresso</span>
            <span className="font-bold">{formatPercent(plan.progressPercent)}</span>
          </div>
          <ProgressBar label="Progresso do plano" value={plan.progressPercent} />
          <p className="mt-2 text-sm text-muted">
            {formatCurrency(plan.paidAmount)} pagos de {formatCurrency(plan.totalAmount)}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Ordem de pagamento</h2>
        <p className="mt-1 text-sm text-muted">
          Pague o mínimo em todas e o resto na dívida da vez.
        </p>

        <ol className="mt-3 divide-y divide-border">
          {[...plan.order]
            .sort((a, b) => a.position - b.position)
            .map((step, index) => (
              <li key={step.debtId} className="flex items-center gap-4 py-4">
                <span
                  className={classNames(
                    'grid size-9 shrink-0 place-items-center rounded-pill text-sm font-bold',
                    index === 0
                      ? 'bg-linear-to-b from-brand-light to-brand-dark text-on-brand shadow-glow'
                      : 'border border-border-strong text-muted',
                  )}
                >
                  {step.position}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
                    <Link to={PATHS.debtDetail(step.debtId)} className="font-bold hover:underline">
                      {step.debtName}
                    </Link>
                    <span className="text-sm text-muted">até {formatMonthShort(step.payoffDate)}</span>
                  </div>
                  <ProgressBar
                    size="sm"
                    label={`Quanto de ${step.debtName} já foi pago`}
                    value={step.progressPercent}
                  />
                </div>
                <span className="w-28 shrink-0 text-right font-bold">{formatCurrency(step.balance)}</span>
              </li>
            ))}
        </ol>
      </Card>
    </div>
  )
}

interface PlanFormProps {
  plan: Plan
  /** Recebe o plano recalculado pela API */
  onSaved: (plan: Plan) => void
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success' }
  | { status: 'error'; message: string }

function PlanForm({ plan, onSaved }: PlanFormProps) {
  const [budgetText, setBudgetText] = useState(() =>
    plan.monthlyBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2, useGrouping: false }),
  )
  const [method, setMethod] = useState<PlanMethod>(plan.method)
  const [budgetError, setBudgetError] = useState<string | undefined>()
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const monthlyBudget = parseMoney(budgetText)
    if (monthlyBudget === null || monthlyBudget <= 0) {
      setBudgetError('Informe um valor maior que zero, ex.: 400,00.')
      setSubmit({ status: 'idle' })
      return
    }
    setBudgetError(undefined)

    setSubmit({ status: 'saving' })
    try {
      onSaved(await updatePlan({ monthlyBudget, method }))
      setSubmit({ status: 'success' })
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <h2 className="text-xl font-bold">Ajustar plano</h2>

        <Input
          label="Quanto você pode pagar por mês?"
          inputMode="decimal"
          placeholder="0,00"
          autoComplete="off"
          leftIcon={<span className="text-lg font-bold">R$</span>}
          inputClassName="text-lg font-bold"
          value={budgetText}
          onChange={(event) => setBudgetText(event.target.value)}
          error={budgetError}
        />

        <fieldset>
          <legend className="mb-2 text-sm">Método</legend>
          <div className="space-y-3">
            {plan.options.map((option) => {
              const text = METHOD_TEXT[option.method]
              const selected = method === option.method
              return (
                <label
                  key={option.method}
                  className={classNames(
                    'block cursor-pointer rounded-control border bg-surface-raised p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-foreground',
                    selected ? 'border-brand' : 'border-border-strong hover:border-foreground',
                  )}
                >
                  <input
                    type="radio"
                    name="method"
                    className="sr-only"
                    checked={selected}
                    onChange={() => setMethod(option.method)}
                  />
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold">{text.title}</span>
                    {option.recommended && <Badge>Recomendado</Badge>}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{text.description}</span>
                  <span className="mt-2 flex flex-wrap justify-between gap-x-4 text-sm">
                    <span className="text-muted">Livre em {formatMonthShort(option.debtFreeDate)}</span>
                    <span className="font-bold">Juros: {formatCurrency(option.totalInterest)}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {submit.status === 'success' && <FormMessage kind="success">Plano salvo e recalculado!</FormMessage>}
        {submit.status === 'error' && (
          <FormMessage kind="error">{`Não foi possível salvar o plano. ${submit.message}`}</FormMessage>
        )}

        <Button type="submit" size="lg" fullWidth disabled={submit.status === 'saving'}>
          {submit.status === 'saving' ? 'Salvando...' : 'Salvar plano'}
        </Button>
      </form>
    </Card>
  )
}
