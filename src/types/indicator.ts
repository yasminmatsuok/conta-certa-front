/** Indicadores do Banco Central e simulador do Tesouro Selic (campos em português, como na API Java). */

export interface Indicator {
  nome: string
  /** Ex.: "% ao ano", "R$" */
  unidade: string
  valor: number
  /** "AAAA-MM-DD": data a que o valor se refere */
  dataReferencia: string
}

/** GET /indicadores */
export interface Indicators {
  selic: Indicator
  ipcaMensal: Indicator
  ipca12Meses: Indicator
  dolar: Indicator
  /** Quanto a Selic rende acima da inflação, em % */
  juroReal: number
  juroRealExplicacao: string
  /** "AAAA-MM-DDTHH:MM:SS" */
  atualizadoEm: string
  /** true = Banco Central fora do ar; estes são os últimos dados salvos */
  desatualizado: boolean
  fonte: string
}

/** Corpo do POST /investimentos/tesouro-selic/simular */
export interface TreasurySimulationInput {
  valorInicial: number
  aporteMensal: number
  meses: number
  /** Opcional, % ao ano. Sem ele, a API usa a Selic atual do Banco Central. */
  selicAnual?: number
}

/** Resposta do POST /investimentos/tesouro-selic/simular (só o que a tela usa) */
export interface TreasurySimulation {
  meses: number
  selicAnual: number
  totalInvestido: number
  valorBrutoFinal: number
  impostoDeRenda: number
  valorLiquidoFinal: number
  rendimentoLiquido: number
  rentabilidadeLiquidaPercentual: number
  /** Valor final trazido a preços de hoje (descontada a inflação) */
  valorFinalEmDinheiroDeHoje: number
  origemDasTaxas: string
}
