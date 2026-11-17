import type { LoginRequest, LoginResponse, RegisterRequest, Session } from '../types/auth'

import { api } from './api'
import { saveSession } from './session'

/** POST /auth/login — entra e guarda a sessão devolvida pela API */
export async function login(credentials: LoginRequest): Promise<Session> {
  const response = await api.post<LoginResponse>('/auth/login', credentials)
  const session: Session = { token: response.token, userName: response.userName, userId: response.id }
  saveSession(session)
  return session
}

/** POST /auth/cadastro — só cria a conta; quem chama decide se já faz o login em seguida */
export async function register(data: RegisterRequest): Promise<void> {
  await api.post<unknown>('/auth/cadastro', data)
}
