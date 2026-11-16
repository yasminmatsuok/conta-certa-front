import type { Debt, DebtDetail } from '../types/debt'
import { api } from './api'

/** GET /debts — dívidas ativas */
export function listDebts(signal?: AbortSignal): Promise<Debt[]> {
  return api.get<Debt[]>('/debts', signal)
}

/** GET /debts/{id} — a dívida com histórico e trilha sugerida */
export function getDebt(id: number | string, signal?: AbortSignal): Promise<DebtDetail> {
  return api.get<DebtDetail>(`/debts/${encodeURIComponent(id)}`, signal)
}

/** DELETE /debts/{id} */
export function deleteDebt(id: number | string): Promise<void> {
  return api.delete(`/debts/${encodeURIComponent(id)}`)
}
