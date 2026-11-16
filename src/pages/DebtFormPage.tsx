import { useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DebtForm } from '../components/debts/DebtForm'
import { PageHeader } from '../components/layout/PageHeader'
import { ErrorState, LoadingState } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { PATHS } from '../routes/paths'
import { createDebt, getDebt, updateDebt } from '../services/debtService'
import type { DebtInput } from '../types/debt'

function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Caminho">
      <Link to={PATHS.debts} className="hover:text-foreground">
        Dívidas
      </Link>
      {' › '}
      <span className="font-bold text-foreground">{current}</span>
    </nav>
  )
}

/** /app/dividas/nova — cadastro de dívida */
export function DebtNewPage() {
  const navigate = useNavigate()

  async function handleSubmit(input: DebtInput) {
    const created = await createDebt(input)
    // O aviso de sucesso aparece na tela da dívida criada
    navigate(PATHS.debtDetail(created.id), { state: { flash: 'Dívida cadastrada!' } })
  }

  return (
    <>
      <PageHeader
        eyebrow={<Breadcrumb current="Nova dívida" />}
        title="Cadastrar dívida"
        description="Informe os dados do contrato ou da fatura. A taxa de juros é comparada com a média do mercado."
      />
      <DebtForm onSubmit={handleSubmit} cancelTo={PATHS.debts} />
    </>
  )
}

/** /app/dividas/:id/editar — edição de uma dívida existente */
export function DebtEditPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams<{ id: string }>()
  const load = useCallback((signal: AbortSignal) => getDebt(id, signal), [id])
  const { state, reload } = useAsync(load)

  async function handleSubmit(input: DebtInput) {
    await updateDebt(id, input)
    navigate(PATHS.debtDetail(id), { state: { flash: 'Dívida atualizada!' } })
  }

  return (
    <>
      <PageHeader
        eyebrow={<Breadcrumb current={state.status === 'success' ? state.data.name : 'Editar'} />}
        title="Editar dívida"
      />
      {state.status === 'loading' && <LoadingState label="Carregando dívida..." />}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
      {state.status === 'success' && (
        <DebtForm debt={state.data} onSubmit={handleSubmit} cancelTo={PATHS.debtDetail(id)} />
      )}
    </>
  )
}
