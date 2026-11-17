import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button, Card, FormMessage, Input } from '../components/ui'
import { PATHS } from '../routes/paths'
import { getErrorMessage } from '../services/api'
import { login, register } from '../services/authService'
import { getSession } from '../services/session'
import { parseMoney } from '../utils/format'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Mesma regra da API: 8 a 72 caracteres, com pelo menos uma letra e um número */
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/

type Field = 'name' | 'email' | 'cpf' | 'password' | 'income'
type FieldErrors = Partial<Record<Field, string>>

type SubmitState = { status: 'idle' } | { status: 'saving' } | { status: 'error'; message: string }

/** "Criar conta": fica no site público, como a tela de entrar */
export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [incomeText, setIncomeText] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cpfDigits = cpf.replace(/\D/g, '')
    const income = incomeText.trim() === '' ? null : parseMoney(incomeText)
    const nextErrors: FieldErrors = {}
    if (name.trim().length < 3) nextErrors.name = 'Informe seu nome (pelo menos 3 letras).'
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'E-mail inválido, ex.: voce@email.com.'
    // O dígito verificador do CPF é conferido pela API
    if (cpfDigits.length !== 11) nextErrors.cpf = 'O CPF tem 11 números.'
    if (!PASSWORD_PATTERN.test(password)) {
      nextErrors.password = 'Use de 8 a 72 caracteres, com pelo menos uma letra e um número.'
    }
    if (incomeText.trim() !== '' && (income === null || income < 0)) {
      nextErrors.income = 'Informe um valor válido, ex.: 2500,00 (ou deixe em branco).'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmit({ status: 'saving' })
    try {
      await register({
        nome: name.trim(),
        email: email.trim(),
        cpf: cpfDigits,
        senha: password,
        ...(income !== null ? { rendaDeclarada: income } : {}),
      })
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
      return
    }

    // A conta já existe. Se o login automático falhar (rede, API reiniciando), a pessoa vai para
    // a tela de entrar em vez de tentar cadastrar de novo e receber "e-mail já cadastrado".
    try {
      await login({ email: email.trim(), password })
      // Conta nova ainda não tem extrato: o primeiro passo é conectar um banco
      navigate(PATHS.accounts, { state: { flash: 'Conta criada! Agora conecte um banco para começar.' } })
    } catch {
      navigate(PATHS.login, { state: { created: true } })
    }
  }

  const busy = submit.status === 'saving'

  // Quem já está logado não precisa criar conta (enquanto envia, a navegação do submit cuida disso)
  if (getSession() !== null && submit.status === 'idle') {
    return <Navigate to={PATHS.home} replace />
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-12 md:px-8 md:py-20">
      <Card padding="lg" className="w-full max-w-md">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold">Criar conta</h1>
            <p className="mt-1 text-muted">Leva menos de um minuto.</p>
          </div>

          <Input
            label="Nome"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            maxLength={150}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />
          <Input
            label="CPF"
            inputMode="numeric"
            placeholder="000.000.000-00"
            maxLength={14}
            value={cpf}
            onChange={(event) => setCpf(event.target.value)}
            error={errors.cpf}
          />
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            hint="8 caracteres ou mais, com letra e número."
            rightSlot={
              <button
                type="button"
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
                className="grid size-8 cursor-pointer place-items-center rounded-pill hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            }
          />
          <Input
            label="Renda mensal (opcional)"
            inputMode="decimal"
            placeholder="0,00"
            autoComplete="off"
            leftIcon={<span className="font-bold">R$</span>}
            value={incomeText}
            onChange={(event) => setIncomeText(event.target.value)}
            error={errors.income}
            hint="Usada nas análises enquanto você não tem entradas no extrato."
          />

          {submit.status === 'error' && (
            <FormMessage kind="error">{`Não foi possível criar a conta. ${submit.message}`}</FormMessage>
          )}

          <Button type="submit" size="lg" fullWidth disabled={busy}>
            {busy ? 'Criando...' : 'Criar conta'}
          </Button>

          <p className="text-center text-sm text-muted">
            Já tem conta?{' '}
            <Link to={PATHS.login} className="font-bold text-brand hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
