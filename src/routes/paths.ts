import { Calculator, House, SlidersHorizontal, Star, Target } from 'lucide-react'
import type { NavItem } from '../types/navigation'

export const PATHS = {
  login: '/',
  home: '/app',
  transactions: '/app/transacoes',
  debts: '/app/dividas',
  /** Rota com parâmetro: /app/dividas/:id */
  debtDetail: (id: number | string) => `/app/dividas/${id}`,
  plan: '/app/plano',
  learn: '/app/aprender',
} as const

/** Itens do menu (lateral no desktop, barra inferior no mobile) */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', path: PATHS.home, icon: House },
  { label: 'Transações', path: PATHS.transactions, icon: SlidersHorizontal },
  { label: 'Dívidas', path: PATHS.debts, icon: Calculator },
  { label: 'Meu plano', path: PATHS.plan, icon: Target },
  { label: 'Aprender', path: PATHS.learn, icon: Star },
]
