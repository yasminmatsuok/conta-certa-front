import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, PATHS } from '../../routes/paths'
import { classNames } from '../ui/classNames'

/** Menu lateral: aparece só a partir do breakpoint md (desktop) */
export function Sidebar() {
  return (
    <aside className="sticky top-28 hidden h-[calc(100dvh-7rem)] w-32 shrink-0 px-1.5 pt-9 md:block">
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
    </aside>
  )
}
