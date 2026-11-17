import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { listAccounts } from '../../services/accountService'
import { getErrorMessage } from '../../services/api'
import { registerPayment } from '../../services/debtService'
import type { DebtDetail } from '../../types/debt'
import { formatCurrency, parseMoney, toMoneyInput } from '../../utils/format'
import { Button, Card, FormMessage, Input, Select } from '../ui'

interface DebtPaymentFormProps {
  debt: DebtDetail
  /** Recebe a dívida atualizada pela API (novo saldo, parcelas e histórico) */
  onPaid: (debt: DebtDetail) => void
}

/** "Registrar pagamento" (POST /debts/{id}/payments) */
export function DebtPaymentForm({ debt, onPaid }: DebtPaymentFormProps) {
  const loadAccounts = useCallback((signal: AbortSignal) => listAccounts(signal), [])
  const { state: accounts, reload: reloadAccounts } = useAsync(loadAccounts)

  const [amountText, setAmountText] = useState(() => toMoneyInput(Math.min(debt.minimumPayment, debt.balance)))
  // '' = pago por fora do app (não mexe em nenhuma conta)
  const [accountId, setAccountId] = useState('')
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = parseMoney(amountText)
    if (amount === null || amount <= 0) {
      setMessage({ kind: 'error', text: 'Informe um valor maior que zero.' })
      return
    }
    if (amount > debt.balance) {
      setMessage({ kind: 'error', text: `O valor passa do saldo da dívida (${formatCurrency(debt.balance)}).` })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const updated = await registerPayment(debt.id, {
        amount,
        ...(accountId !== '' ? { accountId: Number(accountId) } : {}),
      })
      onPaid(updated)
      // Próximo pagamento já sugerido com o saldo novo; o saldo da conta escolhida também mudou
      setAmountText(toMoneyInput(Math.min(updated.minimumPayment, updated.balance)))
      if (accountId !== '') reloadAccounts()
      setMessage({
        kind: 'success',
        text: updated.balance === 0 ? 'Dívida quitada! Parabéns!' : `Pagamento registrado. Falta ${formatCurrency(updated.balance)}.`,
      })
    } catch (error) {
      setMessage({ kind: 'error', text: getErrorMessage(error) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <h2 className="text-xl font-bold">Registrar pagamento</h2>
        <Input
          label="Valor pago"
          inputMode="decimal"
          leftIcon={<span className="font-bold">R$</span>}
          value={amountText}
          onChange={(event) => setAmountText(event.target.value)}
        />
        <Select
          label="Saiu de qual conta?"
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          hint="Escolhendo uma conta, o valor sai do saldo e aparece nas transações."
        >
          <option value="">Paguei por fora do app</option>
          {accounts.status === 'success' &&
            accounts.data.map((account) => (
              <option key={account.id} value={account.id}>
                {account.bancoNome} ({formatCurrency(account.saldo)})
              </option>
            ))}
        </Select>
        {message && <FormMessage kind={message.kind}>{message.text}</FormMessage>}
        <Button type="submit" size="lg" fullWidth disabled={saving || debt.balance <= 0}>
          {saving ? 'Registrando...' : 'Registrar pagamento'}
        </Button>
      </form>
    </Card>
  )
}
