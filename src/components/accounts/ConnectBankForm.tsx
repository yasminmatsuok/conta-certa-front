import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { useAsync } from '../../hooks/useAsync'
import { createAccount, listBanks } from '../../services/accountService'
import { getErrorMessage } from '../../services/api'
import type { Account } from '../../types/account'
import { Button, Card, FormMessage, Input, Select } from '../ui'

interface ConnectBankFormProps {
  /** Chamado com a conta criada pela API */
  onCreated: (account: Account) => void
}

type Field = 'bank' | 'branch' | 'number'
type FieldErrors = Partial<Record<Field, string>>
type SubmitState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

/** Formulário "Conectar banco" (POST /usuarios/{id}/contas) */
export function ConnectBankForm({ onCreated }: ConnectBankFormProps) {
  const loadBanks = useCallback((signal: AbortSignal) => listBanks(signal), [])
  const { state: banks } = useAsync(loadBanks)

  const [bankId, setBankId] = useState('')
  const [branch, setBranch] = useState('')
  const [number, setNumber] = useState('')
  // Ligado por padrão: é o que dá dados para todas as outras telas na demonstração
  const [importData, setImportData] = useState(true)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (bankId === '') nextErrors.bank = 'Escolha o banco.'
    if (!/^\d{4}$/.test(branch.trim())) nextErrors.branch = 'A agência tem 4 números, ex.: 0001.'
    if (!/^\d{1,10}-?[\dXx]$/.test(number.trim())) nextErrors.number = 'Informe a conta com o dígito, ex.: 12345-6.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmit({ status: 'saving' })
    try {
      const created = await createAccount({
        bancoId: Number(bankId),
        agencia: branch.trim(),
        numeroConta: number.trim(),
        importarDadosSimulados: importData,
      })
      onCreated(created)
      setBankId('')
      setBranch('')
      setNumber('')
      const imported = created.importacao
      setSubmit({
        status: 'success',
        message: imported
          ? `Banco conectado! Importamos ${imported.transacoes} transações, ${imported.cartoes} cartões e ${imported.dividas} dívidas.`
          : 'Banco conectado! Agora é só lançar suas transações.',
      })
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <h2 className="text-xl font-bold">Conectar banco</h2>
          <p className="mt-1 text-sm text-muted">
            Integração simulada, no estilo do Open Finance: nenhum dado real do banco é acessado.
          </p>
        </div>

        <Select
          label="Banco"
          value={bankId}
          onChange={(event) => setBankId(event.target.value)}
          error={errors.bank ?? (banks.status === 'error' ? banks.message : undefined)}
          disabled={banks.status !== 'success'}
        >
          <option value="">{banks.status === 'loading' ? 'Carregando bancos...' : 'Escolha um banco'}</option>
          {banks.status === 'success' &&
            banks.data.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.nome} ({bank.codigoCompe})
              </option>
            ))}
        </Select>

        <div className="grid grid-cols-[1fr_1.4fr] gap-3">
          <Input
            label="Agência"
            inputMode="numeric"
            placeholder="0001"
            maxLength={4}
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            error={errors.branch}
          />
          <Input
            label="Conta com dígito"
            placeholder="12345-6"
            maxLength={12}
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            error={errors.number}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={importData}
            onChange={(event) => setImportData(event.target.checked)}
            className="mt-0.5 size-5 accent-brand"
          />
          <span>
            <span className="font-bold">Importar dados de exemplo</span>
            <span className="block text-muted">
              Cria 2 cartões, 3 meses de extrato e algumas dívidas, como se viessem do banco.
            </span>
          </span>
        </label>

        {submit.status === 'success' && <FormMessage kind="success">{submit.message}</FormMessage>}
        {submit.status === 'error' && (
          <FormMessage kind="error">{`Não foi possível conectar. ${submit.message}`}</FormMessage>
        )}

        <Button type="submit" size="lg" fullWidth disabled={submit.status === 'saving'}>
          {submit.status === 'saving' ? 'Conectando...' : 'Conectar banco'}
        </Button>
      </form>
    </Card>
  )
}
