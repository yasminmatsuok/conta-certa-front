import { Calculator, House, SlidersHorizontal, Star, Target } from 'lucide-react'
import type { NavItem, SiteNavItem } from '../types/navigation'

export const PATHS = {
  // Site público
  site: '/',
  members: '/integrantes',
  /** Rota com parâmetro: /integrantes/:rm */
  memberDetail: (rm: string) => `/integrantes/${rm}`,
  about: '/sobre',
  faq: '/faq',
  contact: '/contato',
  login: '/entrar',

  // App (a solução)
  home: '/app',
  transactions: '/app/transacoes',
  debts: '/app/dividas',
  /** Rota com parâmetro: /app/dividas/:id */
  debtDetail: (id: number | string) => `/app/dividas/${id}`,
  debtNew: '/app/dividas/nova',
  debtEdit: (id: number | string) => `/app/dividas/${id}/editar`,
  plan: '/app/plano',
  learn: '/app/aprender',
} as const

/** Itens do menu do site público (cabeçalho e rodapé) */
export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { label: 'Home', path: PATHS.site },
  { label: 'Integrantes', path: PATHS.members },
  { label: 'Sobre', path: PATHS.about },
  { label: 'FAQ', path: PATHS.faq },
  { label: 'Contato', path: PATHS.contact },
]

/** Itens do menu do app (lateral no desktop, barra inferior no mobile) */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', path: PATHS.home, icon: House },
  { label: 'Transações', path: PATHS.transactions, icon: SlidersHorizontal },
  { label: 'Dívidas', path: PATHS.debts, icon: Calculator },
  { label: 'Meu plano', path: PATHS.plan, icon: Target },
  { label: 'Aprender', path: PATHS.learn, icon: Star },
]
