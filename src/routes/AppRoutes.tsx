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
import { PATHS } from './paths'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site público: cabeçalho e rodapé próprios */}
        <Route element={<SiteLayout />}>
          <Route path={PATHS.site} element={<SiteHomePage />} />
          <Route path={PATHS.members} element={<MembersPage />} />
          <Route path="/integrantes/:rm" element={<MemberDetailPage />} />
          <Route path={PATHS.about} element={<AboutPage />} />
          <Route path={PATHS.faq} element={<FaqPage />} />
          <Route path={PATHS.contact} element={<ContactPage />} />
          <Route path={PATHS.login} element={<LoginPage />} />
          {/* Qualquer endereço desconhecido cai na página 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* App (a solução) */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="transacoes" element={<TransactionsPage />} />
          <Route path="dividas" element={<DebtsPage />} />
          <Route path="dividas/nova" element={<DebtNewPage />} />
          <Route path="dividas/:id" element={<DebtDetailPage />} />
          <Route path="dividas/:id/editar" element={<DebtEditPage />} />
          <Route path="plano" element={<PlanPage />} />
          <Route path="aprender" element={<LearnPage />} />
          <Route path="*" element={<NotFoundPage backTo={PATHS.home} backLabel="Voltar para o início" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
