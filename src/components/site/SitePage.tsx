import type { ReactNode } from 'react'

interface SitePageProps {
  title: string
  description?: string
  children: ReactNode
}

/** Moldura das páginas internas do site: largura, título e subtítulo */
export function SitePage({ title, description, children }: SitePageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>}
      <div className="mt-8 md:mt-10">{children}</div>
    </div>
  )
}
