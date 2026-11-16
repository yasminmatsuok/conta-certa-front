import { Check, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/layout/Logo'
import { Button, Card, FormMessage, Input } from '../components/ui'
import { PATHS } from '../routes/paths'
import { getErrorMessage } from '../services/api'
import { login } from '../services/authService'

const BENEFITS = [
  'Controle de entradas e saídas',
  'Alerta de juros acima da média',
  'Plano para quitar suas dívidas',
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Field = 'email' | 'password'
type FieldErrors = Partial<Record<Field, string>>

type SubmitState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (email.trim() === '') nextErrors.email = 'Informe seu e-mail.'
    else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'E-mail inválido, ex.: voce@email.com.'
    if (password === '') nextErrors.password = 'Informe sua senha.'
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmit({ status: 'idle' })
      return
    }

    setSubmit({ status: 'saving' })
    try {
      await login({ email: email.trim(), password })
      setSubmit({ status: 'success' })
      navigate(PATHS.home)
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
    }
  }

  const busy = submit.status === 'saving' || submit.status === 'success'

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10 md:px-8">
      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <section>
          <Logo linked={false} />

          <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Organize seu dinheiro.
            <span className="block text-brand">Saia das dívidas.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Gratuito, simples e feito para quem quer entender para onde vai o dinheiro e parar de
            pagar juros abusivos.
          </p>

          <ul className="mt-8 space-y-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <Check size={22} strokeWidth={3} className="shrink-0 text-brand" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <Card padding="lg" className="w-full max-w-md justify-self-center lg:justify-self-end">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold">Entrar</h2>
              <p className="mt-1 text-muted">Que bom ver você de novo!</p>
            </div>

            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
            />

            <div>
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={errors.password}
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
              <div className="mt-3 text-right">
                {/* O protótipo ainda não tem a tela de recuperar senha */}
                <button
                  type="button"
                  disabled
                  title="Recuperação de senha ainda não disponível"
                  className="text-sm text-brand disabled:cursor-not-allowed"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            {submit.status === 'success' && <FormMessage kind="success">Tudo certo! Entrando...</FormMessage>}
            {submit.status === 'error' && (
              <FormMessage kind="error">{`Não foi possível entrar. ${submit.message}`}</FormMessage>
            )}

            <Button type="submit" size="lg" fullWidth disabled={busy}>
              {busy ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-subtle">ou</p>

            {/* O protótipo ainda não tem a tela de criar conta */}
            <Button variant="outline" size="lg" fullWidth disabled title="Cadastro ainda não disponível">
              Criar conta grátis
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
