# Endpoints que o front espera da API Java

Este arquivo lista tudo o que o front do Conta Certa chama hoje. Os nomes de campos são os das
interfaces em `src/types`; as chamadas estão em `src/services`. Se a API usar outro nome ou formato,
é só avisar que o ajuste é feito nesses dois lugares.

## Convenções

- **URL base:** vem de `VITE_API_URL` no `.env` do front (padrão `http://localhost:8080`). Os caminhos abaixo são relativos a ela.
- **Formato:** JSON nas requisições e nas respostas (`Content-Type: application/json`).
- **Datas:** `"AAAA-MM-DD"` (ex.: `"2026-11-16"`), como `LocalDate`.
- **Meses:** `"AAAA-MM"` (ex.: `"2028-03"`), como `YearMonth`.
- **Dinheiro:** número em reais (ex.: `312.40`), não texto.
- **Taxas de juros:** número em % ao mês (`14.5` significa 14,5% a.m.).
- **IDs:** números.
- **Autenticação:** depois do login, o front envia `Authorization: Bearer <token>` em todas as requisições. É por esse token que a API sabe de quem são os dados; nenhum endpoint recebe id de usuário.
- **Erros:** qualquer status fora de 2xx é tratado como erro. Se o corpo tiver um campo `message` (texto), é ele que aparece na tela, ex.: `{ "message": "E-mail ou senha incorretos." }`.
- **CORS:** a API precisa liberar a origem do front (`http://localhost:5173` em desenvolvimento), os métodos `GET, POST, PUT, DELETE` e os cabeçalhos `Authorization` e `Content-Type`.

## Resumo

| Método | Caminho | Tela | Para quê |
| --- | --- | --- | --- |
| POST | `/contact` | Contato (`/contato`) | Enviar mensagem do formulário de contato |
| POST | `/auth/login` | Entrar (`/entrar`) | Entrar com e-mail e senha |
| GET | `/dashboard?month=AAAA-MM` | Início (`/app`) | Resumo do mês |
| GET | `/transactions?month=AAAA-MM` | Transações (`/app/transacoes`) | Listar transações do mês |
| POST | `/transactions` | Transações | Criar transação |
| GET | `/debts` | Minhas dívidas (`/app/dividas`) | Listar dívidas |
| POST | `/debts` | Cadastrar dívida (`/app/dividas/nova`) | Criar dívida |
| GET | `/debts/{id}` | Detalhe da dívida (`/app/dividas/:id`) | Uma dívida com histórico |
| PUT | `/debts/{id}` | Editar dívida (`/app/dividas/:id/editar`) | Atualizar dívida |
| DELETE | `/debts/{id}` | Detalhe da dívida | Excluir dívida |
| GET | `/plan` | Meu plano (`/app/plano`) | Plano atual |
| PUT | `/plan` | Meu plano | Salvar valor mensal e método |
| GET | `/learning/tracks` | Aprender (`/app/aprender`) | Listar trilhas e lições |
| POST | `/learning/tracks/{trackId}/lessons/{lessonId}/complete` | Aprender | Concluir lição |

---

## Contato (site público)

### `POST /contact`

Chamado sem login (sem cabeçalho `Authorization`, a não ser que a pessoa já tenha entrado).

Corpo enviado:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `name` | string | 2 a 80 caracteres (o front já valida) |
| `email` | string | Formato de e-mail (o front já valida) |
| `message` | string | 10 a 1000 caracteres (o front já valida) |

Resposta: qualquer 2xx, com ou sem corpo (o front não lê o corpo). Depois disso a tela mostra
"Mensagem enviada!".

As outras páginas do site público (Home, Integrantes, Sobre e FAQ) não chamam a API: os textos e
os dados dos integrantes ficam em `src/data`.

---

## Entrar

### `POST /auth/login`

Corpo enviado:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `email` | string | |
| `password` | string | |

Resposta (200):

| Campo | Tipo | Observação |
| --- | --- | --- |
| `token` | string | Volta em `Authorization: Bearer <token>` nas próximas requisições |
| `userName` | string | Nome da pessoa; vira as iniciais do avatar |

Credenciais erradas: responder com erro (ex.: 401) e `message`.

"Sair" não chama a API: o front só apaga o token guardado no navegador.

---

## Início

### `GET /dashboard?month=AAAA-MM`

Resposta (200): um objeto.

