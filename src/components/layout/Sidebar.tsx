import { ArrowLeft } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_ITEMS, PATHS } from '../../routes/paths'
import { classNames } from '../ui/classNames'

/** Menu lateral: aparece só a partir do breakpoint md (desktop) */
export function Sidebar() {
  return (
    <aside className="sticky top-28 hidden h-[calc(100dvh-7rem)] w-32 shrink-0 flex-col px-1.5 pb-6 pt-6 md:flex">
      {/* São 9 telas: em telas baixas o menu rola sozinho, sem esconder o "Voltar ao site" */}
      <nav aria-label="Menu principal" className="min-h-0 flex-1 overflow-y-auto">
        <ul className="space-y-1.5">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === PATHS.home}
                className={({ isActive }) =>
                  classNames(
                    'flex flex-col items-start gap-1.5 rounded-2xl px-5 py-2.5 text-sm transition',
                    isActive
                      ? 'bg-linear-to-b from-brand-light to-brand-dark font-bold text-on-brand shadow-glow'
                      : 'text-foreground hover:bg-surface-raised',
                  )
                }
              >
                <Icon size={22} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Saída do app para o site público, no pé do menu */}
      <Link
        to={PATHS.site}
        className="mt-3 flex items-center gap-2 rounded-2xl px-3 py-3 text-xs text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
      >
        <ArrowLeft size={16} className="shrink-0" aria-hidden="true" />
        Voltar ao site
      </Link>
    </aside>
  )
}
