import type { LoginRequest, Session } from '../types/auth'
import { api } from './api'
import { saveSession } from './session'

/** POST /auth/login — entra e guarda a sessão devolvida pela API */
export async function login(credentials: LoginRequest): Promise<Session> {
  const session = await api.post<Session>('/auth/login', credentials)
  saveSession(session)
  return session
}
