<div id="top"></div>

# 🚀 ISO 8583 Simulator - FinTech Playground

> Uma plataforma completa de simulação de processamento de transações financeiras com suporte a ISO 8583, incluindo e-commerce, adquirente e simulador de emissor.

<div align="center">

[![Node.js][node.js]][node-url]
[![TypeScript][typescript]][typescript-url]
[![Next.js][next.js]][next-url]
[![GraphQL][graphql]][graphql-url]
[![MongoDB][mongodb]][mongodb-url]
[![Docker][docker]][docker-url]
[![Turbo][turbo]][turbo-url]

**[Documentação](#-estrutura-do-projeto) • [Quick Start](#-início-rápido) • [Arquitetura](#-arquitetura) • [Contribuindo](#-contributing)**

</div>

---

## 📋 Sobre o Projeto

Este é um **simulador completo de transações financeiras ISO 8583** que combina:

- **E-commerce API**: GraphQL API para gerenciamento de produtos, categorias e pedidos
- **Adquirente (Acquirer)**: Simulador que processa mensagens ISO 8583 em tempo real
- **Emissor (Issuer)**: Simulador que autoriza/nega transações financeiras
- **Dashboard Web**: Interface Next.js para visualização de transações e gerenciamento

Ideal para **aprender sobre fintech**, **testar fluxos de pagamento** ou **desenvolver integrações de sistemas de pagamento**.

### ✨ Tecnologias Principais

- **Backend**: Node.js, TypeScript, GraphQL, Koa
- **Frontend**: Next.js, React, Relay (GraphQL Client)
- **Banco de Dados**: MongoDB, Redis
- **Comunicação**: ISO 8583, WebSockets, GraphQL Subscriptions
- **Orquestração**: Turbo (Monorepo), PNPM (Package Manager)
- **Containerização**: Docker & Docker Compose

---

## 🏗️ Estrutura do Projeto

Este é um **monorepo** gerenciado com PNPM e Turbo. A estrutura segue:

```
woovi-challenger/
├── apps/                          # Aplicações principais
│   ├── acquire-sim/              # 🏦 Simulador de Adquirente
│   │   ├── src/
│   │   │   ├── modules/          # Negócio ISO 8583
│   │   │   ├── schema/           # Definições GraphQL
│   │   │   ├── server/           # WebSockets e contexto
│   │   │   └── config.ts         # Configurações
│   │   └── package.json
│   │
│   ├── api-ecommerce/            # 🛒 API GraphQL de E-commerce
│   │   ├── src/
│   │   │   ├── modules/          # Usuários, Produtos, Pedidos
│   │   │   ├── schema/           # Resolver GraphQL
│   │   │   ├── seed/             # Dados iniciais
│   │   │   └── database.ts       # Conexão MongoDB
│   │   └── package.json
│   │
│   ├── issuer-sim/               # 💳 Simulador de Emissor
│   │   ├── src/
│   │   │   ├── modules/          # Autorização, Conta, Ledger
│   │   │   ├── seed/             # Dados iniciais
│   │   │   └── server/           # Servidor TCP/Koa
│   │   └── package.json
│   │
│   └── web/                       # 💻 Frontend Dashboard
│       ├── src/
│       │   ├── app/              # Next.js App Router
│       │   ├── components/       # Componentes React
│       │   ├── mutations/        # GraphQL Mutations
│       │   └── __generated__/    # Relay (auto-gerado)
│       ├── data/                 # Schemas GraphQL
│       ├── relay.config.js       # Configuração Relay
│       └── package.json
│
├── packages/                      # Código compartilhado
│   ├── shared/                   # Utilidades ISO 8583, funções comuns
│   └── tsconfig/                 # Configurações TypeScript
│
├── docker-compose.yml            # 🐳 Infraestrutura: MongoDB, Redis, Mongo Express
├── package.json                  # Root workspace
├── pnpm-workspace.yaml           # Configuração PNPM monorepo
├── turbo.json                    # Configuração Turbo
└── biome.json                    # Configuração Code Quality (Lint/Format)
```

### 📦 O que cada app faz?

| App | Porta | Descrição |
|-----|-------|-----------|
| **api-ecommerce** | 4000 | GraphQL API para e-commerce (produtos, usuários, pedidos) |
| **acquire-sim** | 3000 | Simulador de adquirente - processa ISO 8583, WebSockets |
| **issuer-sim** | 4001 | Simulador de emissor - valida/autoriza transações |
| **web** | 3001 | Dashboard Next.js para visualizar transações |

### 🔄 Fluxo de Dados

```
[Web Dashboard] 
    ↓
[Next.js App] → Queries GraphQL → [API E-commerce] → MongoDB
    ↓                                   ↓
    └─→ Subscriptions WebSocket → [Acquire Simulator] → Redis
                                         ↓
                          ISO 8583 Messages ←→ [Issuer Simulator]
                                         ↓
                                      MongoDB
```

---

## 🚀 Início Rápido

### 📋 Pré-requisitos

Instale os seguintes programas antes de começar:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PNPM** v9+ ([Guia de instalação](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/get-started))
- **Git** ([Download](https://git-scm.com/))

### 🔧 Instalação Passo a Passo

#### 1️⃣ Clone o repositório

```bash
git clone https://github.com/leonardowsr/iso8583-simulator.git
cd iso8583-simulator
```

#### 2️⃣ Instale as dependências

```bash
pnpm install
```

#### 3️⃣ Inicie a infraestrutura (MongoDB, Redis, Mongo Express)

```bash
pnpm compose:up
```

Isso iniciará:
- **MongoDB** em `mongodb://localhost:27017`
- **Redis** em `localhost:6379`
- **Mongo Express** em `http://localhost:8081` (admin/pass)

#### 4️⃣ Configure as variáveis de ambiente

```bash
pnpm config:local
```

Isso copia o arquivo `.env.example` para `.env` em cada app.

#### 5️⃣ Gere os schemas GraphQL (Relay)

```bash
pnpm relay
```

Isso gera tipos TypeScript do GraphQL automaticamente.

#### 6️⃣ Inicie todos os serviços em desenvolvimento

```bash
pnpm dev
```

Aguarde até ver as mensagens:
```
✓ api-ecommerce running on http://localhost:4000/graphql
✓ acquire-sim running on ws://localhost:3000/graphql/ws
✓ issuer-sim running on http://localhost:4001
✓ web running on http://localhost:3001
```

#### 7️⃣ Acesse a aplicação

- **Dashboard**: http://localhost:3001
- **GraphQL Playground (E-commerce)**: http://localhost:4000/graphql
- **GraphQL Playground (Acquirer)**: http://localhost:3000/graphql
- **Mongo Express**: http://localhost:8081 (admin/pass)

---

## 📚 Comandos Principais

### 🔨 Build & Development

```bash
# Desenvolvimento com hot reload em todos os apps
pnpm dev

# Build de produção
pnpm build

# Iniciar modo produção (requer build anterior)
pnpm start

# Assistir mudanças (sem hot reload)
pnpm watch
```

### 🗄️ Banco de Dados

```bash
# Seed inicial de dados (usuários, produtos, categorias)
pnpm --filter api-ecommerce db:seed

# Verificar dados no Mongo Express
# Acesse: http://localhost:8081
```

### 📊 GraphQL & Relay

```bash
# Gerar tipos TypeScript para mutations/queries
pnpm relay

# Apenas para ecommerce
pnpm relay:ecommerce

# Apenas para acquirer
pnpm relay:acquire

# Atualizar schemas GraphQL
pnpm schema
```

### 🧹 Code Quality

```bash
# Lint e formatação automática
pnpm format

# Verificar apenas (sem fazer mudanças)
pnpm check

# Lint específico
pnpm lint
```

### 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Teste específico
pnpm --filter api-ecommerce test
```

### 🐳 Docker

```bash
# Iniciar containers (MongoDB, Redis, Mongo Express)
pnpm compose:up

# Parar containers
pnpm compose-down

# Ver logs
docker-compose logs -f
```

---

## 💡 Arquitetura & Conceitos

### ISO 8583

ISO 8583 é um padrão internacional para **mensagens de transações financeiras**. Neste projeto:

- **Acquirer Simulator**: Recebe mensagens ISO 8583, valida e roteia para o emissor
- **Issuer Simulator**: Processa a transação, verifica saldo e autoriza/nega
- **Format**: Mensagens binárias + campos de dados estruturados

### GraphQL APIs

Cada serviço expõe um endpoint GraphQL:

```bash
# E-commerce
curl http://localhost:4000/graphql

# Acquirer (com WebSockets)
curl http://localhost:3000/graphql
```

### WebSockets & Subscriptions

O Acquirer usa **GraphQL Subscriptions** sobre WebSocket para **tempo real**:

```typescript
subscription OnIsoMessage {
  isoMessageAdded {
    id
    message
    status
  }
}
```

### Relay & Auto-generated Types

O projeto usa **Relay** para gerar tipos TypeScript automaticamente:

```bash
pnpm relay
```

Isso gera em `__generated_*` diretos com tipos type-safe para queries/mutations.

---

## 🔗 Exemplos de Uso

### Criar um produto (API E-commerce)

```graphql
mutation CreateProduct {
  productCreate(input: {
    name: "Produto X"
    price: 99.90
    categoryId: "cat123"
  }) {
    product {
      id
      name
      price
    }
  }
}
```

### Enviar transação ISO (Acquirer)

```graphql
mutation SendIsoMessage {
  isoMessageSend(input: {
    messageType: "0200"
    data: "..."
  }) {
    message {
      id
      response
      status
    }
  }
}
```

### Subscribe em tempo real

```graphql
subscription {
  isoMessageAdded {
    id
    message
    status
  }
}
```

---

## 📁 Desenvolvendo Localmente

### Adicionar um novo app

```bash
# 1. Criar pasta
mkdir apps/meu-app

# 2. Copiar package.json de outro app
cp apps/api-ecommerce/package.json apps/meu-app/

# 3. Atualizar nome em package.json
# 4. Instalar dependências
pnpm install

# 5. Começar desenvolvimento
pnpm --filter meu-app dev
```

### Adicionar dependência compartilhada

```bash
# Instalar em um app específico
pnpm --filter api-ecommerce add lodash

# Instalar em todos os apps
pnpm add -r lodash

# Instalar pacote compartilhado
pnpm --filter shared add zod
```

### Debug & Troubleshooting

```bash
# Limpar cache
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Ver dependências
pnpm list

# Verificar conexão MongoDB
# Acesse Mongo Express: http://localhost:8081

# Ver logs em tempo real
docker-compose logs -f mongodb
```

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Por favor:

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/minha-feature`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona minha feature'`)
4. **Push** para a branch (`git push origin feature/minha-feature`)
5. **Abra um Pull Request**

### Padrões do Projeto

- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc)
- **Lint**: Execute `pnpm format` antes de commitar
- **Types**: Sempre use TypeScript tipos completos
- **Tests**: Escreva testes para novas features

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato & Suporte

- **Issues**: [Reporte bugs aqui](https://github.com/leonardowsr/iso8583-simulator/issues)
- **Discussões**: [Abra discussões](https://github.com/leonardowsr/iso8583-simulator/discussions)

---

<div align="center">

**[⬆ voltar ao topo](#-iso-8583-simulator---fintech-playground)**

Feito com ❤️ para educação e aprendizado em FinTech

</div>

<!-- MARKDOWN LINKS & IMAGES -->

[node.js]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[graphql]: https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white
[graphql-url]: https://graphql.org/
[mongodb]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://mongodb.com
[docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[docker-url]: https://www.docker.com/
[turbo]: https://img.shields.io/badge/Turbo-000000?style=for-the-badge&logo=turbo&logoColor=white
[turbo-url]: https://turbo.build/
