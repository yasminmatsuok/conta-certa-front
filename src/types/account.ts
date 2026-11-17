/**
 * Contas bancárias, cartões e bancos.
 * Os nomes dos campos estão em português porque são os da API Java (rotas /bancos, /contas, /cartoes).
 */

/** Item do GET /bancos */
export interface Bank {
  id: number
  nome: string
  codigoCompe: string
}

/** Item do GET /usuarios/{id}/contas */
export interface Account {
  id: number
  bancoId: number
  bancoNome: string
  agencia: string
  numeroConta: string
  saldo: number
  /** true = cartões, extrato e dívidas foram gerados pela API (Open Finance simulado) */
  dadosSimulados: boolean
  /** "AAAA-MM-DDTHH:MM:SS" */
  dataVinculo: string
  /** Só vem na resposta do cadastro com importarDadosSimulados = true */
  importacao?: { cartoes: number; transacoes: number; dividas: number }
}

/** Corpo do POST /usuarios/{id}/contas ("Conectar banco") */
export interface NewAccount {
  bancoId: number
  /** 4 números */
  agencia: string
  /** Número com dígito, ex.: "12345-6" */
  numeroConta: string
  importarDadosSimulados: boolean
}

export type CardType = 'CREDITO' | 'DEBITO'

/** Item do GET /contas/{id}/cartoes. No débito, limite, limiteDisponivel e diaVencimento vêm nulos. */
export interface BankCard {
  id: number
  contaId: number
  tipo: CardType
  /** 4 últimos números */
  numeroFinal: string
  limite: number | null
  faturaAtual: number
  limiteDisponivel: number | null
  diaVencimento: number | null
}

/** Corpo do POST /contas/{id}/cartoes */
export interface NewCard {
  tipo: CardType
  numeroFinal: string
  /** Obrigatório no crédito */
  limite?: number
  /** De 1 a 28, só no crédito */
  diaVencimento?: number
}

/** Resposta do POST /contas/{id}/transacoes/simular-compra (só o que a tela usa) */
export interface SimulatedPurchase {
  id: number
  descricao: string
  categoriaNome: string
  valor: number
  meio: string
}
