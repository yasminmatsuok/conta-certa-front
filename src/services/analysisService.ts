import type {
  Consulting,
  CostInHours,
  DebtProjection,
  MonthlySummary,
  PayOrInvest,
  Renegotiation,
  RenegotiationInput,
  Situation,
} from '../types/analysis'
import { api } from './api'
import { getUserId } from './session'

/** GET /usuarios/{id}/situacao — situação financeira e nota de saúde */
export function getSituation(signal?: AbortSignal): Promise<Situation> {
  return api.get<Situation>(`/usuarios/${getUserId()}/situacao`, signal)
}

/** GET /usuarios/{id}/consultoria — quanto pagar por mês e em que ordem */
export function getConsulting(signal?: AbortSignal): Promise<Consulting> {
  return api.get<Consulting>(`/usuarios/${getUserId()}/consultoria`, signal)
}

/** GET /usuarios/{id}/resumo-mensal?mes=AAAA-MM */
export function getMonthlySummary(month: string, signal?: AbortSignal): Promise<MonthlySummary> {
  return api.get<MonthlySummary>(`/usuarios/${getUserId()}/resumo-mensal?mes=${encodeURIComponent(month)}`, signal)
}

/** GET /usuarios/{id}/custo-em-horas?valor= — quantas horas de trabalho custa uma compra */
export function getCostInHours(value: number): Promise<CostInHours> {
  return api.get<CostInHours>(`/usuarios/${getUserId()}/custo-em-horas?valor=${value}`)
}

/** GET /usuarios/{id}/pagar-ou-investir — cada dívida comparada com o Tesouro Selic */
export function getPayOrInvest(signal?: AbortSignal): Promise<PayOrInvest> {
  return api.get<PayOrInvest>(`/usuarios/${getUserId()}/pagar-ou-investir`, signal)
}

/** GET /dividas/{id}/projecao?meses= — a dívida mês a mês, pagando a parcela x sem pagar nada */
export function getDebtProjection(debtId: number, months: number, signal?: AbortSignal): Promise<DebtProjection> {
  return api.get<DebtProjection>(`/dividas/${debtId}/projecao?meses=${months}`, signal)
}

/** POST /dividas/{id}/renegociacao/simular — só simula, não altera a dívida */
export function simulateRenegotiation(debtId: number, proposal: RenegotiationInput): Promise<Renegotiation> {
  return api.post<Renegotiation>(`/dividas/${debtId}/renegociacao/simular`, proposal)
}
