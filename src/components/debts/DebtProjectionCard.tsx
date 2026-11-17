import { useCallback } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { getDebtProjection } from '../../services/analysisService'
import { formatCurrency } from '../../utils/format'
import { Card, ProgressBar } from '../ui'

/** Quantos meses a projeção mostra */
const MONTHS = 12

interface DebtProjectionCardProps {
  debtId: number
  /** Saldo atual: quando muda (depois de um pagamento), a projeção é refeita */
  balance: number
}

/** "Se eu pagar a parcela x se eu não pagar nada" (GET /dividas/{id}/projecao) */
export function DebtProjectionCard({ debtId, balance }: DebtProjectionCardProps) {
  const load = useCallback(
    (signal: AbortSignal) => {
      void balance // dependência proposital: refaz a busca quando o saldo muda
      return getDebtProjection(debtId, MONTHS, signal)
    },
    [debtId, balance],
  )
  const { state } = useAsync(load)

  if (state.status === 'loading') return null
  if (state.status === 'error') {
    return (
      <Card>
        <h2 className="text-xl font-bold">Próximos {MONTHS} meses</h2>
        <p className="mt-2 text-sm text-danger">{state.message}</p>
      </Card>
    )
  }

  const projection = state.data
  const scale = Math.max(projection.saldoFinalSemPagar, balance, 1)

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Próximos {MONTHS} meses</h2>
        <p className="mt-1 text-sm text-muted">Quanto você vai dever daqui a {MONTHS} meses em cada cenário.</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <span>Pagando a parcela</span>
            <span className="text-xl font-bold text-brand">{formatCurrency(projection.saldoFinalPagando)}</span>
          </div>
          <ProgressBar label="Saldo pagando a parcela" value={projection.saldoFinalPagando} max={scale} />
          <p className="mt-1 text-xs text-muted">Juros no período: {formatCurrency(projection.totalJurosPagando)}</p>
        </div>
        <div>
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <span>Sem pagar nada</span>
            <span className="text-xl font-bold">{formatCurrency(projection.saldoFinalSemPagar)}</span>
          </div>
          <ProgressBar tone="white" label="Saldo sem pagar nada" value={projection.saldoFinalSemPagar} max={scale} />
          <p className="mt-1 text-xs text-muted">
            A dívida cresce {formatCurrency(projection.crescimentoSemPagar)} se ficar parada.
          </p>
        </div>
      </div>

      {projection.encargosAtraso && (
        <p className="rounded-control border border-foreground p-3 text-sm">
          Atrasada há {projection.encargosAtraso.diasAtraso} dias: multa de {formatCurrency(projection.encargosAtraso.multa)} e
          juros de mora de {formatCurrency(projection.encargosAtraso.jurosMora)}. Para quitar hoje:{' '}
          <strong>{formatCurrency(projection.encargosAtraso.valorParaQuitarHoje)}</strong>.
        </p>
      )}
      {projection.avisos.map((warning) => (
        <p key={warning} className="text-sm text-muted">
          {warning}
        </p>
      ))}
    </Card>
  )
}
