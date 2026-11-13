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
  services/     acesso à API (fetch nativo)
  types/        tipos TypeScript compartilhados
```
