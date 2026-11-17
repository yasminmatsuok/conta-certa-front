/**
 * Análises financeiras calculadas pela API Java (rotas /usuarios/{id}/... e /dividas/{id}/...).
 * Os nomes dos campos são os da API, em português. Só aparecem aqui os campos que as telas usam.
 */

export type FinancialSituation = 'CONFORTAVEL' | 'ATENCAO' | 'EM_RISCO' | 'INADIMPLENTE'

/** GET /usuarios/{id}/situacao */
export interface Situation {
  situacao: FinancialSituation
  /** Ex.: "Em risco" */
  titulo: string
  /** Explicação e orientação */
  descricao: string
  /** Nota de saúde financeira, 0 a 100 */
  nota: number
  rendaMedia: number | null
  /** EXTRATO (média das entradas) ou DECLARADA (cadastro) */
  origemRenda: 'EXTRATO' | 'DECLARADA' | null
  gastosEssenciaisMedia: number
  totalParcelasMes: number
  /** Quanto da renda as parcelas comem, em % */
  comprometimentoPercentual: number | null
  totalDividas: number
  dividasAtivas: number
  dividasAtrasadas: number
  saldoContas: number
  totalCofres: number
  /** O que somou ou tirou pontos da nota */
  detalhesNota: { motivo: string; pontos: number }[]
  comoCalculamos: string
  avisos: string[]
}

/** Resultado da simulação de um método de quitação */
export interface PayoffSimulation {
  metodo: 'AVALANCHE' | 'BOLA_DE_NEVE'
  quitaTudo: boolean
  meses: number
  totalPago: number
  totalJuros: number
}

/** GET /usuarios/{id}/consultoria */
export interface Consulting {
  rendaMedia: number | null
  gastosEssenciaisMedia: number
  /** Renda média - gastos essenciais */
  folga: number | null
  /** 40% da renda */
  limiteDaRenda: number | null
  /** O menor entre a folga e o limite */
  valorSugeridoParaDividas: number | null
  totalParcelasMes: number
  avalanche: PayoffSimulation | null
  bolaDeNeve: PayoffSimulation | null
  comparacao: { economiaAvalanche: number; mesesDeDiferenca: number; mensagem: string } | null
  sugestoesDeCorte: { categoria: string; gastoUltimoMes: number; economiaCortandoMetade: number }[]
  comoCalculamos: string
  avisos: string[]
}

export interface CategorySpending {
  categoriaId: number
  categoria: string
  essencial: boolean
  total: number
  /** Quanto o gasto representa da renda, em % (nulo se a renda é desconhecida) */
  percentualDaRenda: number | null
}

/** GET /usuarios/{id}/resumo-mensal?mes=AAAA-MM */
export interface MonthlySummary {
  mes: string
  totalEntradas: number
  totalSaidas: number
  saldoDoMes: number
  gastosPorCategoria: CategorySpending[]
  top3NaoEssenciais: CategorySpending[]
  /** Ex.: "Cortando metade dos gastos com Delivery, você quita suas dívidas 3 meses antes." */
  fraseDeImpacto: string | null
}

/** GET /usuarios/{id}/custo-em-horas?valor= */
export interface CostInHours {
  valor: number
  valorHora: number
  /** Ex.: "7h30" */
  horasFormatadas: string
  /** Ex.: "Essa compra custa 7h30 do seu trabalho" */
  mensagem: string
}

/** GET /usuarios/{id}/pagar-ou-investir */
export interface PayOrInvest {
  /** % ao ano */
  selicAnual: number
  /** Quanto o Tesouro Selic rende por mês, já sem IR, em % */
  rendimentoMensalLiquidoPercentual: number
  dividas: {
    dividaId: number
    credor: string
    tipoDescricao: string
    taxaDividaMensal: number
    vezesMaisQueInvestir: number | null
    recomendacao: 'QUITAR' | 'INVESTIR'
    mensagem: string
  }[]
  comoCalculamos: string
  indicadoresDesatualizados: boolean
  avisos: string[]
}

/** Um mês da projeção de uma dívida */
export interface ProjectionMonth {
  mes: number
  saldoInicial: number
  juros: number
  parcela: number
  saldoFinal: number
}

/** GET /dividas/{id}/projecao?meses=12 */
export interface DebtProjection {
  meses: number
  pagandoAParcela: ProjectionMonth[]
  semPagarNada: ProjectionMonth[]
  totalJurosPagando: number
  saldoFinalPagando: number
  saldoFinalSemPagar: number
  /** Quanto a dívida cresce se nada for pago */
  crescimentoSemPagar: number
  encargosAtraso: {
    diasAtraso: number
    multa: number
    jurosMora: number
    valorParaQuitarHoje: number
  } | null
  avisos: string[]
}

/** Corpo do POST /dividas/{id}/renegociacao/simular (a proposta que o credor ofereceu) */
export interface RenegotiationInput {
  /** Desconto para pagar à vista, em % (0 se não houver) */
  percentualDescontoAVista: number
  novaQtParcelas: number
  /** % ao mês */
  novaTaxaMensal: number
}

export interface RenegotiationScenario {
  codigo: 'CONTINUAR' | 'A_VISTA' | 'NOVO_PARCELAMENTO'
  nome: string
  /** false = a parcela atual nem cobre os juros: a dívida nunca acaba */
  quitavel: boolean
  totalAPagar: number | null
  parcelas: number | null
  valorParcela: number | null
  totalJuros: number | null
  observacao: string | null
}

/** Resposta do POST /dividas/{id}/renegociacao/simular */
export interface Renegotiation {
  continuarComoEsta: RenegotiationScenario
  aVistaComDesconto: RenegotiationScenario
  novoParcelamento: RenegotiationScenario
  melhorCenario: RenegotiationScenario['codigo']
  economia: number | null
  mensagem: string
}
