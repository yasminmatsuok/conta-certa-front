/** Dados do usuário logado (GET/PUT /usuarios/{id}). Campos em português, como na API Java. */
export interface UserProfile {
  id: number
  nome: string
  email: string
  /** Ex.: "***.456.789-**" */
  cpfMascarado: string
  /** Renda mensal informada pela pessoa (nula se não informou) */
  rendaDeclarada: number | null
  /** Horas de trabalho por mês: base do "quanto essa compra custa em horas" */
  horasTrabalhoMes: number
}

/** Corpo do PUT /usuarios/{id} */
export interface UserProfileUpdate {
  nome: string
  email: string
  rendaDeclarada: number | null
  horasTrabalhoMes: number
}
