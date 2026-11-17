import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import { clearSession, getSession } from '../../services/session'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

/** Estrutura comum a todas as páginas: cabeçalho, menu e área de conteúdo */
export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = getSession()

  // O app só abre com login: a API recusa (401) qualquer chamada sem token.
  // Guardamos o endereço pedido para voltar a ele depois de entrar.
  if (session === null) {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname + location.search }} />
  }

  // "Sair": apaga a sessão guardada no navegador e volta para a tela de entrar
  function handleLogout() {
    clearSession()
    navigate(PATHS.login)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header userName={session.userName} onLogout={handleLogout} />

      <div className="flex flex-1">
        <Sidebar />
        {/*
          No desktop o conteúdo fica num painel com o canto superior esquerdo arredondado.
          pb-24 no mobile para o conteúdo não ficar atrás da barra inferior.
        */}
        <main className="min-w-0 flex-1 border-border bg-panel px-4 pb-24 pt-6 md:rounded-tl-[2rem] md:border-l md:border-t md:px-8 md:pb-10 md:pt-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
