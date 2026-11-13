import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Botões de ação da página, alinhados à direita */
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-base text-muted md:text-lg">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
