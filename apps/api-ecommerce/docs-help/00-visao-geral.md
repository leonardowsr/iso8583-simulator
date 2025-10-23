# Visão Geral do Servidor - Sua Primeira Experiência

Bem-vindo! Este é um guia completo para entender o servidor GraphQL construído com Koa, MongoDB/Mongoose e GraphQL.

## O que é este projeto?

Este é um servidor de API GraphQL que permite criar e consultar mensagens. Ele usa tecnologias modernas para criar uma API robusta e escalável.

## Tecnologias Principais

### 1. **Koa** (Framework Web)
- **O que é**: Um framework web minimalista e moderno para Node.js
- **Por que usar**: É leve, usa async/await nativamente e é muito flexível
- **Papel aqui**: Gerencia as requisições HTTP e serve a API GraphQL

### 2. **MongoDB** (Banco de Dados)
- **O que é**: Um banco de dados NoSQL orientado a documentos
- **Por que usar**: Armazena dados em formato JSON-like, flexível e escalável
- **Papel aqui**: Armazena as mensagens criadas pelos usuários

### 3. **Mongoose** (ODM - Object Data Modeling)
- **O que é**: Uma biblioteca que facilita a interação com MongoDB
- **Por que usar**: Fornece validação, schemas e métodos úteis
- **Papel aqui**: Define a estrutura das mensagens e facilita operações no banco

### 4. **GraphQL** (Linguagem de Query)
- **O que é**: Uma linguagem de consulta para APIs
- **Por que usar**: Permite que o cliente peça exatamente os dados que precisa
- **Papel aqui**: Define como os clientes podem consultar e modificar dados

## Estrutura do Projeto

```
apps/server/
├── src/
│   ├── index.ts                    # Ponto de entrada da aplicação
│   ├── config.ts                   # Configurações (porta, MongoDB URI)
│   ├── database.ts                 # Conexão com MongoDB
│   │
│   ├── server/
│   │   ├── app.ts                  # Configuração do servidor Koa
│   │   └── getContext.ts           # Cria contexto para cada requisição
│   │
│   ├── schema/
│   │   ├── schema.ts               # Schema principal do GraphQL
│   │   ├── QueryType.ts            # Queries disponíveis (consultas)
│   │   └── MutationType.ts         # Mutations disponíveis (modificações)
│   │
│   └── modules/
│       ├── message/                # Módulo de mensagens
│       │   ├── MessageModel.ts     # Modelo MongoDB (estrutura dos dados)
│       │   ├── MessageLoader.ts    # DataLoader (otimização de queries)
│       │   ├── MessageType.ts      # Tipo GraphQL
│       │   ├── messageFields.ts    # Campos GraphQL reutilizáveis
│       │   └── mutations/          # Operações de modificação
│       │       ├── MessageAddMutation.ts
│       │       └── messageMutations.ts
│       │
│       ├── _loader/                # Sistema de DataLoaders
│       │   └── loaderRegister.ts
│       │
│       └── _node/                  # Sistema de Nodes (GraphQL Relay)
│           └── typeRegister.ts
```

## Como o Servidor Funciona?

### Fluxo de Inicialização

1. **[index.ts](../src/index.ts)**: Ponto de partida
   - Conecta ao MongoDB
   - Cria servidor HTTP
   - Inicia na porta configurada (padrão: 4000)

2. **[database.ts](../src/database.ts)**: Conexão com banco
   - Conecta ao MongoDB usando Mongoose
   - Configura eventos de conexão

3. **[app.ts](../src/server/app.ts)**: Servidor Koa
   - Configura middlewares (CORS, logger, parser)
   - Define rota /graphql
   - Serve o GraphiQL (interface para testar queries)

### Fluxo de Requisição

```
Cliente faz query/mutation
         ↓
    Koa recebe requisição
         ↓
    koa-graphql processa
         ↓
    Schema GraphQL resolve
         ↓
    Loader busca dados
         ↓
    Mongoose consulta MongoDB
         ↓
    Dados retornam ao cliente
```

## Conceitos Importantes

### Context (Contexto)
- Objeto criado para cada requisição
- Contém dataloaders e outras informações compartilhadas
- Acessível em todos os resolvers

### DataLoaders
- Otimizam consultas ao banco de dados
- Agrupam múltiplas requisições em uma só
- Previnem o problema N+1

### GraphQL Relay
- Especificação para APIs GraphQL
- Define padrões como Connections, Nodes e Global IDs
- Facilita paginação e identificação única

## Executando o Projeto

### Configuração Inicial
```bash
# 1. Configurar variáveis de ambiente
npm run config:local

# 2. Editar .env com suas configurações
PORT=4000
MONGO_URI=mongodb://localhost:27017/woovi

# 3. Rodar o servidor em modo desenvolvimento
npm run dev
```

### Acessando a API
- Servidor: http://localhost:4000
- GraphiQL: http://localhost:4000/graphql

## Próximos Passos

Recomendo ler os documentos na seguinte ordem:

1. **[01-koa.md](01-koa.md)** - Entenda o framework web Koa
2. **[02-mongodb-mongoose.md](02-mongodb-mongoose.md)** - Aprenda sobre banco de dados
3. **[03-graphql.md](03-graphql.md)** - Domine GraphQL
4. **[04-dataloaders.md](04-dataloaders.md)** - Otimize suas queries
5. **[05-estrutura-modulos.md](05-estrutura-modulos.md)** - Organize seu código
6. **[06-fluxo-de-dados.md](06-fluxo-de-dados.md)** - Entenda o fluxo completo

## Dúvidas Comuns

**Q: Por que usar GraphQL ao invés de REST?**
A: GraphQL permite que o cliente peça exatamente o que precisa, evitando over-fetching e under-fetching de dados.

**Q: O que são middlewares do Koa?**
A: São funções que processam requisições antes de chegarem ao seu handler final (ex: logs, CORS, parsing).

**Q: Por que usar DataLoaders?**
A: Para evitar múltiplas consultas ao banco quando você precisa buscar vários itens relacionados.

**Q: O que é GraphQL Relay?**
A: É um conjunto de especificações e padrões para construir APIs GraphQL mais consistentes e escaláveis.
