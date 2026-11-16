import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface PageTitleProps {
  /** Nome da página; a aba do navegador mostra "Nome | Conta Certa" */
  title: string
  children: ReactNode
}

/** Troca o título da aba do navegador quando a rota é aberta */
export function PageTitle({ title, children }: PageTitleProps) {
  useEffect(() => {
    document.title = `${title} | Conta Certa`
  }, [title])

  return children
}
