
# 🚀 Planner Vitrine - MVP

O **Planner Vitrine** é uma ferramenta de gestão de conteúdo orgânico focada em agências de marketing que gerenciam múltiplos clientes de Instagram.

## ✨ Principais Funcionalidades

- **Gestão de Clientes:** Adicione perfis individuais com nicho, tom de voz e objetivos.
- **Calendário Mensal:** Visão ampla do mês com status visual por cores.
- **Grade Semanal:** Organização vertical por colunas para fluxo de produção.
- **Banco de Ideias (Backlog):** Registre insights sem data e mova para o calendário depois.
- **Card de Conteúdo Completo:**
  - Copy/Legenda com auxílio de **IA (Google Gemini)**.
  - Checklist de produção.
  - Repositório de links úteis (Drive, Referências).
  - Status e Pilares de conteúdo.
- **Exportação:** Gere um CSV rápido de todo o planejamento do cliente.

## 🛠️ Como Usar

1. **Adicionar Cliente:** Na tela inicial, clique em "+ Novo Cliente" e preencha o perfil.
2. **Entrar no Workspace:** Clique no card do cliente para abrir o planejamento.
3. **Planejar Conteúdo:**
   - No **Calendário**, clique duas vezes em qualquer dia ou use o botão "+ Criar Card".
   - Arraste cards entre dias para reagendar.
4. **Editar Conteúdo:** Clique no card para abrir a barra lateral. Use o botão "Sugerir Legenda" para que a IA crie um texto baseado no seu título e pilar.
5. **Backlog:** Use a aba Backlog para guardar ideias brutas que surgem em reuniões.

## 🧠 Decisões de Design (UX/UI)

- **Hierarquia Visual:** Cores pastéis e badges marcantes permitem identificar o status (Aprovado, Revisão, etc) à distância.
- **Foco em Produtividade:** A edição de card ocorre em um *Drawer* lateral, permitindo que o usuário mantenha o contexto do calendário ao fundo.
- **Multi-tenant:** Cada cliente possui seu "espaço isolado", evitando confusão entre contas de nichos diferentes.
- **IA Generativa:** Integração com o modelo `gemini-3-flash-preview` para acelerar a escrita de legendas repetitivas.

## 📦 Armazenamento

Todos os dados são salvos no `localStorage` do seu navegador. Não é necessário criar conta para testar o MVP. Os dados persistem após atualizar a página.
