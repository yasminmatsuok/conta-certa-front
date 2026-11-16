import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PATHS, SITE_NAV_ITEMS } from '../../routes/paths'
import { buttonClasses } from '../ui/buttonStyles'
import { classNames } from '../ui/classNames'
import { Logo } from '../layout/Logo'

/** Cabeçalho do site público: menu no desktop, hambúrguer no mobile */
export function SiteHeader() {
  const { pathname } = useLocation()
  // Guarda em qual página o menu mobile foi aberto: ao trocar de página
  // (por qualquer link, inclusive a logo e o botão Entrar) ele fecha sozinho.
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const menuOpen = openedAt === pathname
  const closeMenu = () => setOpenedAt(null)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-24 md:px-8">
        <Logo to={PATHS.site} />

        <nav aria-label="Menu do site" className="hidden items-center gap-1 lg:flex">
          {SITE_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === PATHS.site}
              className={({ isActive }) =>
                classNames(
                  'rounded-control px-4 py-2 font-medium transition-colors',
                  isActive ? 'text-brand' : 'text-foreground hover:bg-surface-raised',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Na própria tela de entrar o botão não faz sentido */}
          {pathname !== PATHS.login && (
            <Link to={PATHS.login} className={buttonClasses({ size: 'sm' })}>
              Entrar
            </Link>
          )}
          <button
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu-mobile"
            onClick={() => setOpenedAt(menuOpen ? null : pathname)}
            className="grid size-10 cursor-pointer place-items-center rounded-control border border-border-strong lg:hidden"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="site-menu-mobile"
          aria-label="Menu do site"
          className="border-t border-border px-4 py-3 lg:hidden"
        >
          <ul className="space-y-1">
            {SITE_NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === PATHS.site}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    classNames(
                      'block rounded-control px-4 py-3 font-medium',
                      isActive ? 'bg-brand-muted text-brand' : 'hover:bg-surface-raised',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
