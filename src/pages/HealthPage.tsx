import { Clock, Lightbulb, TriangleAlert } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, Card, ErrorState, FormMessage, Input, LoadingState, MonthSelect, ProgressBar } from '../components/ui'
import { classNames } from '../components/ui/classNames'
import { useAsync } from '../hooks/useAsync'
import { getConsulting, getCostInHours, getMonthlySummary, getSituation } from '../services/analysisService'
import { getErrorMessage } from '../services/api'
import { getProfile, updateProfile } from '../services/userService'
import type { Consulting, CostInHours, FinancialSituation, MonthlySummary, Situation } from '../types/analysis'
import type { UserProfile } from '../types/user'
import { currentMonth, formatCurrency, formatPercent, parseMoney, toMoneyInput } from '../utils/format'

/** Saúde financeira: as análises da API (nota, consultoria, resumo do mês e custo em horas) */
export function HealthPage() {
  const loadSituation = useCallback((signal: AbortSignal) => getSituation(signal), [])
  const loadConsulting = useCallback((signal: AbortSignal) => getConsulting(signal), [])
  const situation = useAsync(loadSituation)
  const consulting = useAsync(loadConsulting)

  // A renda muda a nota e a consultoria: depois de salvar, as duas são recalculadas
  function reloadAnalyses() {
    situation.reload()
    consulting.reload()
  }

  return (
    <>
      <PageHeader title="Saúde financeira" description="Como está o seu dinheiro e o que fazer agora." />

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {situation.state.status === 'loading' && <LoadingState label="Calculando sua nota..." />}
          {situation.state.status === 'error' && <ErrorState message={situation.state.message} onRetry={situation.reload} />}
          {situation.state.status === 'success' && <SituationCard situation={situation.state.data} />}

          {consulting.state.status === 'loading' && <LoadingState label="Montando a consultoria..." />}
          {consulting.state.status === 'error' && <ErrorState message={consulting.state.message} onRetry={consulting.reload} />}
          {consulting.state.status === 'success' && <ConsultingCard consulting={consulting.state.data} />}

          <MonthlySummaryCard />
        </div>

        <div className="space-y-5">
          <CostInHoursCard />
          <IncomeCard onSaved={reloadAnalyses} />
        </div>
      </div>
    </>
  )
}

const SITUATION_TONE: Record<FinancialSituation, 'brand' | 'default' | 'white'> = {
  CONFORTAVEL: 'brand',
  ATENCAO: 'default',
  EM_RISCO: 'white',
  INADIMPLENTE: 'white',
}

