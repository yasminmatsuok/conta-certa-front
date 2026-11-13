import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

/** Estrutura comum a todas as páginas: cabeçalho, menu e área de conteúdo */
export function AppLayout() {
  return (
    <div className="min-h-dvh">
      {/* TODO: trocar pelo nome do usuário logado quando houver autenticação */}
      <Header userName="Visitante" hasNotifications />

      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        {/* pb-24 no mobile para o conteúdo não ficar atrás da barra inferior */}
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
