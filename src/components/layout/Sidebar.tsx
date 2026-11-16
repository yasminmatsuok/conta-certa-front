import { ArrowLeft } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_ITEMS, PATHS } from '../../routes/paths'
import { classNames } from '../ui/classNames'

/** Menu lateral: aparece só a partir do breakpoint md (desktop) */
export function Sidebar() {
  return (
    <aside className="sticky top-28 hidden h-[calc(100dvh-7rem)] w-32 shrink-0 flex-col px-1.5 pb-6 pt-9 md:flex">
      <nav aria-label="Menu principal">
        <ul className="space-y-3">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === PATHS.home}
                className={({ isActive }) =>
                  classNames(
                    'flex flex-col items-start gap-2.5 rounded-2xl px-5 py-3.5 text-sm transition',
                    isActive
                      ? 'bg-linear-to-b from-brand-light to-brand-dark font-bold text-on-brand shadow-glow'
                      : 'text-foreground hover:bg-surface-raised',
                  )
                }
              >
                <Icon size={24} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Saída do app para o site público, no pé do menu */}
      <Link
        to={PATHS.site}
        className="mt-auto flex items-center gap-2 rounded-2xl px-3 py-3 text-xs text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
      >
        <ArrowLeft size={16} className="shrink-0" aria-hidden="true" />
        Voltar ao site
      </Link>
    </aside>
  )
}
