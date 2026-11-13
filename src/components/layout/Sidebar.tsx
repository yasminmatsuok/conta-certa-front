import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, PATHS } from '../../routes/paths'
import { classNames } from '../ui/classNames'

/** Menu lateral: aparece só a partir do breakpoint md (desktop) */
export function Sidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 border-r border-border px-3 py-6 md:block">
      <nav aria-label="Menu principal">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === PATHS.home}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-3 rounded-control px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-muted text-brand'
                      : 'text-muted hover:bg-surface hover:text-foreground',
                  )
                }
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
