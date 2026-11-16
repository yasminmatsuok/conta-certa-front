import { Link } from 'react-router-dom'
import { buttonClasses } from '../components/ui/buttonStyles'
import { PATHS } from '../routes/paths'

interface NotFoundPageProps {
  /** Para onde o botão leva: a Home do site (padrão) ou o início do app */
  backTo?: string
  backLabel?: string
}

/** Página 404, usada no site público e dentro do app */
export function NotFoundPage({ backTo = PATHS.site, backLabel = 'Voltar para a Home' }: NotFoundPageProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center md:py-24">
      <p className="text-7xl font-bold tracking-tight text-brand md:text-9xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold md:text-3xl">Página não encontrada</h1>
      <p className="mt-3 text-muted">
        O endereço que você abriu não existe ou mudou de lugar.
      </p>
      <Link to={backTo} className={buttonClasses({ className: 'mt-8' })}>
        {backLabel}
      </Link>
    </div>
  )
}
