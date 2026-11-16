import type { TransactionCategory } from './transaction'

/** Ponto do gráfico "Saldo ao longo do mês" */
export interface BalancePoint {
  /** "AAAA-MM-DD" */
  date: string
  balance: number
}

export interface CategoryExpense {
  category: TransactionCategory
  total: number
}

export interface UpcomingPayment {
  id: number
  /** Dívida ligada ao pagamento, se houver */
  debtId: number | null
  /** Ex.: "Crediário Loja Y" */
  title: string
  /** Ex.: "Parcela 9 de 12" */
  description: string
  /** "AAAA-MM-DD" */
  dueDate: string
  amount: number
}

/** Aviso "Juros acima da média" */
export interface InterestAlert {
  debtId: number
  debtName: string
  /** Taxa da dívida, em % ao mês (14.5 = 14,5%) */
  monthlyRate: number
  /** Média do mercado, em % ao mês */
  marketRate: number
}

export interface DashboardDebts {
  count: number
  total: number
  /** Quantas dívidas estão com juros acima da média */
  alerts: number
}

export interface DashboardPlan {
  /** Mês em que a pessoa fica livre das dívidas: "AAAA-MM" */
  debtFreeDate: string
  /** 0 a 100 */
  progressPercent: number
}

export interface DashboardLearning {
  trackTitle: string
  completedLessons: number
  totalLessons: number
}

/** Resposta do GET /dashboard?month=AAAA-MM */
export interface Dashboard {
  userName: string
  balance: number
  monthIncome: number
  monthExpense: number
  /** Saldo previsto para o fim do mês (modelo de IA); null se não houver previsão */
  forecastBalance: number | null
  /** Saldo real, do dia 1 até hoje */
  balanceHistory: BalancePoint[]
  /** Saldo previsto, de amanhã até o fim do mês */
  balanceForecast: BalancePoint[]
  expensesByCategory: CategoryExpense[]
  upcomingPayments: UpcomingPayment[]
  interestAlert: InterestAlert | null
  debts: DashboardDebts
  plan: DashboardPlan | null
  learning: DashboardLearning | null
}
