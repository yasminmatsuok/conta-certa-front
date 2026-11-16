import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../../services/api'
import type { Debt, DebtInput } from '../../types/debt'
import { parseMoney } from '../../utils/format'
import { Button, Card, FormMessage, Input } from '../ui'
import { buttonClasses } from '../ui/buttonStyles'
import { classNames } from '../ui/classNames'

/**
 * Tipos de crédito oferecidos no formulário. O texto escolhido vai no campo `type`,
 * e é por ele que a API escolhe a média de juros do mercado: combine a lista com a API.
 */
const DEBT_TYPES = [
  'Rotativo do cartão',
  'Fatura parcelada',
  'Cheque especial',
  'Empréstimo pessoal',
  'Empréstimo consignado',
  'Crediário de loja',
  'Financiamento',
  'Outro',
]

interface DebtFormProps {
  /** Dívida que está sendo editada; sem ela, o formulário cadastra uma nova */
  debt?: Debt
  /** Chama o service (criar ou atualizar); se der erro, o formulário mostra a falha */
  onSubmit: (input: DebtInput) => Promise<void>
  /** Para onde o botão "Cancelar" leva */
  cancelTo: string
}

type Field =
  | 'name'
  | 'type'
  | 'creditor'
  | 'balance'
  | 'monthlyRate'
  | 'minimumPayment'
  | 'nextDueDate'
  | 'installments'
type FieldErrors = Partial<Record<Field, string>>

type SubmitState = { status: 'idle' } | { status: 'saving' } | { status: 'error'; message: string }

/** Número para o campo de texto, no formato brasileiro e sem ponto de milhar: 2300.5 -> "2300,50" */
function toFieldText(value: number | undefined, decimals: number): string {
  if (value === undefined) return ''
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
    useGrouping: false,
  })
}

function parseWholeNumber(text: string): number | null {
  return /^\d+$/.test(text.trim()) ? Number(text.trim()) : null
}

