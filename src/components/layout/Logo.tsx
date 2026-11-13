import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PATHS } from '../../routes/paths'

export function Logo() {
  return (
    <Link to={PATHS.home} className="flex items-center gap-2.5 rounded-control" aria-label="Conta Certa, ir para o início">
      <span className="grid size-9 place-items-center rounded-control bg-brand text-on-brand">
        <Check size={20} strokeWidth={3.5} aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Conta <span className="text-brand">Certa</span>
      </span>
    </Link>
  )
}
