import { Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PATHS } from '../../routes/paths'

interface LogoProps {
  /** false na tela de entrar, onde a logo não leva a lugar nenhum */
  linked?: boolean
}

export function Logo({ linked = true }: LogoProps) {
  const content = (
    <>
      <span className="grid size-10 place-items-center rounded-control bg-linear-to-b from-brand-light to-brand-dark text-on-brand shadow-glow md:size-14 md:rounded-2xl">
        <Calculator className="size-5 md:size-7" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight md:text-3xl">
        Conta <span className="text-brand">Certa</span>
      </span>
    </>
  )

  if (!linked) {
    return <div className="flex items-center gap-3 md:gap-4">{content}</div>
  }

  return (
    <Link
      to={PATHS.home}
      className="flex items-center gap-3 rounded-control md:gap-4"
      aria-label="Conta Certa, ir para o início"
    >
      {content}
    </Link>
  )
}
