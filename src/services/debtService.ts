import type { Debt, DebtDetail, DebtInput, PaymentInput } from '../types/debt'
import { api } from './api'

/** GET /debts — dívidas ativas */
export function listDebts(signal?: AbortSignal): Promise<Debt[]> {
  return api.get<Debt[]>('/debts', signal)
}

/** GET /debts/{id} — a dívida com histórico e trilha sugerida */
export function getDebt(id: number | string, signal?: AbortSignal): Promise<DebtDetail> {
  return api.get<DebtDetail>(`/debts/${encodeURIComponent(id)}`, signal)
}

/** POST /debts — devolve a dívida criada, já com id, média do mercado e status */
export function createDebt(debt: DebtInput): Promise<Debt> {
  return api.post<Debt>('/debts', debt)
}

/** PUT /debts/{id} — devolve a dívida atualizada */
export function updateDebt(id: number | string, debt: DebtInput): Promise<Debt> {
  return api.put<Debt>(`/debts/${encodeURIComponent(id)}`, debt)
}

/**
 * POST /debts/{id}/payments — registra um pagamento.
 * Com a conta, o valor sai do saldo dela e aparece no extrato. Devolve a dívida já atualizada.
 */
export function registerPayment(id: number, payment: PaymentInput): Promise<DebtDetail> {
  return api.post<DebtDetail>(`/debts/${encodeURIComponent(id)}/payments`, payment)
}

/** DELETE /debts/{id} */
export function deleteDebt(id: number | string): Promise<void> {
  return api.delete(`/debts/${encodeURIComponent(id)}`)
}
