import { Check } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getErrorMessage } from '../../services/api'
import { createTransaction } from '../../services/transactionService'
import type { Transaction, TransactionCategory, TransactionType } from '../../types/transaction'
import { parseMoney, todayIso } from '../../utils/format'
import { Button, Card, FormMessage, Input } from '../ui'
import { classNames } from '../ui/classNames'
import { CATEGORIES_BY_TYPE, getCategoryMeta } from './categoryMeta'

interface TransactionFormProps {
  initialType?: TransactionType
  /** Chamado com a transação devolvida pela API depois de salvar */
  onCreated: (transaction: Transaction) => void
}

type Field = 'amount' | 'description' | 'category' | 'date'
type FieldErrors = Partial<Record<Field, string>>

type SubmitState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success' }
  | { status: 'error'; message: string }

const TYPE_OPTIONS: { type: TransactionType; label: string }[] = [
  { type: 'ENTRADA', label: 'Entrou' },
  { type: 'SAIDA', label: 'Saiu' },
]

export function TransactionForm({ initialType = 'SAIDA', onCreated }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialType)
  const [amountText, setAmountText] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TransactionCategory | null>(null)
  const [date, setDate] = useState(todayIso)
  const [recurring, setRecurring] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  function changeType(nextType: TransactionType) {
    setType(nextType)
    // As categorias mudam conforme o tipo
    setCategory(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const amount = parseMoney(amountText)
    const nextErrors: FieldErrors = {}
    if (amount === null || amount <= 0) nextErrors.amount = 'Informe um valor maior que zero, ex.: 86,90.'
    if (description.trim().length < 2) nextErrors.description = 'Descreva a transação, ex.: Mercado.'
    if (category === null) nextErrors.category = 'Escolha uma categoria.'
    if (date === '') nextErrors.date = 'Informe a data.'
    setErrors(nextErrors)

    if (amount === null || category === null || Object.keys(nextErrors).length > 0) {
      setSubmit({ status: 'idle' })
      return
    }

    setSubmit({ status: 'saving' })
    try {
      const created = await createTransaction({
        type,
        amount,
        description: description.trim(),
        category,
        date,
        recurring,
      })
      onCreated(created)
      setAmountText('')
      setDescription('')
      setCategory(null)
      setRecurring(false)
      setSubmit({ status: 'success' })
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <h2 className="text-xl font-bold">Nova transação</h2>

        <div
          role="radiogroup"
          aria-label="Tipo de transação"
          className="grid grid-cols-2 gap-1 rounded-control border border-border-strong bg-surface-raised p-1"
        >
          {TYPE_OPTIONS.map((option) => {
            const selected = type === option.type
            return (
              <button
                key={option.type}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => changeType(option.type)}
                className={classNames(
                  'h-11 cursor-pointer rounded-[0.625rem] font-bold transition-colors',
                  selected ? 'bg-foreground text-background' : 'text-muted hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <Input
          label="Valor"
          inputMode="decimal"
          placeholder="0,00"
          autoComplete="off"
          leftIcon={<span className="text-lg font-bold">R$</span>}
          inputClassName="text-lg font-bold"
          value={amountText}
          onChange={(event) => setAmountText(event.target.value)}
          error={errors.amount}
        />

        <Input
          label="Descrição"
          placeholder={type === 'SAIDA' ? 'Ex.: Mercado Bom Preço' : 'Ex.: Diárias da semana'}
          maxLength={80}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={errors.description}
        />

        <fieldset>
          <legend className="mb-2 text-sm">Categoria</legend>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES_BY_TYPE[type].map((option) => {
              const { label, icon: Icon } = getCategoryMeta(option)
              const selected = category === option
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(option)}
                  className={classNames(
                    'flex cursor-pointer flex-col items-center gap-2 rounded-control border bg-surface-raised px-1 py-3 text-xs transition-colors',
                    selected ? 'border-brand' : 'border-border-strong hover:border-foreground',
                  )}
                >
                  <span
                    className={classNames(
                      'grid size-8 place-items-center rounded-pill',
                      selected ? 'bg-brand text-on-brand' : 'border-2 border-brand text-brand',
                    )}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  {label}
                </button>
              )
            })}
          </div>
          {errors.category && (
            <p role="alert" className="mt-2 text-xs text-danger">
              {errors.category}
            </p>
          )}
        </fieldset>

        <Input
          label="Data"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          error={errors.date}
        />

        <div className="flex items-center justify-between gap-4">
          <span id="recurring-label">Repetir todo mês</span>
          <button
            type="button"
            role="switch"
            aria-checked={recurring}
            aria-labelledby="recurring-label"
            onClick={() => setRecurring((current) => !current)}
            className={classNames(
              'flex h-8 w-14 cursor-pointer items-center rounded-pill p-1 transition-colors',
              recurring ? 'justify-end bg-brand' : 'justify-start bg-border-strong',
            )}
          >
            <span className={classNames('size-6 rounded-pill', recurring ? 'bg-background' : 'bg-foreground')} />
          </button>
        </div>

        {submit.status === 'success' && <FormMessage kind="success">Transação salva!</FormMessage>}
        {submit.status === 'error' && (
          <FormMessage kind="error">{`Não foi possível salvar. ${submit.message}`}</FormMessage>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={submit.status === 'saving'}
          leftIcon={<Check size={20} aria-hidden="true" />}
        >
          {submit.status === 'saving' ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Card>
  )
}