| Campo | Tipo | Uso na tela |
| --- | --- | --- |
| `userName` | string | "Olá, Márcia!" (o front usa o primeiro nome) |
| `balance` | número | Saldo atual |
| `monthIncome` | número | Entradas do mês |
| `monthExpense` | número | Saídas do mês |
| `forecastBalance` | número ou `null` | "Previsão fim do mês" (modelo de IA) |
| `balanceHistory` | lista de `{ date, balance }` | Linha verde do gráfico: saldo real do dia 1 até hoje |
| `balanceForecast` | lista de `{ date, balance }` | Linha tracejada: saldo previsto até o fim do mês |
| `expensesByCategory` | lista de `{ category, total }` | "Gastos por categoria" (`category` igual ao das transações) |
| `upcomingPayments` | lista (abaixo) | "Próximos pagamentos" |
| `interestAlert` | objeto (abaixo) ou `null` | Aviso "Juros acima da média" |
| `debts` | `{ count, total, alerts }` | Cartão "Minhas dívidas": quantidade, soma e quantas com juros altos |
| `plan` | `{ debtFreeDate, progressPercent }` ou `null` | Cartão "Meu plano" (`debtFreeDate` em `"AAAA-MM"`, progresso de 0 a 100) |
| `learning` | `{ trackTitle, completedLessons, totalLessons }` ou `null` | Cartão "Aprender" |

Item de `upcomingPayments`:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | número | |
| `debtId` | número ou `null` | Dívida ligada ao pagamento |
| `title` | string | Ex.: "Crediário Loja Y" |
| `description` | string | Ex.: "Parcela 9 de 12" |
| `dueDate` | data | |
| `amount` | número | |

`interestAlert`:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `debtId` | número | Usado no botão "Ver dívida" |
| `debtName` | string | Ex.: "Cartão Banco A" |
| `monthlyRate` | número | Taxa da dívida, % a.m. |
| `marketRate` | número | Média do mercado, % a.m. |

As listas podem vir vazias (`[]`); a tela mostra um aviso de "nenhum" em cada bloco.

---

## Transações

### `GET /transactions?month=AAAA-MM`

Resposta (200): lista de transações (pode ser `[]`). A ordem não importa; o front agrupa por dia.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | número | |
| `type` | `"ENTRADA"` ou `"SAIDA"` | |
| `description` | string | Ex.: "Mercado Bom Preço" |
| `category` | `"MERCADO"`, `"TRANSPORTE"`, `"MORADIA"`, `"CONTAS"`, `"LAZER"`, `"TRABALHO"` ou `"OUTROS"` | |
| `amount` | número | Sempre positivo; o sinal vem de `type` |
| `date` | data | |
| `recurring` | boolean | "Repetir todo mês" |

O filtro Todas / Entradas / Saídas é feito no front, sem nova chamada.

### `POST /transactions`

Corpo enviado: os mesmos campos acima, sem `id`. O front já valida: valor maior que zero,
descrição de 2 a 80 caracteres, categoria e data preenchidas. No formulário, entradas usam as
categorias `TRABALHO` e `OUTROS`; saídas usam as outras seis (incluindo `OUTROS`).

Resposta (200 ou 201): a transação criada, com `id`.

---

## Minhas dívidas

### `GET /debts`

Resposta (200): lista de dívidas ativas (pode ser `[]`).

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | número | |
| `name` | string | Ex.: "Cartão Banco A" |
| `type` | string | Texto pronto, ex.: "Rotativo do cartão" |
| `creditor` | string | Ex.: "Banco A" |
| `balance` | número | Valor devido hoje |
| `monthlyRate` | número | Taxa da dívida, % a.m. |
| `marketRate` | número | Média do mercado para esse tipo de crédito, % a.m. |
| `installmentsPaid` | número ou `null` | `null` quando não é parcelada |
| `installmentsTotal` | número ou `null` | `null` quando não é parcelada |
| `nextDueDate` | data | Próximo vencimento |
| `minimumPayment` | número | Pagamento mínimo |
| `status` | `"EM_DIA"`, `"ATENCAO"` ou `"JUROS_ALTOS"` | Define o selo do cartão |

Os totais do topo (total devido, dívidas ativas, com juros acima da média) são calculados no front
a partir dessa lista; "juros acima da média" conta as dívidas com `status` igual a `"JUROS_ALTOS"`.

---

## Cadastrar e editar dívida

### `POST /debts` e `PUT /debts/{id}`

Os dois recebem o mesmo corpo. A tela de edição carrega os dados atuais com `GET /debts/{id}`.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `name` | string | 2 a 60 caracteres |
| `type` | string | Tipo de crédito escolhido numa lista (abaixo) |
| `creditor` | string | 2 a 60 caracteres |
| `balance` | número | Maior que zero |
| `monthlyRate` | número | % ao mês, de 0 a 100 |
| `minimumPayment` | número | Zero ou mais |
| `nextDueDate` | data | |
| `installmentsPaid` | número ou `null` | Inteiro; `null` quando não é parcelada |
| `installmentsTotal` | número ou `null` | Inteiro, pelo menos 1 e não menor que as pagas; `null` quando não é parcelada |

