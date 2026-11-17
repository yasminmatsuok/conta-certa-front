import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, FormMessage, Input } from '../components/ui'
import { buttonClasses } from '../components/ui/buttonStyles'
import { PATHS } from '../routes/paths'
import { getErrorMessage } from '../services/api'
import { login } from '../services/authService'
import { getSession } from '../services/session'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Field = 'email' | 'password'
type FieldErrors = Partial<Record<Field, string>>

type SubmitState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success' }
  | { status: 'error'; message: string }

/** Tela de entrar: fica dentro do site público, com o mesmo cabeçalho e rodapé */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('sessao') === 'expirada'
  const navigationState: unknown = location.state
  const state: object = typeof navigationState === 'object' && navigationState !== null ? navigationState : {}
  // Só volta para telas do próprio app (nunca para um endereço qualquer vindo de fora)
  const from = 'from' in state && typeof state.from === 'string' ? state.from : ''
  const redirectTo = from === PATHS.home || from.startsWith(`${PATHS.home}/`) ? from : PATHS.home
  // Veio do cadastro: a conta foi criada, mas o login automático não deu certo
  const justCreated = 'created' in state && state.created === true
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
      // Volta para a tela que a pessoa tentou abrir antes de entrar (ver AppLayout)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
    }
  }

  const busy = submit.status === 'saving' || submit.status === 'success'

  // Quem já está logado vai direto para o app (enquanto entra, a navegação do submit cuida disso)
  if (getSession() !== null && submit.status === 'idle') {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-12 md:px-8 md:py-20">
      <Card padding="lg" className="w-full max-w-md">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold">Entrar</h1>
            <p className="mt-1 text-muted">Que bom ver você de novo!</p>
          </div>

          {/* A API recusou o token guardado (vencido ou inválido): ver services/api.ts */}
          {sessionExpired && submit.status === 'idle' && (
            <FormMessage kind="error">Sua sessão terminou. Entre de novo para continuar.</FormMessage>
          )}
          {justCreated && submit.status === 'idle' && (
            <FormMessage kind="success">Conta criada! Entre com seu e-mail e senha.</FormMessage>
          )}

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

          <Link to={PATHS.register} className={buttonClasses({ variant: 'outline', size: 'lg', fullWidth: true })}>
            Criar conta grátis
          </Link>
        </form>
      </Card>
    </div>
  )
}
