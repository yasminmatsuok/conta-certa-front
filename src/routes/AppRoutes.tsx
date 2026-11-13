import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
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
        <Route element={<AppLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
          <Route path={PATHS.transactions} element={<TransactionsPage />} />
          <Route path={PATHS.debts} element={<DebtsPage />} />
          <Route path={PATHS.plan} element={<PlanPage />} />
          <Route path={PATHS.learn} element={<LearnPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
