import { Briefcase, Car, CircleAlert, Ellipsis, House, ShoppingCart, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TransactionCategory, TransactionType } from '../../types/transaction'

interface CategoryMeta {
  label: string
  icon: LucideIcon
}

const CATEGORY_META: Record<TransactionCategory, CategoryMeta> = {
  MERCADO: { label: 'Mercado', icon: ShoppingCart },
  TRANSPORTE: { label: 'Transporte', icon: Car },
  MORADIA: { label: 'Moradia', icon: House },
  CONTAS: { label: 'Contas', icon: CircleAlert },
  LAZER: { label: 'Lazer', icon: Star },
  TRABALHO: { label: 'Trabalho', icon: Briefcase },
  OUTROS: { label: 'Outros', icon: Ellipsis },
}

/** Nome e ícone da categoria; se a API mandar uma categoria nova, cai em "Outros" */
export function getCategoryMeta(category: string): CategoryMeta {
  return category in CATEGORY_META
    ? CATEGORY_META[category as TransactionCategory]
    : CATEGORY_META.OUTROS
}

/** Categorias oferecidas no formulário para cada tipo de transação */
export const CATEGORIES_BY_TYPE: Record<TransactionType, TransactionCategory[]> = {
  SAIDA: ['MERCADO', 'TRANSPORTE', 'MORADIA', 'CONTAS', 'LAZER', 'OUTROS'],
  ENTRADA: ['TRABALHO', 'OUTROS'],
}
