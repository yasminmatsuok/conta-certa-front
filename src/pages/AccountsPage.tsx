import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { AccountCard } from '../components/accounts/AccountCard'
import { ConnectBankForm } from '../components/accounts/ConnectBankForm'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState, ErrorState, FormMessage, LoadingState } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { listAccounts } from '../services/accountService'
import { formatCurrency } from '../utils/format'

/** Contas bancárias conectadas e seus cartões */
export function AccountsPage() {
  const load = useCallback((signal: AbortSignal) => listAccounts(signal), [])
  const { state, reload, setData } = useAsync(load)

  // Aviso vindo do cadastro: "Conta criada! Agora conecte um banco..."
  const navigationState: unknown = useLocation().state
  const flash =
    typeof navigationState === 'object' &&
    navigationState !== null &&
    'flash' in navigationState &&
    typeof navigationState.flash === 'string'
      ? navigationState.flash
      : null

  const accounts = state.status === 'success' ? state.data : []
  const total = accounts.reduce((sum, account) => sum + account.saldo, 0)

  return (
    <>
      <PageHeader
        title="Contas"
        description={
          accounts.length > 0
            ? `Saldo somado: ${formatCurrency(total)}`
            : 'Conecte um banco para trazer seu extrato.'
        }
      />

      {flash && (
        <FormMessage kind="success" className="mb-5">
          {flash}
        </FormMessage>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {state.status === 'loading' && <LoadingState label="Carregando contas..." />}
          {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
          {state.status === 'success' && accounts.length === 0 && (
            <EmptyState
              title="Nenhuma conta conectada"
              description="Sem conta não dá para lançar transações. Conecte um banco ao lado."
            />
          )}
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onBalanceChanged={reload}
              onDeleted={(id) => setData(accounts.filter((item) => item.id !== id))}
            />
          ))}
        </div>

        {/* Depois de conectar, a lista é recarregada para trazer o saldo calculado pela API */}
        <ConnectBankForm onCreated={reload} />
      </div>
    </>
  )
}
