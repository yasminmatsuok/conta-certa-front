import { Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PATHS } from '../../routes/paths'

interface LogoProps {
  /** Para onde a logo leva: o início do app (padrão) ou a Home do site público */
  to?: string
}

export function Logo({ to = PATHS.home }: LogoProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-control md:gap-4"
      aria-label="Conta Certa, ir para a página inicial"
    >
      <span className="grid size-10 place-items-center rounded-control bg-linear-to-b from-brand-light to-brand-dark text-on-brand shadow-glow md:size-14 md:rounded-2xl">
        <Calculator className="size-5 md:size-7" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight md:text-3xl">
        Conta <span className="text-brand">Certa</span>
      </span>
    </Link>
  )
}
