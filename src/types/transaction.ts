export type TransactionType = 'ENTRADA' | 'SAIDA'

export type TransactionCategory =
  | 'MERCADO'
  | 'TRANSPORTE'
  | 'MORADIA'
  | 'CONTAS'
  | 'LAZER'
  | 'TRABALHO'
  | 'OUTROS'

export interface Transaction {
  id: number
  type: TransactionType
  /** Ex.: "Mercado Bom Preço" */
  description: string
  category: TransactionCategory
  /** Sempre positivo; o sinal vem de `type` */
  amount: number
  /** "AAAA-MM-DD" */
  date: string
  /** Repetir todo mês */
  recurring: boolean
}

/** Corpo do POST /transactions */
export type NewTransaction = Omit<Transaction, 'id'>
