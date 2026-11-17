import { PiggyBank, Trash2 } from 'lucide-react'
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
  Select,
} from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { PATHS } from '../routes/paths'
import { listAccounts } from '../services/accountService'
import { getErrorMessage } from '../services/api'
import { createVault, deleteVault, depositToVault, listVaults, withdrawFromVault } from '../services/vaultService'
import type { Account } from '../types/account'
import type { Vault } from '../types/vault'
import { formatCurrency, formatDate, parseMoney, todayIso } from '../utils/format'

/** Cofres: metas de economia com depósito e resgate */
export function VaultsPage() {
  const loadVaults = useCallback((signal: AbortSignal) => listVaults(signal), [])
  const loadAccounts = useCallback((signal: AbortSignal) => listAccounts(signal), [])
  const { state, reload, setData } = useAsync(loadVaults)
  const { state: accountsState, reload: reloadAccounts } = useAsync(loadAccounts)

  const vaults = state.status === 'success' ? state.data : []
  const accounts = accountsState.status === 'success' ? accountsState.data : []
  const saved = vaults.reduce((sum, vault) => sum + vault.valorGuardado, 0)

  function replaceVault(updated: Vault) {
    setData(vaults.map((vault) => (vault.id === updated.id ? updated : vault)))
    // O dinheiro saiu (ou voltou) para a conta: o saldo mostrado na lista de contas muda
    reloadAccounts()
  }

  return (
    <>
      <PageHeader
        title="Cofres"
        description={vaults.length > 0 ? `Total guardado: ${formatCurrency(saved)}` : 'Separe dinheiro para seus objetivos.'}
      />

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {state.status === 'loading' && <LoadingState label="Carregando cofres..." />}
          {state.status === 'error' && <ErrorState message={state.message} onRetry={reload} />}
          {state.status === 'success' && vaults.length === 0 && (
            <EmptyState
              title="Nenhum cofre ainda"
              description="Crie um cofre para uma reserva de emergência ou um objetivo, como uma viagem."
            />
          )}
          {vaults.map((vault) => (
            <VaultCard
              key={vault.id}
              vault={vault}
              accounts={accounts}
              accountsLoaded={accountsState.status === 'success'}
              onChanged={replaceVault}
              onDeleted={(id) => setData(vaults.filter((item) => item.id !== id))}
            />
          ))}
        </div>

        {/* Recarrega em vez de juntar na lista local: a lista pode ainda estar carregando */}
        <NewVaultForm onCreated={reload} />
      </div>
    </>
  )
}

interface VaultCardProps {
  vault: Vault
  accounts: Account[]
  /** false enquanto as contas carregam (ou se a busca falhou): não dá para dizer que não há contas */
  accountsLoaded: boolean
  onChanged: (vault: Vault) => void
  onDeleted: (id: number) => void
}

type Movement = 'deposit' | 'withdraw'

