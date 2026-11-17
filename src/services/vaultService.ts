import type { NewVault, Vault, VaultMovement } from '../types/vault'
import { api } from './api'
import { getUserId } from './session'

/** Resposta do depósito/resgate: a API devolve o movimento com o cofre já atualizado */
interface MovementResponse {
  cofre: Vault
}

/** GET /usuarios/{id}/cofres */
export function listVaults(signal?: AbortSignal): Promise<Vault[]> {
  return api.get<Vault[]>(`/usuarios/${getUserId()}/cofres`, signal)
}

/** POST /usuarios/{id}/cofres */
export function createVault(vault: NewVault): Promise<Vault> {
  return api.post<Vault>(`/usuarios/${getUserId()}/cofres`, vault)
}

/** DELETE /cofres/{id} */
export function deleteVault(id: number): Promise<void> {
  return api.delete(`/cofres/${id}`)
}

/** POST /cofres/{id}/depositos — tira da conta e guarda no cofre; devolve o cofre atualizado */
export async function depositToVault(id: number, movement: VaultMovement): Promise<Vault> {
  return (await api.post<MovementResponse>(`/cofres/${id}/depositos`, movement)).cofre
}

/** POST /cofres/{id}/resgates — tira do cofre e devolve para a conta; devolve o cofre atualizado */
export async function withdrawFromVault(id: number, movement: VaultMovement): Promise<Vault> {
  return (await api.post<MovementResponse>(`/cofres/${id}/resgates`, movement)).cofre
}
