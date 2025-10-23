# Explicação do Servidor GraphQL com Mongoose

Este documento explica cada parte do servidor GraphQL implementado neste projeto. Como é sua primeira vez com GraphQL e Mongoose, começaremos com os conceitos básicos e depois detalharemos o código.

## Conceitos Básicos

### GraphQL
GraphQL é uma linguagem de consulta para APIs que permite aos clientes solicitar exatamente os dados de que precisam. Ao contrário de REST, onde você tem endpoints fixos, GraphQL tem um único endpoint onde você envia queries/mutations.

- **Query**: Para ler dados (equivalente a GET em REST).
- **Mutation**: Para modificar dados (equivalente a POST/PUT/DELETE em REST).
- **Schema**: Define a estrutura dos dados e operações disponíveis.
- **Resolver**: Função que resolve os dados para um campo específico.

### Mongoose
Mongoose é uma biblioteca ODM (Object Data Modeling) para MongoDB em Node.js. Ele fornece uma interface de programação para interagir com o banco de dados MongoDB.

- **Schema**: Define a estrutura dos documentos no MongoDB.
- **Model**: Classe que representa uma coleção no banco de dados.
- **Document**: Instância de um modelo (um registro no banco).

### Relay
Este projeto usa GraphQL Relay, uma especificação que padroniza certas convenções em GraphQL, como conexões para paginação e IDs globais.

## Estrutura do Servidor

### 1. Ponto de Entrada (`src/index.ts`)
Este arquivo inicia o servidor:
- Conecta ao banco de dados MongoDB usando Mongoose.
- Cria um servidor HTTP usando Koa.
- Inicia o servidor na porta definida (padrão 4000).

### 2. Configuração (`src/config.ts`)
Carrega variáveis de ambiente do arquivo `.env`:
- `PORT`: Porta do servidor (padrão 4000).
- `MONGO_URI`: URI de conexão do MongoDB.

### 3. Conexão com Banco de Dados (`src/database.ts`)
Estabelece conexão com MongoDB usando Mongoose. Escuta eventos de desconexão.

### 4. Aplicação Koa (`src/server/app.ts`)
Configura o servidor Koa:
- Middleware CORS para permitir requisições de diferentes origens.
- Logger para registrar requisições.
- Body parser para analisar corpos de requisições JSON.
- Rota `/graphql` que serve o endpoint GraphQL com GraphiQL (interface web para testar queries).

### 5. Contexto (`src/server/getContext.ts`)
Fornece o contexto para resolvers GraphQL, incluindo dataloaders para otimizar queries ao banco.

### 6. Schema GraphQL (`src/schema/`)
- `schema.ts`: Combina Query e Mutation types.
- `QueryType.ts`: Define queries disponíveis (ex: `messages`).
- `MutationType.ts`: Define mutations disponíveis (ex: `MessageAdd`).

### 7. Módulos (`src/modules/`)
O código está organizado em módulos:

#### Módulo Message (`src/modules/message/`)
- `MessageModel.ts`: Modelo Mongoose para mensagens (conteúdo, timestamps).
- `MessageType.ts`: Tipo GraphQL para Message, com campos id, content, createdAt.
- `MessageLoader.ts`: Data loader para carregar mensagens eficientemente.
- `messageFields.ts`: Campos GraphQL para message e conexões.
- `mutations/MessageAddMutation.ts`: Mutation para adicionar mensagens.
- `mutations/messageMutations.ts`: Exporta todas as mutations de message.

#### Módulo Loader (`src/modules/_loader/`)
- `loaderRegister.ts`: Registra e fornece dataloaders para batching de queries.

#### Módulo Node (`src/modules/_node/`)
- `typeRegister.ts`: Registra tipos para a interface Node do Relay.

#### Módulo Error (`src/modules/_error/`)
- `errorFields.ts`: Campo para erros em GraphQL.

## Primeiros Passos

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Configurar Ambiente
Copie `.env.example` para `.env` e configure:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/woovi-challenger
```

### 3. Iniciar MongoDB
Certifique-se de que MongoDB está rodando localmente ou configure uma URI externa.

### 4. Executar o Servidor
```bash
pnpm run dev
```

### 5. Testar no GraphiQL
Acesse `http://localhost:4000/graphql` e teste queries como:
```graphql
query {
  messages(first: 10) {
    edges {
      node {
        id
        content
        createdAt
      }
    }
  }
}

mutation {
  MessageAdd(input: {content: "Olá Mundo!"}) {
    message {
      id
      content
    }
  }
}
```

## Próximos Passos
- Explore a documentação do GraphQL: https://graphql.org/
- Aprenda Mongoose: https://mongoosejs.com/
- Estude GraphQL Relay: https://relay.dev/docs/
- Adicione mais tipos e mutations conforme necessário.