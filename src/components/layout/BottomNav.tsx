import { NavLink, useLocation } from 'react-router-dom'
import { EXTRA_NAV_ITEMS, MOBILE_NAV_ITEMS, PATHS } from '../../routes/paths'
import { classNames } from '../ui/classNames'

const itemClasses = 'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors'

/**
 * Barra de navegação inferior: aparece só no mobile (abaixo do breakpoint md).
 * Cabem só 5 itens: as 4 telas principais e "Mais", que leva às outras telas e ao site.
 */
export function BottomNav() {
  const { pathname } = useLocation()
  // "Mais" fica aceso também dentro das telas que ele agrupa (Contas, Cofres, Saúde...)
  const insideMore = EXTRA_NAV_ITEMS.some((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))

  return (
    <nav
      aria-label="Menu principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-lg">
        {MOBILE_NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <li key={path} className="min-w-0 flex-1">
            <NavLink
              to={path}
              end={path === PATHS.home}
              className={({ isActive }) =>
                classNames(
                  itemClasses,
                  isActive || (path === PATHS.more && insideMore) ? 'text-brand' : 'text-muted hover:text-foreground',
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
