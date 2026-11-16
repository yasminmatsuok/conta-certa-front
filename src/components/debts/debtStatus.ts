import type { DebtStatus } from '../../types/debt'

interface DebtStatusMeta {
  label: string
  badgeTone: 'brand' | 'white' | 'outline'
}

const STATUS_META: Record<DebtStatus, DebtStatusMeta> = {
  EM_DIA: { label: 'Em dia', badgeTone: 'brand' },
  ATENCAO: { label: 'Atenção', badgeTone: 'outline' },
  JUROS_ALTOS: { label: 'Juros altos', badgeTone: 'white' },
}

/** Texto e cor do selo da dívida; status desconhecido cai em "Atenção" */
export function getDebtStatusMeta(status: string): DebtStatusMeta {
  return status in STATUS_META ? STATUS_META[status as DebtStatus] : STATUS_META.ATENCAO
}