export function DebtForm({ debt, onSubmit, cancelTo }: DebtFormProps) {
  const typeId = useId()
  const [name, setName] = useState(debt?.name ?? '')
  const [type, setType] = useState(debt?.type ?? '')
  const [creditor, setCreditor] = useState(debt?.creditor ?? '')
  const [balanceText, setBalanceText] = useState(toFieldText(debt?.balance, 2))
  const [rateText, setRateText] = useState(toFieldText(debt?.monthlyRate, 0))
  const [minimumText, setMinimumText] = useState(toFieldText(debt?.minimumPayment, 2))
  const [nextDueDate, setNextDueDate] = useState(debt?.nextDueDate ?? '')
  const [paidText, setPaidText] = useState(debt?.installmentsPaid?.toString() ?? '')
  const [totalText, setTotalText] = useState(debt?.installmentsTotal?.toString() ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  // Uma dívida antiga pode ter um tipo que não está mais na lista
  const typeOptions = type !== '' && !DEBT_TYPES.includes(type) ? [type, ...DEBT_TYPES] : DEBT_TYPES

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const balance = parseMoney(balanceText)
    const monthlyRate = parseMoney(rateText)
    const minimumPayment = parseMoney(minimumText)
    const hasInstallments = paidText.trim() !== '' || totalText.trim() !== ''
    const installmentsPaid = parseWholeNumber(paidText)
    const installmentsTotal = parseWholeNumber(totalText)

    const nextErrors: FieldErrors = {}
    if (name.trim().length < 2) nextErrors.name = 'Dê um nome para a dívida, ex.: Cartão Banco A.'
    if (type === '') nextErrors.type = 'Escolha o tipo de crédito.'
    if (creditor.trim().length < 2) nextErrors.creditor = 'Informe para quem você deve, ex.: Banco A.'
    if (balance === null || balance <= 0) nextErrors.balance = 'Informe um valor maior que zero, ex.: 2300,00.'
    if (monthlyRate === null || monthlyRate > 100) {
      nextErrors.monthlyRate = 'Informe a taxa ao mês em %, de 0 a 100, ex.: 14,5.'
    }
    if (minimumPayment === null) nextErrors.minimumPayment = 'Informe o valor, ex.: 345,00 (ou 0 se não houver).'
    if (nextDueDate === '') nextErrors.nextDueDate = 'Informe o próximo vencimento.'
    if (hasInstallments) {
      if (installmentsPaid === null || installmentsTotal === null || installmentsTotal < 1) {
        nextErrors.installments = 'Preencha as duas parcelas com números inteiros, ou deixe as duas vazias.'
      } else if (installmentsPaid > installmentsTotal) {
        nextErrors.installments = 'As parcelas pagas não podem passar do total.'
      }
    }
    setErrors(nextErrors)

    if (
      Object.keys(nextErrors).length > 0 ||
      balance === null ||
      monthlyRate === null ||
      minimumPayment === null
    ) {
      setSubmit({ status: 'idle' })
      return
    }

    setSubmit({ status: 'saving' })
    try {
      // Em caso de sucesso, quem chamou o formulário leva a pessoa para a dívida salva
      await onSubmit({
        name: name.trim(),
        type,
        creditor: creditor.trim(),
        balance,
        monthlyRate,
        minimumPayment,
        nextDueDate,
        installmentsPaid: hasInstallments ? installmentsPaid : null,
        installmentsTotal: hasInstallments ? installmentsTotal : null,
      })
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
    }
  }

  const saving = submit.status === 'saving'

  return (
    <Card padding="lg" className="max-w-3xl">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Nome da dívida"
            placeholder="Ex.: Cartão Banco A"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
          />
          <Input
            label="Credor"
            placeholder="Ex.: Banco A"
            maxLength={60}
            value={creditor}
            onChange={(event) => setCreditor(event.target.value)}
            error={errors.creditor}
          />
        </div>

        <div>
          <label htmlFor={typeId} className="mb-2 block text-sm">
            Tipo de crédito
          </label>
          <div className="relative">
            <select
              id={typeId}
              value={type}
              onChange={(event) => setType(event.target.value)}
              aria-invalid={errors.type ? true : undefined}
              aria-describedby={`${typeId}-help`}
              className={classNames(
                'h-13 w-full cursor-pointer appearance-none rounded-control border bg-surface-raised pl-4 pr-10 transition-colors focus:outline-none',
                type === '' ? 'text-subtle' : 'text-foreground',
                errors.type ? 'border-danger' : 'border-border-strong focus:border-brand',
              )}
            >
              <option value="">Escolha...</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>
          <p id={`${typeId}-help`} className={classNames('mt-2 text-xs', errors.type ? 'text-danger' : 'text-muted')}>
            {errors.type ?? 'É pelo tipo que comparamos sua taxa com a média do mercado.'}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Input
            label="Valor devido"
            inputMode="decimal"
            placeholder="0,00"
            autoComplete="off"
            leftIcon={<span className="font-bold">R$</span>}
            value={balanceText}
            onChange={(event) => setBalanceText(event.target.value)}
            error={errors.balance}
          />
          <Input
            label="Taxa de juros ao mês"
            inputMode="decimal"
            placeholder="0,0"
            autoComplete="off"
            rightSlot={<span className="pr-1 font-bold">%</span>}
            value={rateText}
            onChange={(event) => setRateText(event.target.value)}
            error={errors.monthlyRate}
          />
          <Input
            label="Pagamento mínimo"
            inputMode="decimal"
            placeholder="0,00"
            autoComplete="off"
            leftIcon={<span className="font-bold">R$</span>}
            value={minimumText}
            onChange={(event) => setMinimumText(event.target.value)}
            error={errors.minimumPayment}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Input
            label="Próximo vencimento"
            type="date"
            value={nextDueDate}
            onChange={(event) => setNextDueDate(event.target.value)}
            error={errors.nextDueDate}
          />
          <Input
            label="Parcelas pagas (opcional)"
            inputMode="numeric"
            placeholder="Ex.: 9"
            autoComplete="off"
            value={paidText}
            onChange={(event) => setPaidText(event.target.value)}
            error={errors.installments}
          />
          <Input
            label="Total de parcelas (opcional)"
            inputMode="numeric"
            placeholder="Ex.: 12"
            autoComplete="off"
            value={totalText}
            onChange={(event) => setTotalText(event.target.value)}
            hint="Deixe as duas vazias se a dívida não é parcelada."
          />
        </div>

        {submit.status === 'error' && (
          <FormMessage kind="error">{`Não foi possível salvar a dívida. ${submit.message}`}</FormMessage>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Salvando...' : debt ? 'Salvar alterações' : 'Cadastrar dívida'}
          </Button>
          <Link to={cancelTo} className={buttonClasses({ variant: 'neutral', size: 'lg' })}>
            Cancelar
          </Link>
        </div>
      </form>
    </Card>
  )
}
