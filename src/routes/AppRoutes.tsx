import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { SiteLayout } from '../components/site/SiteLayout'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { DebtDetailPage } from '../pages/DebtDetailPage'
import { DebtEditPage, DebtNewPage } from '../pages/DebtFormPage'
import { DebtsPage } from '../pages/DebtsPage'
import { FaqPage } from '../pages/FaqPage'
import { HomePage } from '../pages/HomePage'
import { LearnPage } from '../pages/LearnPage'
import { LoginPage } from '../pages/LoginPage'
import { MemberDetailPage } from '../pages/MemberDetailPage'
import { MembersPage } from '../pages/MembersPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlanPage } from '../pages/PlanPage'
import { SiteHomePage } from '../pages/SiteHomePage'
import { TransactionsPage } from '../pages/TransactionsPage'
import { PageTitle } from './PageTitle'
import { PATHS } from './paths'

/** Página com o título da aba do navegador: "Título | Conta Certa" */
function page(title: string, element: ReactNode) {
  return <PageTitle title={title}>{element}</PageTitle>
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site público: cabeçalho e rodapé próprios */}
        <Route element={<SiteLayout />}>
          <Route path={PATHS.site} element={page('Home', <SiteHomePage />)} />
          <Route path={PATHS.members} element={page('Integrantes', <MembersPage />)} />
          <Route path="/integrantes/:rm" element={page('Integrante', <MemberDetailPage />)} />
          <Route path={PATHS.about} element={page('Sobre', <AboutPage />)} />
          <Route path={PATHS.faq} element={page('Perguntas frequentes', <FaqPage />)} />
          <Route path={PATHS.contact} element={page('Contato', <ContactPage />)} />
          <Route path={PATHS.login} element={page('Entrar', <LoginPage />)} />
          {/* Qualquer endereço desconhecido cai na página 404 */}
          <Route path="*" element={page('Página não encontrada', <NotFoundPage />)} />
        </Route>

        {/* App (a solução) */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={page('Início', <HomePage />)} />
          <Route path="transacoes" element={page('Transações', <TransactionsPage />)} />
          <Route path="dividas" element={page('Minhas dívidas', <DebtsPage />)} />
          <Route path="dividas/nova" element={page('Cadastrar dívida', <DebtNewPage />)} />
          <Route path="dividas/:id" element={page('Detalhe da dívida', <DebtDetailPage />)} />
          <Route path="dividas/:id/editar" element={page('Editar dívida', <DebtEditPage />)} />
          <Route path="plano" element={page('Meu plano', <PlanPage />)} />
          <Route path="aprender" element={page('Aprender', <LearnPage />)} />
          <Route
            path="*"
            element={page(
              'Página não encontrada',
              <NotFoundPage backTo={PATHS.home} backLabel="Voltar para o início" />,
            )}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
