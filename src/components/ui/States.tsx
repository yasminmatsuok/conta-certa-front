import { CircleAlert, Inbox, LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

const boxClasses =
  'flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center'

interface LoadingStateProps {
  label?: string
}

/** Estado de carregando */
export function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return (
    <div role="status" className={boxClasses}>
      <LoaderCircle size={32} className="animate-spin text-brand" aria-hidden="true" />
      <p className="text-muted">{label}</p>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

/** Estado de erro, com botão para tentar de novo */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className={boxClasses}>
      <CircleAlert size={32} className="text-danger" aria-hidden="true" />
      <div>
        <p className="font-bold">Não deu para carregar</p>
        <p className="mt-1 text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <Button variant="neutral" size="sm" onClick={onRetry}>
          Tentar de novo
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  /** Botão ou link opcional, ex.: "Cadastrar a primeira" */
  action?: ReactNode
}

/** Estado de lista vazia */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={boxClasses}>
      <Inbox size={32} className="text-subtle" aria-hidden="true" />
      <div>
        <p className="font-bold">{title}</p>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