function SituationCard({ situation }: { situation: Situation }) {
  return (
    <Card tone={SITUATION_TONE[situation.situacao]} className="space-y-5">
      <div className="grid items-center gap-5 md:grid-cols-[auto_1fr]">
        <div className="text-center md:pr-6">
          <p className="text-sm text-muted">Sua nota</p>
          <p className="text-6xl font-bold tracking-tight text-brand">{situation.nota}</p>
          <p className="text-sm text-muted">de 100</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{situation.titulo}</h2>
          <p className="mt-1 text-muted">{situation.descricao}</p>
          <ProgressBar className="mt-4" label="Nota de saúde financeira" value={situation.nota} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-t border-border pt-5 md:grid-cols-4">
        <Fact label="Renda média" value={situation.rendaMedia !== null ? formatCurrency(situation.rendaMedia) : '—'} />
        <Fact label="Parcelas por mês" value={formatCurrency(situation.totalParcelasMes)} />
        <Fact
          label="Da renda vai para parcelas"
          value={situation.comprometimentoPercentual !== null ? formatPercent(situation.comprometimentoPercentual) : '—'}
        />
        <Fact label="Total em dívidas" value={formatCurrency(situation.totalDividas)} />
      </dl>

      {situation.detalhesNota.length > 0 && (
        <div>
          <h3 className="mb-2 font-bold">O que pesou na nota</h3>
          <ul className="space-y-1.5 text-sm">
            {situation.detalhesNota.map((item) => (
              <li key={item.motivo} className="flex justify-between gap-4">
                <span className="text-muted">{item.motivo}</span>
                <span className={classNames('font-bold', item.pontos < 0 ? 'text-danger' : 'text-brand')}>
                  {item.pontos > 0 ? `+${item.pontos}` : item.pontos}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Warnings items={situation.avisos} />
      <Explanation text={situation.comoCalculamos} />
    </Card>
  )
}

function ConsultingCard({ consulting }: { consulting: Consulting }) {
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Quanto pagar de dívidas por mês</h2>
        <p className="mt-1 text-sm text-muted">O menor valor entre o que sobra depois dos gastos essenciais e 40% da renda.</p>
      </div>

      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Fact label="Valor sugerido" value={consulting.valorSugeridoParaDividas !== null ? formatCurrency(consulting.valorSugeridoParaDividas) : '—'} highlight />
        <Fact label="Sobra do mês" value={consulting.folga !== null ? formatCurrency(consulting.folga) : '—'} />
        <Fact label="Gastos essenciais" value={formatCurrency(consulting.gastosEssenciaisMedia)} />
        <Fact label="Parcelas atuais" value={formatCurrency(consulting.totalParcelasMes)} />
      </dl>

      {consulting.comparacao && (
        <p className="flex items-start gap-2 rounded-control border border-border-strong p-3 text-sm">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {consulting.comparacao.mensagem}
        </p>
      )}

      {consulting.sugestoesDeCorte.length > 0 && (
        <div>
          <h3 className="mb-2 font-bold">Onde dá para cortar</h3>
          <ul className="divide-y divide-border text-sm">
            {consulting.sugestoesDeCorte.map((cut) => (
              <li key={cut.categoria} className="flex flex-wrap justify-between gap-2 py-2">
                <span>
                  {cut.categoria} <span className="text-muted">({formatCurrency(cut.gastoUltimoMes)} no último mês)</span>
                </span>
                <span className="font-bold text-brand">economize {formatCurrency(cut.economiaCortandoMetade)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Warnings items={consulting.avisos} />
      <Explanation text={consulting.comoCalculamos} />
    </Card>
  )
}

function MonthlySummaryCard() {
  const [month, setMonth] = useState(currentMonth)
  const load = useCallback((signal: AbortSignal) => getMonthlySummary(month, signal), [month])
  const { state, reload } = useAsync(load)

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Resumo do mês</h2>
        <MonthSelect value={month} onChange={setMonth} />
      </div>

      {state.status === 'loading' && <p className="text-sm text-muted">Carregando...</p>}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
      {state.status === 'success' && <MonthlySummaryContent summary={state.data} />}
    </Card>
  )
}

function MonthlySummaryContent({ summary }: { summary: MonthlySummary }) {
  return (
    <>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Fact label="Entrou" value={formatCurrency(summary.totalEntradas)} />
        <Fact label="Saiu" value={formatCurrency(summary.totalSaidas)} />
        <Fact label="Sobrou" value={formatCurrency(summary.saldoDoMes)} highlight={summary.saldoDoMes >= 0} />
      </dl>

      {summary.fraseDeImpacto && (
        <p className="flex items-start gap-2 rounded-control border border-brand bg-brand-muted p-3 text-sm">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {summary.fraseDeImpacto}
        </p>
      )}

      {summary.gastosPorCategoria.length === 0 ? (
        <p className="text-sm text-muted">Nenhum gasto neste mês.</p>
      ) : (
        <ul className="space-y-3">
          {summary.gastosPorCategoria.map((item) => (
            <li key={item.categoriaId}>
              <div className="mb-1 flex justify-between gap-3 text-sm">
                <span>
                  {item.categoria}
                  {!item.essencial && <span className="text-muted"> · não essencial</span>}
                </span>
                <span className="font-bold">
                  {formatCurrency(item.total)}
                  {item.percentualDaRenda !== null && (
                    <span className="font-normal text-muted"> ({formatPercent(item.percentualDaRenda)} da renda)</span>
                  )}
                </span>
              </div>
              <ProgressBar
                size="sm"
                tone={item.essencial ? 'white' : 'brand'}
                label={`Gasto com ${item.categoria}`}
                value={item.total}
                max={summary.totalSaidas}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function CostInHoursCard() {
  const [valueText, setValueText] = useState('')
  const [result, setResult] = useState<CostInHours | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = parseMoney(valueText)
    if (value === null || value <= 0) {
      setError('Informe o preço, ex.: 150,00.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      setResult(await getCostInHours(value))
    } catch (caught) {
      setResult(null)
      setError(getErrorMessage(caught))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Clock size={20} className="text-brand" aria-hidden="true" />
          Quanto custa em horas?
        </h2>
        <p className="text-sm text-muted">Antes de comprar, veja quanto tempo de trabalho a compra custa.</p>
        <Input
          label="Preço"
          inputMode="decimal"
          placeholder="0,00"
          leftIcon={<span className="font-bold">R$</span>}
          value={valueText}
          onChange={(event) => setValueText(event.target.value)}
          error={error ?? undefined}
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular'}
        </Button>
        {result && (
          <div className="rounded-control border border-brand bg-brand-muted p-4 text-center">
            <p className="text-3xl font-bold text-brand">{result.horasFormatadas}</p>
            <p className="mt-1 text-sm">{result.mensagem}</p>
            <p className="mt-1 text-xs text-muted">Sua hora vale {formatCurrency(result.valorHora)}</p>
          </div>
        )}
      </form>
    </Card>
  )
}

function IncomeCard({ onSaved }: { onSaved: () => void }) {
  const load = useCallback((signal: AbortSignal) => getProfile(signal), [])
  const { state, reload, setData } = useAsync(load)

  return (
    <Card>
      <h2 className="text-xl font-bold">Sua renda</h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        As análises usam a média das entradas do extrato. Sem entradas, usam a renda informada aqui.
      </p>
      {state.status === 'loading' && <p className="text-sm text-muted">Carregando...</p>}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
      {state.status === 'success' && (
        <IncomeForm
          profile={state.data}
          onSaved={(profile) => {
            setData(profile)
            onSaved()
          }}
        />
      )}
    </Card>
  )
}

function IncomeForm({ profile, onSaved }: { profile: UserProfile; onSaved: (profile: UserProfile) => void }) {
  const [incomeText, setIncomeText] = useState(() => (profile.rendaDeclarada !== null ? toMoneyInput(profile.rendaDeclarada) : ''))
  const [hoursText, setHoursText] = useState(String(profile.horasTrabalhoMes))
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const income = incomeText.trim() === '' ? null : parseMoney(incomeText)
    const hours = Number(hoursText)
    if (incomeText.trim() !== '' && income === null) {
      setMessage({ kind: 'error', text: 'Renda inválida, ex.: 2500,00.' })
      return
    }
    if (!Number.isInteger(hours) || hours < 1 || hours > 744) {
      setMessage({ kind: 'error', text: 'As horas por mês devem ficar entre 1 e 744.' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const saved = await updateProfile({ nome: profile.nome, email: profile.email, rendaDeclarada: income, horasTrabalhoMes: hours })
      onSaved(saved)
      setMessage({ kind: 'success', text: 'Salvo! A nota e a consultoria foram recalculadas.' })
    } catch (caught) {
      setMessage({ kind: 'error', text: getErrorMessage(caught) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Renda mensal"
        inputMode="decimal"
        placeholder="0,00"
        leftIcon={<span className="font-bold">R$</span>}
        value={incomeText}
        onChange={(event) => setIncomeText(event.target.value)}
      />
      <Input
        label="Horas de trabalho por mês"
        type="number"
        min={1}
        max={744}
        value={hoursText}
        onChange={(event) => setHoursText(event.target.value)}
        hint="220 horas = 8 horas por dia, 5 dias por semana, mais os sábados."
      />
      {message && <FormMessage kind={message.kind}>{message.text}</FormMessage>}
      <Button type="submit" fullWidth variant="outline" disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}

function Fact({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={classNames('text-xl font-bold tracking-tight', highlight && 'text-brand')}>{value}</dd>
    </div>
  )
}

function Warnings({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}

/** "Como calculamos": fechado por padrão para não poluir a tela */
function Explanation({ text }: { text: string }) {
  return (
    <details className="text-sm text-muted">
      <summary className="cursor-pointer font-bold text-foreground">Como calculamos</summary>
      <p className="mt-2">{text}</p>
    </details>
  )
}
