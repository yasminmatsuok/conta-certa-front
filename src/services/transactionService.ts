import type { NewTransaction, Transaction } from '../types/transaction'
import { api } from './api'

/** GET /transactions?month=AAAA-MM — entradas e saídas do mês */
export function listTransactions(month: string, signal?: AbortSignal): Promise<Transaction[]> {
  return api.get<Transaction[]>(`/transactions?month=${encodeURIComponent(month)}`, signal)
}

/** POST /transactions — devolve a transação criada, já com id */
export function createTransaction(transaction: NewTransaction): Promise<Transaction> {
  return api.post<Transaction>('/transactions', transaction)
}
