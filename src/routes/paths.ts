import {
  Calculator,
  Ellipsis,
  HeartPulse,
  House,
  Landmark,
  PiggyBank,
  SlidersHorizontal,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react'
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
  register: '/cadastro',

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
  accounts: '/app/contas',
  vaults: '/app/cofres',
  health: '/app/saude',
  simulators: '/app/simuladores',
  more: '/app/mais',
} as const

/** Itens do menu do site público (cabeçalho e rodapé) */
export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { label: 'Home', path: PATHS.site },
  { label: 'Integrantes', path: PATHS.members },
  { label: 'Sobre', path: PATHS.about },
  { label: 'FAQ', path: PATHS.faq },
  { label: 'Contato', path: PATHS.contact },
]

/** As telas principais: aparecem no menu lateral e na barra inferior do mobile */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Início', path: PATHS.home, icon: House },
  { label: 'Transações', path: PATHS.transactions, icon: SlidersHorizontal },
  { label: 'Dívidas', path: PATHS.debts, icon: Calculator },
  { label: 'Meu plano', path: PATHS.plan, icon: Target },
]

/** As outras telas: no menu lateral e, no mobile, dentro de "Mais" */
export const EXTRA_NAV_ITEMS: NavItem[] = [
  { label: 'Aprender', path: PATHS.learn, icon: Star },
  { label: 'Contas', path: PATHS.accounts, icon: Landmark },
  { label: 'Cofres', path: PATHS.vaults, icon: PiggyBank },
  { label: 'Saúde', path: PATHS.health, icon: HeartPulse },
  { label: 'Simuladores', path: PATHS.simulators, icon: TrendingUp },
]

/** Menu lateral (desktop): todas as telas */
export const NAV_ITEMS: NavItem[] = [...MAIN_NAV_ITEMS, ...EXTRA_NAV_ITEMS]

/** Barra inferior (mobile): as principais e o atalho para "Mais" */
export const MOBILE_NAV_ITEMS: NavItem[] = [...MAIN_NAV_ITEMS, { label: 'Mais', path: PATHS.more, icon: Ellipsis }]
