/*
 * Perguntas da página FAQ (/faq).
 * Para adicionar, tirar ou trocar uma pergunta, edite só este arquivo.
 */

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'O Conta Certa é gratuito?',
    answer:
      'Sim. O Conta Certa foi pensado para ser gratuito, simples e acessível para quem quer organizar o dinheiro e sair das dívidas.',
  },
  {
    question: 'Preciso conectar minha conta do banco?',
    answer:
      'Não. Você mesmo registra o que entrou, o que saiu e as suas dívidas. O app não acessa sua conta bancária.',
  },
  {
    question: 'Como o app sabe que os juros da minha dívida estão altos?',
    answer:
      'Ao cadastrar uma dívida, você informa a taxa de juros ao mês. O app compara essa taxa com a média do mercado para o mesmo tipo de crédito, com base nos dados do Banco Central, e avisa quando a sua está acima.',
  },
  {
    question: 'Qual a diferença entre os métodos Avalanche e Bola de neve?',
    answer:
      'No Avalanche você paga primeiro a dívida com o juro mais alto, o que costuma economizar mais. No Bola de neve você paga primeiro a menor dívida, o que dá a sensação de progresso mais cedo. Nos dois, você paga o mínimo em todas e coloca o que sobrar na dívida da vez.',
  },
  {
    question: 'A previsão de saldo do fim do mês é garantida?',
    answer:
      'Não. A previsão é uma estimativa feita por um modelo de IA a partir das suas transações. Ela serve como alerta para você se planejar, mas o saldo real depende do que acontecer até o fim do mês.',
  },
  {
    question: 'O Conta Certa renegocia minhas dívidas por mim?',
    answer:
      'Não. O app mostra quais dívidas estão caras e ensina, nas trilhas de aprendizado, como conversar com o banco e avaliar uma proposta. A negociação é feita por você com o credor.',
  },
]
