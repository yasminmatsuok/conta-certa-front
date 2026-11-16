import type { LucideIcon } from 'lucide-react'

/** Item do menu do app (com ícone) */
export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

/** Item do menu do site público (só texto) */
export interface SiteNavItem {
  label: string
  path: string
}
