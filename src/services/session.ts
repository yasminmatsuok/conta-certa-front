import type { Session } from '../types/auth'

/** Guarda a sessão no navegador para a pessoa continuar logada ao recarregar a página */
const STORAGE_KEY = 'conta-certa:session'

function isSession(value: unknown): value is Session {
  return (
    typeof value === 'object' &&
    value !== null &&
    'token' in value &&
    typeof value.token === 'string' &&
    'userName' in value &&
    typeof value.userName === 'string' &&
    'userId' in value &&
    typeof value.userId === 'number'
  )
}

export function getSession(): Session | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) return null
    const parsed: unknown = JSON.parse(stored)
    // Sessão salva por uma versão antiga do site (sem userId) conta como deslogado
    return isSession(parsed) ? parsed : null
  } catch {
    // localStorage bloqueado ou conteúdo corrompido: trata como deslogado
    return null
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // sem localStorage a sessão vale só até recarregar a página
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nada a limpar
  }
}

/** Id de quem está logado. As telas do app só abrem com sessão (ver AppLayout), então ele sempre existe ali. */
export function getUserId(): number {
  const session = getSession()
  if (session === null) {
    throw new Error('Sua sessão terminou. Entre de novo.')
  }
  return session.userId
}