O front já valida tudo isso antes de enviar.

Valores de `type` oferecidos no formulário: "Rotativo do cartão", "Fatura parcelada",
"Cheque especial", "Empréstimo pessoal", "Empréstimo consignado", "Crediário de loja",
"Financiamento" e "Outro". A lista fica em `src/components/debts/DebtForm.tsx`; se a API
preferir códigos ou outros nomes, é lá que se ajusta.

O front **não envia** `marketRate` nem `status`: a API calcula os dois (a média do mercado a
partir de `type`, e o status a partir da comparação com `monthlyRate`).

Resposta (200 ou 201): a dívida salva, no formato de um item do `GET /debts`, com `id`,
`marketRate` e `status`. O front usa o `id` para abrir a tela de detalhe em seguida.

---

## Detalhe da dívida

### `GET /debts/{id}`

Resposta (200): todos os campos de uma dívida (tabela acima), mais:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `history` | lista de `{ id, type, date, amount }` | `type` é `"PAGAMENTO"` ou `"CADASTRO"`; a tela mostra na ordem recebida (mais recente primeiro) |
| `relatedTrack` | `{ id, title }` ou `null` | Trilha de aprendizado sugerida; vira o botão "Trilha: {title}" |

Dívida inexistente: responder 404 com `message`.

A comparação de juros da tela usa `monthlyRate` e `marketRate`.

### `DELETE /debts/{id}`

Sem corpo. Resposta: 204 sem corpo (ou 200). Depois disso o front volta para a lista.

---

## Meu plano

### `GET /plan`

Resposta (200): um objeto.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `monthlyBudget` | número | "Quanto você pode pagar por mês?" |
| `method` | `"AVALANCHE"` ou `"BOLA_DE_NEVE"` | Método escolhido |
| `debtFreeDate` | mês | "Você fica livre das dívidas em março de 2028" |
| `progressPercent` | número | 0 a 100 |
| `paidAmount` | número | "R$ 880,00 pagos de..." |
| `totalAmount` | número | "...de R$ 4.870,00" |
| `order` | lista (abaixo) | "Ordem de pagamento" |
| `options` | lista (abaixo) | Simulação de cada método, para comparar |

Item de `order`:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `position` | número | 1 = primeira a quitar |
| `debtId` | número | |
| `debtName` | string | |
| `payoffDate` | mês | "até jul/2027" |
| `balance` | número | |
| `progressPercent` | número | Quanto dessa dívida já foi pago, 0 a 100 |

Item de `options` (um para cada método):

| Campo | Tipo | Observação |
| --- | --- | --- |
| `method` | `"AVALANCHE"` ou `"BOLA_DE_NEVE"` | |
| `debtFreeDate` | mês | "Livre em mar/2028" |
| `totalInterest` | número | "Juros: R$ 1.530" |
| `recommended` | boolean | Mostra o selo "Recomendado" |

Sem dívidas cadastradas: responder 200 com `order: []`; a tela mostra "Você ainda não tem um plano".

### `PUT /plan`

Corpo enviado:

| Campo | Tipo | Observação |
| --- | --- | --- |
| `monthlyBudget` | número | Maior que zero (o front já valida) |
| `method` | `"AVALANCHE"` ou `"BOLA_DE_NEVE"` | |

Resposta (200): o plano inteiro recalculado, no mesmo formato do `GET /plan`.

---

## Aprender

### `GET /learning/tracks`

Resposta (200): lista de trilhas (pode ser `[]`), já com o progresso da pessoa logada.

| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | número | |
| `title` | string | Ex.: "Como renegociar uma dívida" |
| `minutesPerLesson` | número | "cerca de 5 minutos cada" |
| `lessons` | lista de `{ id, title, summary, completed }` | Na ordem em que devem ser feitas; `completed` é boolean |
| `tip` | string ou `null` | Texto da caixa "Dica" |

O progresso ("1 de 3 concluída") é contado no front a partir de `lessons[].completed`.

### `POST /learning/tracks/{trackId}/lessons/{lessonId}/complete`

Sem corpo. Chamado pelo botão "Continuar" da próxima lição.

Resposta (200): a trilha atualizada, no mesmo formato de um item do `GET /learning/tracks`.

---

## Ainda sem endpoint

Estas ações aparecem no protótipo, mas não têm tela desenhada, e nenhum endpoint é chamado
(os dois primeiros botões estão desabilitados no front):

- Criar conta ("Criar conta grátis")
- Recuperar senha ("Esqueci minha senha")
- Notificações: o sino do cabeçalho abre um painel que hoje mostra sempre "Nenhuma notificação"
