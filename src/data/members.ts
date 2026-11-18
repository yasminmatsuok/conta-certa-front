import type { Member } from '../types/member'

/*
 * ============================ PREENCHER ============================
 * Troque os dados de exemplo abaixo pelos dados reais do grupo.
 * - Um bloco { ... } por integrante; copie ou apague blocos conforme o tamanho do grupo.
 * - rm: só os números (ele vira o endereço /integrantes/RM).
 * - photo: coloque a imagem em public/integrantes/ e escreva o caminho,
 *   ex.: '/integrantes/123456.jpg'. Com null, aparecem as iniciais do nome.
 * - github e linkedin: endereço completo do perfil. Com '', o link não aparece.
 * ===================================================================
 */
export const MEMBERS: Member[] = [
  {
    rm: '570850', 
    name: 'Maria Vitória Cândida Carvalho',
    className: '1TDSPI',
    photo: '/integrantes/mavi.jpeg',
    github: 'https://github.com/mariav1110', 
    linkedin: 'https://www.linkedin.com/in/maria-vitoriac?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
  },
  {
    rm: '573351',
    name: 'Vinicius Soares Loureiro',
    className: '1TDSPY',
    photo: '/integrantes/vinicius.jpg',
    github: 'https://github.com/vinisl2510-sudo',
    linkedin: 'https://www.linkedin.com/in/vin%C3%ADcius-soares-loureiro-9bb96b34b/',
  },
  {
    rm: '000003', // PREENCHER
    name: 'Nome do Integrante 3', // PREENCHER
    className: 'Turma', // PREENCHER
    photo: null, // PREENCHER
    github: '', // PREENCHER
    linkedin: '', // PREENCHER
  },
]
