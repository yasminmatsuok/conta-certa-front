# Conta Certa

Aplicação web de controle financeiro e plano para sair das dívidas, desenvolvida para a **Global Solution 2026/2 · CitizenTech** da FIAP (Front-End Design Engineering).

## Objetivo

Ajudar o cidadão a entender para onde vai o seu dinheiro e a deixar de pagar juros abusivos. O Conta Certa permite:

- registrar entradas e saídas e ver o saldo ao longo do mês;
- cadastrar dívidas e comparar a taxa de juros com a média do mercado;
- montar um plano de pagamento (métodos avalanche e bola de neve);
- aprender conceitos de educação financeira em trilhas curtas.

**ODS relacionado:** [PREENCHER: número e nome do ODS escolhido pelo grupo, ex.: ODS 10 – Redução das Desigualdades]

## Links

| Item | Link |
| --- | --- |
| Site publicado (Vercel) | https://conta-certa-front-eta.vercel.app/ |
| Repositório (GitHub) | https://github.com/yasminmatsuok/conta-certa-front |
| API Java (Render) | [PREENCHER: URL da API] |
| Vídeo (YouTube, até 3 min) | [PREENCHER: link do vídeo] |

## Tecnologias

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Fetch API (sem Axios ou outras bibliotecas de requisição)
- Deploy na Vercel

## Páginas

**Institucionais**

| Rota | Descrição |
| --- | --- |
| `/` | Home |
| `/integrantes` | Lista de integrantes |
| `/integrantes/:rm` | Detalhe do integrante (rota com parâmetro) |
| `/sobre` | Problema, solução e ODS |
| `/faq` | Perguntas frequentes |
| `/contato` | Formulário de contato |
| `/entrar` | Login |
| `/cadastro` | Criar conta |

**Solução**

| Rota | Descrição |
| --- | --- |
| `/app` | Início: resumo financeiro e gráfico de saldo |
| `/app/transacoes` | Lista de transações e formulário de nova transação |
| `/app/dividas` | Minhas dívidas |
| `/app/dividas/nova` | Cadastro de dívida |
| `/app/dividas/:id` | Detalhe da dívida (rota com parâmetro) |
| `/app/dividas/:id/editar` | Edição de dívida |
| `/app/plano` | Plano de pagamento |
| `/app/aprender` | Trilhas de aprendizado |
| `/app/contas` | Bancos conectados, cartões e "simular compra" |
| `/app/cofres` | Cofres (metas de economia), depósitos e resgates |
| `/app/saude` | Nota de saúde financeira, consultoria, resumo do mês e custo em horas |
| `/app/simuladores` | Indicadores do Banco Central, "pagar ou investir" e Tesouro Selic |
| `/app/mais` | Atalho para as telas acima no mobile |

As telas do app (`/app/...`) exigem login: sem sessão, o site leva para `/entrar`.

## Estrutura de pastas

```
src/
├── components/   componentes reutilizáveis
├── pages/        páginas da aplicação
├── services/     chamadas à API com Fetch
├── types/        interfaces TypeScript
├── data/         dados estáticos (integrantes, Sobre, FAQ)
├── hooks/        hooks personalizados
└── routes/       configuração de rotas
```

## Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
# 1. clonar o repositório
git clone https://github.com/yasminmatsuok/conta-certa-front.git
cd conta-certa-front

# 2. instalar as dependências
npm install

# 3. configurar a URL da API
cp .env.example .env
# edite o .env e preencha VITE_API_URL com a URL da API Java

# 4. rodar em desenvolvimento
npm run dev
```

A aplicação abre em `http://localhost:5173`.

Para gerar a versão de produção: `npm run build`.

## Integração com a API

Todas as chamadas HTTP ficam em `src/services` e usam a Fetch API. A URL base vem da variável `VITE_API_URL`. O contrato esperado dos endpoints está descrito em [`ENDPOINTS.md`](./ENDPOINTS.md).

Na Vercel, a variável `VITE_API_URL` é configurada em Settings > Environment Variables.

## Responsividade

Testada nas resoluções de mobile (390 × 844), tablet (768 × 1024) e desktop (1440 × 900).

## Integrantes

| Nome | RM | Turma | GitHub |
| --- | --- | --- | --- |
| Yasmin de Oliveira Matsuok | 573083 |1TDSPI | [@yasminmatsuok](https://github.com/yasminmatsuok) |
| Vinicius Soares Loureiro | 573351 | 1TDSPY | [@vinisl2510-sudo](https://github.com/vinisl2510-sudo) |
| Maria Vitória Cândida Carvalho| 570850 | 1TDSPI | [PREENCHER] |

## Contato

yasminomatsuok@gmail.com

---

Projeto acadêmico · FIAP · Global Solution 2026/2
