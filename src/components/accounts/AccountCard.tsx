import { CreditCard, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { createCard, deleteAccount, deleteCard, listCards, simulatePurchase } from '../../services/accountService'
import { getErrorMessage } from '../../services/api'
import type { Account, BankCard, CardType } from '../../types/account'
import { formatCurrency, parseMoney } from '../../utils/format'
import { Badge, Button, Card, FormMessage, Input, ProgressBar, Select } from '../ui'

interface AccountCardProps {
  account: Account
  /** O saldo da conta mudou (compra no débito): a lista de contas precisa ser recarregada */
  onBalanceChanged: () => void
  onDeleted: (id: number) => void
}

type Feedback = { kind: 'success' | 'error'; message: string } | null

/** Uma conta conectada: saldo, cartões e as ações (simular compra, novo cartão, desconectar) */
export function AccountCard({ account, onBalanceChanged, onDeleted }: AccountCardProps) {
  const loadCards = useCallback((signal: AbortSignal) => listCards(account.id, signal), [account.id])
  const { state: cards, reload: reloadCards } = useAsync(loadCards)
  const [showCardForm, setShowCardForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const cardList = cards.status === 'success' ? cards.data : []
  const hasCredit = cardList.some((card) => card.tipo === 'CREDITO')
  const hasDebit = cardList.some((card) => card.tipo === 'DEBITO')

  async function handleSimulate(type: CardType) {
    setBusy(true)
    setFeedback(null)
    try {
      const purchase = await simulatePurchase(account.id, type)
      setFeedback({
        kind: 'success',
        message: `Compra simulada: ${purchase.descricao} (${purchase.categoriaNome}) de ${formatCurrency(purchase.valor)}.`,
      })
      reloadCards()
      // No débito o dinheiro sai do saldo; no crédito vai para a fatura
      if (type === 'DEBITO') onBalanceChanged()
    } catch (error) {
      setFeedback({ kind: 'error', message: `Não foi possível simular. ${getErrorMessage(error)}` })
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteAccount() {
    const question =
      `Desconectar ${account.bancoNome}? O extrato e os cartões dessa conta serão apagados. ` +
      'As dívidas continuam cadastradas.'
    if (!window.confirm(question)) return
    setBusy(true)
    try {
      await deleteAccount(account.id)
      onDeleted(account.id)
    } catch (error) {
      setFeedback({ kind: 'error', message: `Não foi possível desconectar. ${getErrorMessage(error)}` })
      setBusy(false)
    }
  }

  async function handleDeleteCard(card: BankCard) {
    if (!window.confirm(`Excluir o cartão final ${card.numeroFinal}?`)) return
    setFeedback(null)
    try {
      await deleteCard(card.id)
      reloadCards()
    } catch (error) {
      setFeedback({ kind: 'error', message: `Não foi possível excluir o cartão. ${getErrorMessage(error)}` })
    }
  }

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">{account.bancoNome}</h2>
            {account.dadosSimulados && <Badge tone="outline">Dados de exemplo</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted">
            Agência {account.agencia} · Conta {account.numeroConta}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Saldo</p>
          <p className="text-2xl font-bold text-brand">{formatCurrency(account.saldo)}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-bold">Cartões</h3>
        {cards.status === 'loading' && <p className="text-sm text-muted">Carregando cartões...</p>}
        {cards.status === 'error' && <p className="text-sm text-danger">{cards.message}</p>}
        {cards.status === 'success' && cardList.length === 0 && (
          <p className="text-sm text-muted">Nenhum cartão cadastrado nesta conta.</p>
        )}
        <ul className="divide-y divide-border">
          {cardList.map((card) => (
            <li key={card.id} className="flex items-center gap-4 py-3">
              <CreditCard size={22} className="shrink-0 text-brand" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  {card.tipo === 'CREDITO' ? 'Crédito' : 'Débito'} final {card.numeroFinal}
                </p>
                {card.tipo === 'CREDITO' && card.limite !== null && (
                  <>
                    <p className="text-sm text-muted">
                      Fatura {formatCurrency(card.faturaAtual)} de {formatCurrency(card.limite)}
                      {card.diaVencimento !== null && ` · vence dia ${card.diaVencimento}`}
                    </p>
                    <ProgressBar
                      size="sm"
                      tone="white"
                      className="mt-2"
                      label={`Limite usado do cartão final ${card.numeroFinal}`}
                      value={card.faturaAtual}
                      max={card.limite}
                    />
                  </>
                )}
              </div>
              <button
                type="button"
                aria-label={`Excluir cartão final ${card.numeroFinal}`}
                onClick={() => handleDeleteCard(card)}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-pill text-muted hover:text-danger"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showCardForm && (
        <NewCardForm
          accountId={account.id}
          onCreated={() => {
            setShowCardForm(false)
            reloadCards()
          }}
        />
      )}

      {feedback && <FormMessage kind={feedback.kind}>{feedback.message}</FormMessage>}

      <div className="flex flex-wrap gap-2">
        {hasCredit && (
          <Button size="sm" disabled={busy} onClick={() => handleSimulate('CREDITO')} leftIcon={<ShoppingBag size={16} aria-hidden="true" />}>
            Simular compra no crédito
          </Button>
        )}
        {hasDebit && (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => handleSimulate('DEBITO')}>
            Simular compra no débito
          </Button>
        )}
        {!showCardForm && (
          <Button size="sm" variant="neutral" onClick={() => setShowCardForm(true)} leftIcon={<Plus size={16} aria-hidden="true" />}>
            Adicionar cartão
          </Button>
        )}
        <Button size="sm" variant="neutral" disabled={busy} onClick={handleDeleteAccount} className="ml-auto">
          Desconectar
        </Button>
      </div>
    </Card>
  )
}

interface NewCardFormProps {
  accountId: number
  onCreated: () => void
}

/** Cadastro de cartão (POST /contas/{id}/cartoes). Crédito exige limite e dia de vencimento. */
function NewCardForm({ accountId, onCreated }: NewCardFormProps) {
  const [type, setType] = useState<CardType>('CREDITO')
  const [lastDigits, setLastDigits] = useState('')
  const [limitText, setLimitText] = useState('')
  const [dueDay, setDueDay] = useState('10')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const limit = parseMoney(limitText)
    const day = Number(dueDay)
    if (!/^\d{4}$/.test(lastDigits)) return setError('Informe os 4 últimos números do cartão.')
    if (type === 'CREDITO' && (limit === null || limit <= 0)) return setError('Informe o limite do cartão.')
    if (type === 'CREDITO' && !(day >= 1 && day <= 28)) return setError('O vencimento deve ser um dia de 1 a 28.')

    setError(null)
    setSaving(true)
    try {
      await createCard(accountId, {
        tipo: type,
        numeroFinal: lastDigits,
        ...(type === 'CREDITO' && limit !== null ? { limite: limit, diaVencimento: day } : {}),
      })
      onCreated()
    } catch (caught) {
      setError(`Não foi possível cadastrar. ${getErrorMessage(caught)}`)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-control border border-border-strong p-4">
      <h3 className="font-bold">Novo cartão</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Tipo" value={type} onChange={(event) => setType(event.target.value as CardType)}>
          <option value="CREDITO">Crédito</option>
          <option value="DEBITO">Débito</option>
        </Select>
        <Input
          label="4 últimos números"
          inputMode="numeric"
          maxLength={4}
          value={lastDigits}
          onChange={(event) => setLastDigits(event.target.value)}
        />
        {type === 'CREDITO' && (
          <>
            <Input
              label="Limite"
              inputMode="decimal"
              placeholder="0,00"
              leftIcon={<span className="font-bold">R$</span>}
              value={limitText}
              onChange={(event) => setLimitText(event.target.value)}
            />
            <Input
              label="Dia do vencimento"
              type="number"
              min={1}
              max={28}
              value={dueDay}
              onChange={(event) => setDueDay(event.target.value)}
            />
          </>
        )}
      </div>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <Button type="submit" size="sm" disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar cartão'}
      </Button>
    </form>
  )
}
