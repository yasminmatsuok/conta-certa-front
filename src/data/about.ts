/*
 * Textos da página Sobre (/sobre).
 * Para trocar um texto, edite só este arquivo: a página lê tudo daqui.
 * Cada item de "paragraphs" vira um parágrafo; cada item de "points" vira um tópico.
 */

interface AboutSection {
  title: string
  paragraphs: string[]
  points: string[]
}

interface AboutSdg {
  /** Número do ODS, ex.: 1 */
  number: number
  name: string
  paragraphs: string[]
}

interface AboutContent {
  problem: AboutSection
  solution: AboutSection
  sdg: AboutSdg
}

export const ABOUT: AboutContent = {
  problem: {
    title: 'O problema',
    paragraphs: [
      'Muitas famílias brasileiras convivem com dívidas e não sabem dizer ao certo quanto devem, para quem devem e quanto pagam de juros em cada uma.',
      'Sem essa visão, é comum pagar só o mínimo do cartão, entrar no rotativo ou trocar uma dívida por outra ainda mais cara. Os juros se acumulam e a dívida cresce mesmo com a pessoa pagando todo mês.',
    ],
    points: [
      'Falta de controle sobre o que entra e o que sai no mês',
      'Juros muito acima da média do mercado, sem que a pessoa perceba',
      'Pouca informação, em linguagem simples, sobre como renegociar',
    ],
  },

  solution: {
    title: 'A solução',
    paragraphs: [
      'O Conta Certa é um aplicativo gratuito de controle financeiro pensado para quem quer sair das dívidas. Ele junta, em um só lugar, o dinheiro do mês, as dívidas e um plano para quitá-las.',
    ],
    points: [
      'Registro simples de entradas e saídas, com previsão do saldo no fim do mês',
      'Comparação da taxa de cada dívida com a média do mercado, com alerta quando os juros estão altos',
      'Plano de pagamento com a ordem das dívidas e a data prevista para ficar livre delas',
      'Trilhas curtas de aprendizado sobre renegociação, orçamento e direitos do consumidor',
    ],
  },

  // CONFIRMAR: troque pelo ODS que o grupo definiu no projeto, se for outro.
  sdg: {
    number: 1,
    name: 'Erradicação da pobreza',
    paragraphs: [
      'O Conta Certa se relaciona com o Objetivo de Desenvolvimento Sustentável 1 da ONU, que busca acabar com a pobreza em todas as suas formas.',
      'O endividamento com juros abusivos compromete a renda das famílias e dificulta sair de uma situação de vulnerabilidade. Ao dar clareza sobre as contas e um caminho para quitar as dívidas, o app ajuda as pessoas a recuperar o controle da própria renda.',
    ],
  },
}
