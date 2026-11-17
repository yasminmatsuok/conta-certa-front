import type { Account, Bank, BankCard, CardType, NewAccount, NewCard, SimulatedPurchase } from '../types/account'
import { api } from './api'
import { getUserId } from './session'

/** GET /bancos — catálogo de bancos para conectar */
export function listBanks(signal?: AbortSignal): Promise<Bank[]> {
  return api.get<Bank[]>('/bancos', signal)
}

/** GET /usuarios/{id}/contas — contas da pessoa logada */
export function listAccounts(signal?: AbortSignal): Promise<Account[]> {
  return api.get<Account[]>(`/usuarios/${getUserId()}/contas`, signal)
}

/** POST /usuarios/{id}/contas — conecta um banco (com dados simulados, se pedido) */
export function createAccount(account: NewAccount): Promise<Account> {
  return api.post<Account>(`/usuarios/${getUserId()}/contas`, account)
}

/** DELETE /contas/{id} — apaga a conta, os cartões e o extrato dela (as dívidas continuam) */
export function deleteAccount(id: number): Promise<void> {
  return api.delete(`/contas/${id}`)
}

/** GET /contas/{id}/cartoes */
export function listCards(accountId: number, signal?: AbortSignal): Promise<BankCard[]> {
  return api.get<BankCard[]>(`/contas/${accountId}/cartoes`, signal)
}

/** POST /contas/{id}/cartoes */
export function createCard(accountId: number, card: NewCard): Promise<BankCard> {
  return api.post<BankCard>(`/contas/${accountId}/cartoes`, card)
}

/** DELETE /cartoes/{id} */
export function deleteCard(id: number): Promise<void> {
  return api.delete(`/cartoes/${id}`)
}

/** POST /contas/{id}/transacoes/simular-compra — cria uma compra realista no cartão */
export function simulatePurchase(accountId: number, tipoCartao: CardType): Promise<SimulatedPurchase> {
  return api.post<SimulatedPurchase>(`/contas/${accountId}/transacoes/simular-compra`, { tipoCartao })
}
