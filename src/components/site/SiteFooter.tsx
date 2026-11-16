import { Link } from 'react-router-dom'
import { PATHS, SITE_NAV_ITEMS } from '../../routes/paths'

/** Rodapé do site público */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-lg font-bold">
            Conta <span className="text-brand">Certa</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Controle financeiro e saída das dívidas. Projeto acadêmico da Global Solution FIAP.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {SITE_NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="text-muted hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to={PATHS.login} className="text-muted hover:text-brand">
                Entrar
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
