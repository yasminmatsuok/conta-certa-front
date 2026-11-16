export type PlanMethod = 'AVALANCHE' | 'BOLA_DE_NEVE'

/** Uma dívida na ordem de pagamento */
export interface PlanStep {
  /** 1 = primeira a quitar */
  position: number
  debtId: number
  debtName: string
  /** Mês previsto de quitação: "AAAA-MM" */
  payoffDate: string
  balance: number
  /** Quanto dessa dívida já foi pago, de 0 a 100 */
  progressPercent: number
}

/** Simulação de um método, para a pessoa comparar */
export interface PlanOption {
  method: PlanMethod
  /** "AAAA-MM" */
  debtFreeDate: string
  /** Total de juros pagos até o fim do plano */
  totalInterest: number
  recommended: boolean
}

/** Resposta do GET /plan e do PUT /plan */
export interface Plan {
  /** Quanto a pessoa pode pagar por mês */
  monthlyBudget: number
  method: PlanMethod
  /** "AAAA-MM" */
  debtFreeDate: string
  /** 0 a 100 */
  progressPercent: number
  paidAmount: number
  totalAmount: number
  order: PlanStep[]
  options: PlanOption[]
}

/** Corpo do PUT /plan */
export interface PlanUpdate {
  monthlyBudget: number
  method: PlanMethod
}
