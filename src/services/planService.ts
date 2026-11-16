import type { Plan, PlanUpdate } from '../types/plan'
import { api } from './api'

/** GET /plan — plano atual, com a ordem de pagamento e a simulação de cada método */
export function getPlan(signal?: AbortSignal): Promise<Plan> {
  return api.get<Plan>('/plan', signal)
}

/** PUT /plan — salva valor mensal e método; devolve o plano recalculado */
export function updatePlan(update: PlanUpdate): Promise<Plan> {
  return api.put<Plan>('/plan', update)
}
