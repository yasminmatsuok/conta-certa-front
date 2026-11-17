import type { UserProfile, UserProfileUpdate } from '../types/user'
import { api } from './api'
import { getSession, getUserId, saveSession } from './session'

/** GET /usuarios/{id} — dados de quem está logado */
export function getProfile(signal?: AbortSignal): Promise<UserProfile> {
  return api.get<UserProfile>(`/usuarios/${getUserId()}`, signal)
}

/** PUT /usuarios/{id} — atualiza nome, e-mail, renda e horas; o nome novo vai também para o avatar */
export async function updateProfile(update: UserProfileUpdate): Promise<UserProfile> {
  const profile = await api.put<UserProfile>(`/usuarios/${getUserId()}`, update)
  const session = getSession()
  if (session) saveSession({ ...session, userName: profile.nome })
  return profile
}
