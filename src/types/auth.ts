/** Corpo do POST /auth/login */
export interface LoginRequest {
  email: string
  password: string
}

/** Resposta do POST /auth/login (a API também devolve e-mail e CPF mascarado, que o front não usa) */
export interface LoginResponse {
  /** Id do usuário: monta as rotas /usuarios/{id}/... */
  id: number
  token: string
  userName: string
}

/** O que fica guardado no navegador depois do login */
export interface Session {
  /** Enviado nas próximas requisições em "Authorization: Bearer <token>" */
  token: string
  /** Nome da pessoa, para o avatar do cabeçalho */
  userName: string
  /** Id do usuário, para as rotas /usuarios/{id}/... (contas, cofres, análises) */
  userId: number
}

/** Corpo do POST /auth/cadastro (nomes de campo em português, como na API Java) */
export interface RegisterRequest {
  nome: string
  email: string
  /** Só os 11 números ou com máscara: a API aceita os dois */
  cpf: string
  senha: string
  /** Opcional: usada nas análises quando ainda não há entradas no extrato */
  rendaDeclarada?: number
}
