import { Globe } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { QuickCard } from '../components/ui'
import { EXTRA_NAV_ITEMS, PATHS } from '../routes/paths'

const DESCRIPTIONS: Record<string, string> = {
  [PATHS.learn]: 'Trilhas curtas de educação financeira',
  [PATHS.accounts]: 'Bancos conectados e cartões',
  [PATHS.vaults]: 'Metas para guardar dinheiro',
  [PATHS.health]: 'Sua nota, consultoria e resumo do mês',
  [PATHS.simulators]: 'Selic, inflação e Tesouro Selic',
}

/** "Mais" (só no mobile): as telas que não cabem na barra inferior */
export function MorePage() {
  return (
    <>
      <PageHeader title="Mais" />
      <div className="space-y-3">
        {EXTRA_NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <QuickCard key={path} to={path} icon={<Icon size={22} aria-hidden="true" />} title={label} subtitle={DESCRIPTIONS[path] ?? ''} />
        ))}
        <QuickCard to={PATHS.site} icon={<Globe size={22} aria-hidden="true" />} title="Voltar ao site" subtitle="Página inicial, integrantes e contato" />
      </div>
    </>
  )
}
