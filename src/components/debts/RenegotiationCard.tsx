import { useState } from 'react'
import type { FormEvent } from 'react'
import { simulateRenegotiation } from '../../services/analysisService'
import { getErrorMessage } from '../../services/api'
import type { Renegotiation, RenegotiationScenario } from '../../types/analysis'
import { formatCurrency } from '../../utils/format'
import { Badge, Button, Card, FormMessage, Input } from '../ui'
import { classNames } from '../ui/classNames'

interface RenegotiationCardProps {
  debtId: number
}

/** Lê "12,5" ou "12.5" como número; vazio ou inválido vira null */
function parseNumber(text: string): number | null {
  const normalized = text.trim().replace(',', '.')
  if (normalized === '' || Number.isNaN(Number(normalized))) return null
  return Number(normalized)
}

/** Simulador de renegociação: compara continuar, pagar à vista e o novo parcelamento proposto */
export function RenegotiationCard({ debtId }: RenegotiationCardProps) {
  const [discountText, setDiscountText] = useState('30')
  const [installmentsText, setInstallmentsText] = useState('12')
  const [rateText, setRateText] = useState('3')
  const [result, setResult] = useState<Renegotiation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const discount = parseNumber(discountText)
    const installments = parseNumber(installmentsText)
    const rate = parseNumber(rateText)
    if (discount === null || discount < 0 || discount > 100) return setError('O desconto vai de 0 a 100%.')
    if (installments === null || !Number.isInteger(installments) || installments < 1) return setError('Informe quantas parcelas, ex.: 12.')
    if (rate === null || rate < 0 || rate > 100) return setError('A taxa vai de 0 a 100% ao mês.')

    setError(null)
    setLoading(true)
    try {
      setResult(await simulateRenegotiation(debtId, { percentualDescontoAVista: discount, novaQtParcelas: installments, novaTaxaMensal: rate }))
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
        <div>
          <h2 className="text-xl font-bold">O banco fez uma proposta?</h2>
          <p className="mt-1 text-sm text-muted">Coloque os números da proposta e veja se vale a pena. Nada é alterado na dívida.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input label="Desconto à vista (%)" inputMode="decimal" value={discountText} onChange={(event) => setDiscountText(event.target.value)} />
          <Input label="Novas parcelas" type="number" min={1} max={600} value={installmentsText} onChange={(event) => setInstallmentsText(event.target.value)} />
          <Input label="Nova taxa (% ao mês)" inputMode="decimal" value={rateText} onChange={(event) => setRateText(event.target.value)} />
        </div>
        {error && <FormMessage kind="error">{error}</FormMessage>}
        <Button type="submit" variant="outline" fullWidth disabled={loading}>
          {loading ? 'Comparando...' : 'Comparar'}
        </Button>

        {result && (
          <div className="space-y-3">
            {[result.continuarComoEsta, result.aVistaComDesconto, result.novoParcelamento].map((scenario) => (
              <ScenarioRow key={scenario.codigo} scenario={scenario} best={scenario.codigo === result.melhorCenario} />
            ))}
            <p className="text-sm">{result.mensagem}</p>
          </div>
        )}
      </form>
    </Card>
  )
}

function ScenarioRow({ scenario, best }: { scenario: RenegotiationScenario; best: boolean }) {
  return (
    <div className={classNames('rounded-control border p-3', best ? 'border-brand bg-brand-muted' : 'border-border-strong')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold">{scenario.nome}</span>
        {best && <Badge>Melhor opção</Badge>}
      </div>
      {scenario.quitavel && scenario.totalAPagar !== null ? (
        <p className="mt-1 text-sm text-muted">
          Total {formatCurrency(scenario.totalAPagar)}
          {scenario.parcelas !== null && scenario.valorParcela !== null && scenario.parcelas > 1 &&
            ` em ${scenario.parcelas}x de ${formatCurrency(scenario.valorParcela)}`}
          {scenario.totalJuros !== null && ` · juros ${formatCurrency(scenario.totalJuros)}`}
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted">Com a parcela atual a dívida não acaba.</p>
      )}
      {scenario.observacao && <p className="mt-1 text-xs text-subtle">{scenario.observacao}</p>}
    </div>
  )
}
