import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { DebtDetailPage } from '../pages/DebtDetailPage'
import { DebtsPage } from '../pages/DebtsPage'
import { HomePage } from '../pages/HomePage'
import { LearnPage } from '../pages/LearnPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlanPage } from '../pages/PlanPage'
import { TransactionsPage } from '../pages/TransactionsPage'
import { PATHS } from './paths'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ainda não há tela de entrada: a raiz leva direto para o app */}
        <Route path="/" element={<Navigate to={PATHS.home} replace />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="transacoes" element={<TransactionsPage />} />
          <Route path="dividas" element={<DebtsPage />} />
          <Route path="dividas/:id" element={<DebtDetailPage />} />
          <Route path="plano" element={<PlanPage />} />
          <Route path="aprender" element={<LearnPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<Navigate to={PATHS.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
