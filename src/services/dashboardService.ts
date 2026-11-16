import type { Dashboard } from '../types/dashboard'
import { api } from './api'

/** GET /dashboard?month=AAAA-MM — tudo o que a tela Início mostra */
export function getDashboard(month: string, signal?: AbortSignal): Promise<Dashboard> {
  return api.get<Dashboard>(`/dashboard?month=${encodeURIComponent(month)}`, signal)
}
