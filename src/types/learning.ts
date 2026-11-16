export interface Lesson {
  id: number
  /** Ex.: "O que falar com o banco" */
  title: string
  /** Ex.: "Perguntas e direitos do consumidor" */
  summary: string
  completed: boolean
}

/** Item do GET /learning/tracks */
export interface LearningTrack {
  id: number
  /** Ex.: "Como renegociar uma dívida" */
  title: string
  /** Duração média de cada lição, em minutos */
  minutesPerLesson: number
  /** Na ordem em que devem ser feitas */
  lessons: Lesson[]
  /** Texto da caixa "Dica"; null se a trilha não tiver */
  tip: string | null
}
