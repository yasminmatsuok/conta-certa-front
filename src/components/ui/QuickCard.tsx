import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface QuickCardProps {
  icon: ReactNode
  title: string
  subtitle: string
  /** Selo ao lado do título, ex.: "1 alerta" */
  badge?: ReactNode
  /** Conteúdo extra abaixo do subtítulo, ex.: barra de progresso */
  children?: ReactNode
  /** Com `to` vira link; sem `to`, vira botão que chama `onClick` */
  to?: string
  onClick?: () => void
}

const cardClasses =
  'flex w-full cursor-pointer items-center gap-4 rounded-card border border-border bg-linear-to-b from-surface-raised to-surface p-4 text-left transition-colors hover:border-brand'

/** Cartão clicável com ícone, título e seta (Acesso rápido, Outras trilhas) */
export function QuickCard({ icon, title, subtitle, badge, children, to, onClick }: QuickCardProps) {
  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-control border border-brand bg-brand-muted text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-bold">{title}</span>
          {badge}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{subtitle}</span>
        {children}
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-pill border border-border-strong">
        <ChevronRight size={18} aria-hidden="true" />
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cardClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cardClasses}>
      {content}
    </button>
  )
}
