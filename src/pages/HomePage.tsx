import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calculator,
  Star,
  Target,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { BalanceChart } from '../components/charts/BalanceChart'
import { PageHeader } from '../components/layout/PageHeader'
import { getCategoryMeta } from '../components/transactions/categoryMeta'
import {
  Badge,
  Card,
  ErrorState,
  LoadingState,
  MonthSelect,
  ProgressBar,
  QuickCard,
  StatCard,
} from '../components/ui'
import { buttonClasses } from '../components/ui/buttonStyles'
import { classNames } from '../components/ui/classNames'
import { useAsync } from '../hooks/useAsync'
import { PATHS } from '../routes/paths'
import { getDashboard } from '../services/dashboardService'
import type { Dashboard } from '../types/dashboard'
import {
  currentMonth,
  formatCurrency,
  formatDayMonth,
  formatMonthAbbrev,
  formatMonthShort,
  formatPercent,
} from '../utils/format'

export function HomePage() {
  const [month, setMonth] = useState(currentMonth)
  const load = useCallback((signal: AbortSignal) => getDashboard(month, signal), [month])
  const { state, reload } = useAsync(load)

  const firstName = state.status === 'success' ? state.data.userName.trim().split(/\s+/)[0] : ''

  return (
    <>
      <PageHeader
        title={firstName ? `Olá, ${firstName}!` : 'Olá!'}
        description="Confira seu resumo financeiro de hoje."
        actions={<MonthSelect value={month} onChange={setMonth} />}
      />

      {state.status === 'loading' && <LoadingState label="Carregando seu resumo..." />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
      {state.status === 'success' && <DashboardContent dashboard={state.data} />}
    </>
  )
}

interface DashboardContentProps {
  dashboard: Dashboard
}

function DashboardContent({ dashboard }: DashboardContentProps) {
  const { interestAlert, balanceForecast, expensesByCategory, upcomingPayments } = dashboard
  const forecastEnd = balanceForecast[balanceForecast.length - 1]
  const biggestExpense = Math.max(0, ...expensesByCategory.map((item) => item.total))

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          variant="brand"
          label="Saldo atual"
          value={formatCurrency(dashboard.balance)}
          icon={<Wallet size={24} aria-hidden="true" />}
        />
        <StatCard
          variant="outline"
          label="Entradas do mês"
          value={formatCurrency(dashboard.monthIncome)}
          icon={<ArrowDown size={24} aria-hidden="true" />}
        />
        <StatCard
          variant="white"
          label="Saídas do mês"
          value={formatCurrency(dashboard.monthExpense)}
          icon={<ArrowUp size={24} aria-hidden="true" />}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="space-y-6 xl:col-span-2">
          {interestAlert && (
            <div className="flex flex-wrap items-center gap-4 rounded-control border border-foreground px-4 py-3">
              <TriangleAlert size={28} className="shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-bold">Juros acima da média no {interestAlert.debtName}</p>
                <p className="text-sm text-muted">
                  Sua taxa é de {formatPercent(interestAlert.monthlyRate)} ao mês. A média do mercado
                  é {formatPercent(interestAlert.marketRate)}.
                </p>
              </div>
              <Link
                to={PATHS.debtDetail(interestAlert.debtId)}
                className={buttonClasses({ variant: 'white', size: 'sm' })}
              >
                Ver dívida
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}

          <section aria-labelledby="balance-title">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="balance-title" className="text-xl font-bold">
                  Saldo ao longo do mês
                </h2>
                <p className="text-sm text-muted">
                  {forecastEnd
                    ? `Previsão para ${formatDayMonth(forecastEnd.date)} feita pelo modelo de IA`
                    : 'Ainda sem previsão para este mês'}
                </p>
              </div>
              {dashboard.forecastBalance !== null && (
                <div className="text-right">
                  <p className="text-sm text-muted">Previsão fim do mês</p>
                  <p className="text-2xl font-bold">{formatCurrency(dashboard.forecastBalance)}</p>
                </div>
              )}
            </div>
            <BalanceChart history={dashboard.balanceHistory} forecast={balanceForecast} />
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card padding="sm" className="sm:p-5">
              <h2 className="mb-4 text-lg font-bold">Gastos por categoria</h2>
              {expensesByCategory.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">Nenhum gasto neste mês.</p>
              ) : (
                <ul className="space-y-3">
                  {expensesByCategory.map((item) => {
                    const { label } = getCategoryMeta(item.category)
                    return (
                      <li key={item.category} className="flex items-center gap-3 text-sm">
                        <span className="w-24 shrink-0">{label}</span>
                        <ProgressBar
                          size="sm"
                          label={`Gasto com ${label}`}
                          value={item.total}
                          max={biggestExpense}
                        />
                        <span className="w-24 shrink-0 text-right font-bold">
                          {formatCurrency(item.total)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>

            <Card padding="sm" className="sm:p-5">
              <h2 className="mb-2 text-lg font-bold">Próximos pagamentos</h2>
              {upcomingPayments.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">Nenhum pagamento a vencer.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {upcomingPayments.map((payment) => (
                    <li key={payment.id} className="flex items-center gap-3 py-3">
                      <span
                        className={classNames(
                          'grid size-13 shrink-0 place-items-center rounded-control border bg-surface-raised text-center leading-none',
                          payment.debtId !== null && payment.debtId === interestAlert?.debtId
                            ? 'border-foreground'
                            : 'border-border-strong',
                        )}
                      >
                        <span>
                          <span className="block text-lg font-bold">
                            {formatDayMonth(payment.dueDate).slice(0, 2)}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-muted">
                            {formatMonthAbbrev(payment.dueDate)}
                          </span>
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{payment.title}</span>
                        <span className="block truncate text-sm text-muted">{payment.description}</span>
                      </span>
                      <span className="shrink-0 font-bold">{formatCurrency(payment.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Link to={`${PATHS.transactions}?tipo=entrada`} className={buttonClasses({ variant: 'primary' })}>
              <ArrowDown size={18} aria-hidden="true" />
              Entrou
            </Link>
            <Link to={`${PATHS.transactions}?tipo=saida`} className={buttonClasses({ variant: 'white' })}>
              <ArrowUp size={18} aria-hidden="true" />
              Saiu
            </Link>
          </div>

          <h2 className="pt-1 font-bold">Acesso rápido</h2>

          <QuickCard
            to={PATHS.transactions}
            icon={<Wallet size={22} aria-hidden="true" />}
            title="Nova transação"
            subtitle="Registrar entrada ou saída"
          />

          <QuickCard
            to={PATHS.debts}
            icon={<Calculator size={22} aria-hidden="true" />}
            title="Minhas dívidas"
            badge={
              dashboard.debts.alerts > 0 ? (
                <Badge tone="white">
                  {dashboard.debts.alerts} {dashboard.debts.alerts === 1 ? 'alerta' : 'alertas'}
                </Badge>
              ) : undefined
            }
            subtitle={
              dashboard.debts.count === 0
                ? 'Nenhuma dívida cadastrada'
                : `${dashboard.debts.count} ${dashboard.debts.count === 1 ? 'dívida' : 'dívidas'} · ${formatCurrency(dashboard.debts.total)}`
            }
          />

          <QuickCard
            to={PATHS.plan}
            icon={<Target size={22} aria-hidden="true" />}
            title="Meu plano"
            subtitle={
              dashboard.plan
                ? `Livre das dívidas em ${formatMonthShort(dashboard.plan.debtFreeDate)}`
                : 'Monte seu plano para sair das dívidas'
            }
          >
            {dashboard.plan && (
              <ProgressBar
                size="sm"
                className="mt-2 block max-w-56"
                label="Progresso do plano"
                value={dashboard.plan.progressPercent}
              />
            )}
          </QuickCard>

          <QuickCard
            to={PATHS.learn}
            icon={<Star size={22} aria-hidden="true" />}
            title="Aprender"
            subtitle={
              dashboard.learning
                ? `Trilha "${dashboard.learning.trackTitle}" · ${dashboard.learning.completedLessons} de ${dashboard.learning.totalLessons}`
                : 'Lições curtas sobre dinheiro'
            }
          />
        </div>
      </div>
    </div>
  )
}
