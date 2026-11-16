# Conta Certa (front-end)

Front-end do **Conta Certa**, app de controle financeiro e saída das dívidas (Global Solution FIAP).

## Tecnologias

- React + Vite + TypeScript
- Tailwind CSS (tema em `src/index.css`)
- react-router-dom (rotas) e lucide-react (ícones)

Sem biblioteca de UI, sem biblioteca de requisição e sem biblioteca de gráficos (gráficos em SVG feito à mão).

## Como rodar

```bash
npm install
cp .env.example .env   # e ajuste VITE_API_URL para a URL da API Java
npm run dev
```

Abra o endereço que aparecer no terminal (por padrão http://localhost:5173).

Outros comandos:

```bash
npm run build    # checa os tipos e gera a versão de produção em dist/
npm run preview  # serve a versão de produção localmente
```

## Estrutura

```
src/
  components/   componentes reutilizáveis (ui/) e layout do app (layout/)
  pages/        uma página por rota
  routes/       definição das rotas e itens de navegação
  services/     acesso à API (fetch nativo); toda leitura e escrita de dados passa por aqui
  types/        interfaces TypeScript dos dados da API
  hooks/        useAsync: estados de carregando, erro e sucesso das buscas
  utils/        formatação de moeda, datas e porcentagem
```

## Páginas

| Rota | Tela |
| --- | --- |
| `/` | Entrar |
| `/app` | Início |
| `/app/transacoes` | Transações |
| `/app/dividas` | Minhas dívidas |
| `/app/dividas/:id` | Detalhe da dívida |
| `/app/plano` | Meu plano |
| `/app/aprender` | Aprender |
