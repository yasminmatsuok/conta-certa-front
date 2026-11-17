import { Landmark, TrendingUp } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Badge, Button, Card, ErrorState, FormMessage, Input, LoadingState } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { PATHS } from '../routes/paths'
import { getPayOrInvest } from '../services/analysisService'
import { getErrorMessage } from '../services/api'
import { getIndicators, simulateTreasury } from '../services/indicatorService'
import type { PayOrInvest } from '../types/analysis'
import type { Indicator, Indicators, TreasurySimulation } from '../types/indicator'
import { formatCurrency, formatDate, formatPercent, parseMoney } from '../utils/format'

/** Indicadores do país, "pagar ou investir" e simulador do Tesouro Selic */
export function SimulatorsPage() {
  const loadIndicators = useCallback((signal: AbortSignal) => getIndicators(signal), [])
  const loadPayOrInvest = useCallback((signal: AbortSignal) => getPayOrInvest(signal), [])
  const indicators = useAsync(loadIndicators)
  const payOrInvest = useAsync(loadPayOrInvest)

  return (
    <>
      <PageHeader title="Simuladores" description="Dados reais do Banco Central para decidir melhor." />

      <div className="space-y-5">
        {indicators.state.status === 'loading' && <LoadingState label="Buscando os indicadores no Banco Central..." />}
        {indicators.state.status === 'error' && <ErrorState message={indicators.state.message} onRetry={indicators.reload} />}
        {indicators.state.status === 'success' && <IndicatorsSection data={indicators.state.data} />}

        <div className="grid items-start gap-5 xl:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Landmark size={20} className="text-brand" aria-hidden="true" />
              Pagar a dívida ou investir?
            </h2>
            {payOrInvest.state.status === 'loading' && <p className="text-sm text-muted">Comparando...</p>}
            {payOrInvest.state.status === 'error' && <ErrorState message={payOrInvest.state.message} onRetry={payOrInvest.reload} />}
            {payOrInvest.state.status === 'success' && <PayOrInvestContent data={payOrInvest.state.data} />}
          </Card>

          <TreasurySimulator />
        </div>
      </div>
    </>
  )
}

function IndicatorsSection({ data }: { data: Indicators }) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Situação do país</h2>
        {data.desatualizado && <Badge tone="white">Banco Central fora do ar: últimos dados salvos</Badge>}
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <IndicatorTile indicator={data.selic} />
        <IndicatorTile indicator={data.ipca12Meses} />
        <IndicatorTile indicator={data.ipcaMensal} />
        <IndicatorTile indicator={data.dolar} />
        <div>
          <p className="text-sm text-muted">Juro real</p>
          <p className="text-2xl font-bold text-brand">{formatPercent(data.juroReal)}</p>
          <p className="text-xs text-subtle">acima da inflação</p>
        </div>
      </div>
      <p className="text-xs text-subtle">
        {data.juroRealExplicacao} Fonte: {data.fonte}.
      </p>
    </Card>
  )
}

function IndicatorTile({ indicator }: { indicator: Indicator }) {
  const value =
    indicator.unidade === 'R$' ? formatCurrency(indicator.valor) : formatPercent(indicator.valor)
  return (
    <div>
      <p className="text-sm text-muted">{indicator.nome}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-subtle">
        {indicator.unidade === 'R$' ? 'em' : `${indicator.unidade} ·`} {formatDate(indicator.dataReferencia)}
      </p>
    </div>
  )
}

function PayOrInvestContent({ data }: { data: PayOrInvest }) {
  return (
    <>
      <p className="text-sm text-muted">
        O Tesouro Selic rende cerca de {formatPercent(data.rendimentoMensalLiquidoPercentual)} ao mês (já sem imposto).
        Dívida com juros maiores que isso vale mais a pena quitar.
      </p>
      {data.dividas.length === 0 ? (
        <p className="text-sm">
          Você não tem dívidas ativas. <Link to={PATHS.vaults} className="text-brand hover:underline">Que tal guardar num cofre?</Link>
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {data.dividas.map((debt) => (
            <li key={debt.dividaId} className="space-y-1 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold">
                  {debt.tipoDescricao} · {debt.credor}
                </span>
                <Badge tone={debt.recomendacao === 'QUITAR' ? 'white' : 'brand'}>
                  {debt.recomendacao === 'QUITAR' ? 'Quitar primeiro' : 'Pode investir'}
                </Badge>
              </div>
              <p className="text-sm text-muted">{debt.mensagem}</p>
            </li>
          ))}
        </ul>
      )}
      {data.avisos.map((warning) => (
        <p key={warning} className="text-sm text-muted">
          {warning}
        </p>
      ))}
    </>
  )
}

function TreasurySimulator() {
  const [initialText, setInitialText] = useState('1000')
  const [monthlyText, setMonthlyText] = useState('100')
  const [monthsText, setMonthsText] = useState('24')
  const [result, setResult] = useState<TreasurySimulation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const initial = parseMoney(initialText)
    const monthly = parseMoney(monthlyText)
    const months = Number(monthsText)
    if (initial === null || monthly === null) return setError('Informe os valores, ex.: 1000,00 (use 0 se não houver).')
    if (!Number.isInteger(months) || months < 1 || months > 600) return setError('O prazo vai de 1 a 600 meses.')

    setError(null)
    setLoading(true)
    try {
      // Sem a Selic no corpo, a API usa a taxa atual do Banco Central
      setResult(await simulateTreasury({ valorInicial: initial, aporteMensal: monthly, meses: months }))
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
          <TrendingUp size={20} className="text-brand" aria-hidden="true" />
          Simulador do Tesouro Selic
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input label="Valor inicial" inputMode="decimal" leftIcon={<span className="font-bold">R$</span>} value={initialText} onChange={(event) => setInitialText(event.target.value)} />
          <Input label="Por mês" inputMode="decimal" leftIcon={<span className="font-bold">R$</span>} value={monthlyText} onChange={(event) => setMonthlyText(event.target.value)} />
          <Input label="Meses" type="number" min={1} max={600} value={monthsText} onChange={(event) => setMonthsText(event.target.value)} />
        </div>
        {error && <FormMessage kind="error">{error}</FormMessage>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Simulando...' : 'Simular'}
        </Button>

        {result && (
          <div className="space-y-3 rounded-control border border-brand bg-brand-muted p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm">Você teria, já sem imposto</span>
              <span className="text-3xl font-bold text-brand">{formatCurrency(result.valorLiquidoFinal)}</span>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Você investiu</dt>
                <dd className="font-bold">{formatCurrency(result.totalInvestido)}</dd>
              </div>
              <div>
                <dt className="text-muted">Rendeu (líquido)</dt>
                <dd className="font-bold">
                  {formatCurrency(result.rendimentoLiquido)} ({formatPercent(result.rentabilidadeLiquidaPercentual)})
                </dd>
              </div>
              <div>
                <dt className="text-muted">Imposto de renda</dt>
                <dd className="font-bold">{formatCurrency(result.impostoDeRenda)}</dd>
              </div>
              <div>
                <dt className="text-muted">Em dinheiro de hoje</dt>
                <dd className="font-bold">{formatCurrency(result.valorFinalEmDinheiroDeHoje)}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted">
              Selic usada: {formatPercent(result.selicAnual)} ao ano. {result.origemDasTaxas}
            </p>
          </div>
        )}
      </form>
    </Card>
  )
}
