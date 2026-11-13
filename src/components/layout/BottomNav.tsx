import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, PATHS } from '../../routes/paths'
import { classNames } from '../ui/classNames'

/** Barra de navegação inferior: aparece só no mobile (abaixo do breakpoint md) */
export function BottomNav() {
  return (
    <nav
      aria-label="Menu principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-lg">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <li key={path} className="min-w-0 flex-1">
            <NavLink
              to={path}
              end={path === PATHS.home}
              className={({ isActive }) =>
                classNames(
                  'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  isActive ? 'text-brand' : 'text-muted hover:text-foreground',
                )
              }
            >
              <Icon size={22} aria-hidden="true" />
              <span className="max-w-full truncate px-1">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
