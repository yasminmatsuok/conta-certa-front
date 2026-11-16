export interface Member {
  /** Só os números do RM; é o que aparece no endereço /integrantes/:rm */
  rm: string
  name: string
  /** Turma, ex.: "1TDSPA" */
  className: string
  /** Caminho da foto dentro de public/, ex.: "/integrantes/123456.jpg"; null mostra as iniciais */
  photo: string | null
  /** Endereço completo do perfil, ex.: "https://github.com/usuario"; '' esconde o link */
  github: string
  /** Endereço completo do perfil, ex.: "https://www.linkedin.com/in/usuario"; '' esconde o link */
  linkedin: string
}