function VaultCard({ vault, accounts, accountsLoaded, onChanged, onDeleted }: VaultCardProps) {
  const [accountId, setAccountId] = useState('')
  const [amountText, setAmountText] = useState('')
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null)
  const selectedAccount = accountId !== '' ? accountId : String(accounts[0]?.id ?? '')

  async function move(kind: Movement) {
    const amount = parseMoney(amountText)
    if (amount === null || amount <= 0) {
      setFeedback({ kind: 'error', message: 'Informe um valor maior que zero, ex.: 50,00.' })
      return
    }
    if (selectedAccount === '') {
      setFeedback({ kind: 'error', message: 'Você precisa de uma conta conectada para movimentar o cofre.' })
      return
    }
    setBusy(true)
    setFeedback(null)
    try {
      const movement = { contaId: Number(selectedAccount), valor: amount }
      const updated = kind === 'deposit' ? await depositToVault(vault.id, movement) : await withdrawFromVault(vault.id, movement)
      onChanged(updated)
      setAmountText('')
      setFeedback({
        kind: 'success',
        message: kind === 'deposit' ? `${formatCurrency(amount)} guardados!` : `${formatCurrency(amount)} voltaram para a conta.`,
      })
    } catch (error) {
      setFeedback({ kind: 'error', message: getErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Excluir o cofre "${vault.nome}"?`)) return
    setBusy(true)
    try {
      await deleteVault(vault.id)
      onDeleted(vault.id)
    } catch (error) {
      setFeedback({ kind: 'error', message: `Não foi possível excluir. ${getErrorMessage(error)}` })
      setBusy(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void move('deposit')
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-control border border-brand bg-brand-muted text-brand">
            <PiggyBank size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold">
              {vault.nome}
              {vault.metaAtingida && <Badge>Meta atingida</Badge>}
              {vault.prazoVencido && <Badge tone="white">Prazo vencido</Badge>}
            </h2>
            {vault.dataLimite && <p className="text-sm text-muted">Até {formatDate(vault.dataLimite)}</p>}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Excluir o cofre ${vault.nome}`}
          onClick={handleDelete}
          disabled={busy}
          className="grid size-9 cursor-pointer place-items-center rounded-pill text-muted hover:text-danger"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-brand">{formatCurrency(vault.valorGuardado)}</span>
          {vault.valorMeta !== null && <span className="text-sm text-muted">de {formatCurrency(vault.valorMeta)}</span>}
        </div>
        {vault.valorMeta !== null && (
          <ProgressBar label={`Progresso do cofre ${vault.nome}`} value={vault.percentualConcluido ?? 0} />
        )}
        {vault.valorMensalNecessario !== null && !vault.metaAtingida && (
          <p className="mt-2 text-sm text-muted">
            Guarde {formatCurrency(vault.valorMensalNecessario)} por mês para chegar lá
            {vault.mesesRestantes !== null && ` (${vault.mesesRestantes} ${vault.mesesRestantes === 1 ? 'mês' : 'meses'})`}.
          </p>
        )}
      </div>

      {!accountsLoaded ? null : accounts.length === 0 ? (
        <p className="text-sm text-muted">
          Para guardar dinheiro aqui, <Link to={PATHS.accounts} className="text-brand hover:underline">conecte uma conta</Link>.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="grid items-end gap-3 sm:grid-cols-[1.3fr_1fr_auto_auto]">
          <Select label="Conta" value={selectedAccount} onChange={(event) => setAccountId(event.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.bancoNome} ({formatCurrency(account.saldo)})
              </option>
            ))}
          </Select>
          <Input
            label="Valor"
            inputMode="decimal"
            placeholder="0,00"
            leftIcon={<span className="font-bold">R$</span>}
            value={amountText}
            onChange={(event) => setAmountText(event.target.value)}
          />
          <Button type="submit" disabled={busy}>
            Guardar
          </Button>
          <Button variant="neutral" disabled={busy || vault.valorGuardado <= 0} onClick={() => move('withdraw')}>
            Resgatar
          </Button>
        </form>
      )}

      {feedback && <FormMessage kind={feedback.kind}>{feedback.message}</FormMessage>}
    </Card>
  )
}

interface NewVaultFormProps {
  onCreated: () => void
}

function NewVaultForm({ onCreated }: NewVaultFormProps) {
  const [name, setName] = useState('')
  const [goalText, setGoalText] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const goal = goalText.trim() === '' ? null : parseMoney(goalText)
    if (name.trim() === '') return setError('Dê um nome para o cofre, ex.: Reserva de emergência.')
    if (goalText.trim() !== '' && (goal === null || goal <= 0)) return setError('A meta deve ser maior que zero.')
    if (deadline !== '' && deadline <= todayIso()) return setError('A data limite precisa ser no futuro.')

    setError(null)
    setSaving(true)
    try {
      await createVault({
        nome: name.trim(),
        ...(goal !== null ? { valorMeta: goal } : {}),
        ...(deadline !== '' ? { dataLimite: deadline } : {}),
      })
      onCreated()
      setName('')
      setGoalText('')
      setDeadline('')
    } catch (caught) {
      setError(`Não foi possível criar. ${getErrorMessage(caught)}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <h2 className="text-xl font-bold">Novo cofre</h2>
        <Input label="Nome" maxLength={60} placeholder="Ex.: Reserva de emergência" value={name} onChange={(event) => setName(event.target.value)} />
        <Input
          label="Meta (opcional)"
          inputMode="decimal"
          placeholder="0,00"
          leftIcon={<span className="font-bold">R$</span>}
          value={goalText}
          onChange={(event) => setGoalText(event.target.value)}
        />
        <Input label="Até quando (opcional)" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        {error && <FormMessage kind="error">{error}</FormMessage>}
        <Button type="submit" size="lg" fullWidth disabled={saving}>
          {saving ? 'Criando...' : 'Criar cofre'}
        </Button>
      </form>
    </Card>
  )
}
