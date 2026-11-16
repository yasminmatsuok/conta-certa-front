export type DebtStatus = 'EM_DIA' | 'ATENCAO' | 'JUROS_ALTOS'

export interface Debt {
  id: number
  /** Ex.: "Cartão Banco A" */
  name: string
  /** Texto do tipo de crédito, ex.: "Rotativo do cartão" */
  type: string
  /** Ex.: "Banco A" */
  creditor: string
  /** Valor devido hoje */
  balance: number
  /** Taxa de juros, em % ao mês (14.5 = 14,5%) */
  monthlyRate: number
  /** Média do mercado para esse tipo de crédito, em % ao mês */
  marketRate: number
  /** Parcelas pagas e total; null quando a dívida não é parcelada */
  installmentsPaid: number | null
  installmentsTotal: number | null
  /** "AAAA-MM-DD" */
  nextDueDate: string
  minimumPayment: number
  status: DebtStatus
}

/**
 * Corpo do POST /debts e do PUT /debts/{id}: o que a pessoa preenche no formulário.
 * `marketRate` e `status` não entram: quem calcula é a API, a partir do tipo e da taxa.
 */
export type DebtInput = Omit<Debt, 'id' | 'marketRate' | 'status'>

export type DebtEventType ='PAGAMENTO' | 'CADASTRO'

/** Item do histórico da dívida */
export interface DebtEvent {
  id: number
  type: DebtEventType
  /** "AAAA-MM-DD" */
  date: string
  amount: number
}

/** Trilha de aprendizado sugerida para a dívida */
export interface RelatedTrack {
  id: number
  title: string
}

/** Resposta do GET /debts/{id} */
export interface DebtDetail extends Debt {
  history: DebtEvent[]
  relatedTrack: RelatedTrack | null
}
