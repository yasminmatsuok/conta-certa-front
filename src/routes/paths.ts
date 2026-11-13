import { BookOpen, CreditCard, House, ListChecks, Target } from 'lucide-react'
import type { NavItem } from '../types/navigation'

export const PATHS = {
  home: '/',
  transactions: '/transacoes',
  debts: '/dividas',
  plan: '/plano',
  learn: '/aprender',
} as const

/** Itens do menu (lateral no desktop, barra inferior no mobile) */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', path: PATHS.home, icon: House },
  { label: 'Transações', path: PATHS.transactions, icon: ListChecks },
  { label: 'Dívidas', path: PATHS.debts, icon: CreditCard },
  { label: 'Meu plano', path: PATHS.plan, icon: Target },
  { label: 'Aprender', path: PATHS.learn, icon: BookOpen },
]
