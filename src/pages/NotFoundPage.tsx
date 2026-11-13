import { Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { PATHS } from '../routes/paths'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Página não encontrada" description="O endereço que você abriu não existe." />
      <Link to={PATHS.home} className="font-semibold text-brand hover:underline">
        Voltar para o início
      </Link>
    </>
  )
}
