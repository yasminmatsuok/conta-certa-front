import { CircleAlert, CircleCheck } from 'lucide-react'
import { classNames } from './classNames'

interface FormMessageProps {
  kind: 'success' | 'error'
  children: string
  className?: string
}

/** Aviso de sucesso ou de falha depois de enviar um formulário */
export function FormMessage({ kind, children, className }: FormMessageProps) {
  const Icon = kind === 'success' ? CircleCheck : CircleAlert

  return (
    <p
      role={kind === 'error' ? 'alert' : 'status'}
      className={classNames(
        'flex items-start gap-2 rounded-control border px-3 py-2.5 text-sm',
        kind === 'success' ? 'border-brand text-brand' : 'border-danger text-danger',
        className,
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}
