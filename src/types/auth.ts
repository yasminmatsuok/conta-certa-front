/** Corpo do POST /auth/login */
export interface LoginRequest {
  email: string
  password: string
}

/** Resposta do POST /auth/login; também é o que fica guardado no navegador */
export interface Session {
  /** Enviado nas próximas requisições em "Authorization: Bearer <token>" */
  token: string
  /** Nome da pessoa, para o avatar do cabeçalho */
  userName: string
}
