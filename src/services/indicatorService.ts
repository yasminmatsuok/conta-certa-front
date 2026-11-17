import type { Indicators, TreasurySimulation, TreasurySimulationInput } from '../types/indicator'
import { api } from './api'

/** GET /indicadores — Selic, IPCA, dólar e juro real (dados reais do Banco Central) */
export function getIndicators(signal?: AbortSignal): Promise<Indicators> {
  return api.get<Indicators>('/indicadores', signal)
}

/** POST /investimentos/tesouro-selic/simular — só simula, não grava nada */
export function simulateTreasury(input: TreasurySimulationInput): Promise<TreasurySimulation> {
  return api.post<TreasurySimulation>('/investimentos/tesouro-selic/simular', input)
}
