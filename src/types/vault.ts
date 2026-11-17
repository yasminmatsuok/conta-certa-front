/** Cofres (metas de economia). Campos em português, como na API Java (rotas /usuarios/{id}/cofres e /cofres). */

/** Item do GET /usuarios/{id}/cofres. Os campos de progresso vêm nulos quando o cofre não tem meta ou prazo. */
export interface Vault {
  id: number
  nome: string
  valorMeta: number | null
  /** "AAAA-MM-DD" */
  dataLimite: string | null
  valorGuardado: number
  /** 0 a 100 */
  percentualConcluido: number | null
  valorFaltante: number | null
  mesesRestantes: number | null
  /** Quanto guardar por mês para bater a meta no prazo */
  valorMensalNecessario: number | null
  metaAtingida: boolean
  prazoVencido: boolean
}

/** Corpo do POST /usuarios/{id}/cofres */
export interface NewVault {
  nome: string
  valorMeta?: number
  /** "AAAA-MM-DD", no futuro */
  dataLimite?: string
}

/** Corpo do POST /cofres/{id}/depositos e /cofres/{id}/resgates */
export interface VaultMovement {
  /** Conta de onde sai (depósito) ou para onde volta (resgate) o dinheiro */
  contaId: number
  valor: number
}
