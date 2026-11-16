import { Send } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { SitePage } from '../components/site/SitePage'
import { Button, Card, FormMessage, Input } from '../components/ui'
import { classNames } from '../components/ui/classNames'
import { getErrorMessage } from '../services/api'
import { sendContactMessage } from '../services/contactService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MESSAGE_MIN = 10
const MESSAGE_MAX = 1000

type Field = 'name' | 'email' | 'message'
type FieldErrors = Partial<Record<Field, string>>

type SubmitState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export function ContactPage() {
  const messageId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (name.trim().length < 2) nextErrors.name = 'Informe seu nome.'
    if (email.trim() === '') nextErrors.email = 'Informe seu e-mail.'
    else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'E-mail inválido, ex.: voce@email.com.'
    if (message.trim().length < MESSAGE_MIN) {
      nextErrors.message = `Escreva uma mensagem com pelo menos ${MESSAGE_MIN} caracteres.`
    }
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmit({ status: 'idle' })
      return
    }

    setSubmit({ status: 'saving' })
    try {
      await sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() })
      setName('')
      setEmail('')
      setMessage('')
      setSubmit({ status: 'success' })
    } catch (error) {
      setSubmit({ status: 'error', message: getErrorMessage(error) })
    }
  }

  return (
    <SitePage title="Contato" description="Dúvida, sugestão ou problema? Mande uma mensagem para o grupo.">
      <Card padding="lg" className="max-w-2xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Nome"
            autoComplete="name"
            placeholder="Seu nome"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
          />

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
            <label htmlFor={messageId} className="mb-2 block text-sm">
              Mensagem
            </label>
            <textarea
              id={messageId}
              rows={6}
              maxLength={MESSAGE_MAX}
              placeholder="Escreva sua mensagem"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`${messageId}-help`}
              className={classNames(
                'block w-full resize-y rounded-control border bg-surface-raised px-4 py-3 text-foreground transition-colors',
                'placeholder:text-subtle focus:outline-none',
                errors.message ? 'border-danger' : 'border-border-strong focus:border-brand',
              )}
            />
            <p
              id={`${messageId}-help`}
              className={classNames('mt-2 text-xs', errors.message ? 'text-danger' : 'text-muted')}
            >
              {errors.message ?? `${message.length} de ${MESSAGE_MAX} caracteres`}
            </p>
          </div>

          {submit.status === 'success' && (
            <FormMessage kind="success">Mensagem enviada! Obrigado pelo contato.</FormMessage>
          )}
          {submit.status === 'error' && (
            <FormMessage kind="error">{`Não foi possível enviar. ${submit.message}`}</FormMessage>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={submit.status === 'saving'}
            leftIcon={<Send size={18} aria-hidden="true" />}
          >
            {submit.status === 'saving' ? 'Enviando...' : 'Enviar mensagem'}
          </Button>
        </form>
      </Card>
    </SitePage>
  )
}
