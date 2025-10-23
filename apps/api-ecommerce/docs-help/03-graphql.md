# GraphQL - API Moderna e Flexível

## O que é GraphQL?

GraphQL é uma **linguagem de query** para APIs e um **runtime** para executar essas queries. Foi criado pelo Facebook em 2012 e tornou-se open source em 2015.

## REST vs GraphQL

### API REST Tradicional

```
GET /api/users/123
Resposta: {
  id: 123,
  name: "João",
  email: "joao@email.com",
  bio: "...",
  avatar: "...",
  followers: [...], // Dados desnecessários!
}

GET /api/users/123/posts
Resposta: [...posts...]

// Problema: 2 requisições, muitos dados desnecessários
```

### API GraphQL

```graphql
query {
  user(id: 123) {
    name
    posts {
      title
    }
  }
}

# Resposta: Exatamente o que pedimos!
{
  "data": {
    "user": {
      "name": "João",
      "posts": [
        { "title": "Post 1" },
        { "title": "Post 2" }
      ]
    }
  }
}
```

**Vantagens:**
- 1 requisição ao invés de 2
- Cliente pede apenas os campos necessários
- Menos over-fetching (dados extras)
- Menos under-fetching (falta de dados)

## Conceitos Fundamentais

### 1. Schema

O schema define o que está disponível na API.

```graphql
type User {
  id: ID!           # ! significa obrigatório
  name: String!
  email: String
  posts: [Post!]!   # Lista de Posts
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}
```

### 2. Queries (Leitura)

```graphql
type Query {
  # Buscar usuário por ID
  user(id: ID!): User

  # Buscar todos os usuários
  users: [User!]!

  # Buscar posts com filtros
  posts(limit: Int, offset: Int): [Post!]!
}
```

**Exemplo de uso:**
```graphql
query {
  user(id: "123") {
    name
    email
  }
}
```

### 3. Mutations (Modificação)

```graphql
type Mutation {
  # Criar usuário
  createUser(name: String!, email: String!): User!

  # Atualizar usuário
  updateUser(id: ID!, name: String): User!

  # Deletar usuário
  deleteUser(id: ID!): Boolean!
}
```

**Exemplo de uso:**
```graphql
mutation {
  createUser(name: "João", email: "joao@email.com") {
    id
    name
  }
}
```

### 4. Resolvers

Resolvers são funções que buscam os dados.

```typescript
const resolvers = {
  Query: {
    user: (parent, args, context) => {
      return User.findById(args.id);
    },
  },
  Mutation: {
    createUser: (parent, args, context) => {
      return User.create({
        name: args.name,
        email: args.email,
      });
    },
  },
};
```

**Parâmetros do resolver:**
- `parent`: Resultado do resolver pai
- `args`: Argumentos da query/mutation
- `context`: Compartilhado entre todos os resolvers (dataloaders, user, etc.)
- `info`: Metadados sobre a query

## GraphQL no Projeto

### Schema Principal: [schema.ts](../src/schema/schema.ts)

```typescript
import { GraphQLSchema } from "graphql";
import { MutationType } from "./MutationType";
import { QueryType } from "./QueryType";

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
```

**O que faz:**
- Cria o schema GraphQL principal
- Define queries disponíveis (leitura)
- Define mutations disponíveis (modificação)

### Query Type: [QueryType.ts](../src/schema/QueryType.ts)

```typescript
import { GraphQLObjectType } from 'graphql';
import { messageConnectionField } from '../modules/message/messageFields';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...messageConnectionField('messages'),
  }),
});
```

**Explicação:**

1. **`GraphQLObjectType`**: Tipo de objeto GraphQL
2. **`name: 'Query'`**: Nome do tipo (deve ser 'Query' para queries)
3. **`fields`**: Campos disponíveis na query
4. **`...messageConnectionField('messages')`**: Spread do campo de conexão de mensagens

**Resultado em GraphQL:**
```graphql
type Query {
  messages(first: Int, after: String): MessageConnection!
}
```

### Mutation Type: [MutationType.ts](../src/schema/MutationType.ts)

```typescript
import { GraphQLObjectType } from "graphql";
import { messageMutations } from "../modules/message/mutations/messageMutations";

export const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...messageMutations,
  }),
});
```

**Resultado em GraphQL:**
```graphql
type Mutation {
  MessageAdd(input: MessageAddInput!): MessageAddPayload
}
```

## GraphQL Relay

O projeto usa **GraphQL Relay**, uma especificação do Facebook para APIs GraphQL.

### Conceitos Relay

#### 1. Global Object Identification

Cada objeto tem um ID global único.

```typescript
import { globalIdField } from 'graphql-relay';

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: globalIdField('Message'),  // ID global
    content: { type: GraphQLString },
  }),
});
```

**ID Global:**
```
Base64("Message:507f1f77bcf86cd799439011")
= "TWVzc2FnZTo1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTE="
```

**Decodificar:**
```typescript
import { fromGlobalId } from 'graphql-relay';

const { type, id } = fromGlobalId("TWVzc2FnZTo...");
// type: "Message"
// id: "507f1f77bcf86cd799439011"
```

#### 2. Connections (Paginação)

Connections são o padrão Relay para paginação.

**Estrutura:**
```graphql
type MessageConnection {
  edges: [MessageEdge!]!
  pageInfo: PageInfo!
}

type MessageEdge {
  node: Message!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

**Exemplo de resposta:**
```json
{
  "data": {
    "messages": {
      "edges": [
        {
          "node": {
            "id": "TWVzc2FnZTox",
            "content": "Hello"
          },
          "cursor": "YXJyYXljb25uZWN0aW9uOjA="
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "YXJyYXljb25uZWN0aW9uOjA=",
        "endCursor": "YXJyYXljb25uZWN0aW9uOjA="
      }
    }
  }
}
```

**Definição no código:** [MessageType.ts](../src/modules/message/MessageType.ts):27

```typescript
import { connectionDefinitions } from 'graphql-relay';

const MessageConnection = connectionDefinitions({
  name: 'Message',
  nodeType: MessageType,
});
```

**Argumentos de paginação:**
```graphql
query {
  messages(
    first: 10           # Primeiros 10 itens
    after: "cursor"     # Depois deste cursor
  ) {
    edges { node { content } }
    pageInfo { hasNextPage }
  }
}
```

#### 3. Mutations

Mutations seguem um padrão específico.

**Arquivo:** [MessageAddMutation.ts](../src/modules/message/mutations/MessageAddMutation.ts)

```typescript
import { mutationWithClientMutationId } from "graphql-relay";

const mutation = mutationWithClientMutationId({
  name: "MessageAdd",

  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  mutateAndGetPayload: async (args: MessageAddInput) => {
    const message = await new Message({
      content: args.content,
    }).save();

    return {
      message: message._id.toString(),
    };
  },

  outputFields: {
    ...messageField("message"),
  },
});
```

**Anatomia:**

1. **`name`**: Nome da mutation
2. **`inputFields`**: Campos de entrada
3. **`mutateAndGetPayload`**: Função que executa a mutation
4. **`outputFields`**: Campos retornados

**Uso:**
```graphql
mutation {
  MessageAdd(input: {
    content: "Hello World"
    clientMutationId: "1"  # ID único para tracking
  }) {
    message {
      id
      content
    }
    clientMutationId  # Retorna o mesmo ID
  }
}
```

**Por que `clientMutationId`?**
- Permite ao cliente rastrear mutations
- Útil para deduplicação
- Relay adiciona automaticamente

#### 4. Node Interface

Interface para buscar qualquer objeto por ID global.

**Arquivo:** [typeRegister.ts](../src/modules/_node/typeRegister.ts):26

```typescript
import { nodeDefinitions } from "graphql-relay";

const { nodeField, nodeInterface } = nodeDefinitions(
  // Resolver: como buscar por ID global
  (globalId: string, context: unknown) => {
    const { type, id } = fromGlobalId(globalId);
    const { load } = typesLoaders[type] || { load: null };
    return (load?.(context, id)) || null;
  },

  // Type resolver: qual tipo é esse objeto?
  (obj) => {
    const { type } = typesLoaders[obj.constructor.name] || { type: null };
    return type.name;
  },
);
```

**Uso:**
```graphql
query {
  node(id: "TWVzc2FnZTo1MDdm...") {
    id
    ... on Message {
      content
    }
  }
}
```

## Tipos GraphQL

### Arquivo: [MessageType.ts](../src/modules/message/MessageType.ts)

```typescript
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

const MessageType = new GraphQLObjectType<IMessage>({
  name: 'Message',
  description: 'Represents a message',

  fields: () => ({
    id: globalIdField('Message'),

    content: {
      type: GraphQLString,
      resolve: (message) => message.content,
    },

    createdAt: {
      type: GraphQLString,
      resolve: (message) => message.createdAt.toISOString(),
    },
  }),

  interfaces: () => [nodeInterface],
});
```

**Explicação:**

1. **`GraphQLObjectType<IMessage>`**: Tipo de objeto com tipagem TypeScript
2. **`name`**: Nome do tipo no schema
3. **`description`**: Documentação (aparece no GraphiQL)
4. **`fields`**: Campos disponíveis
5. **`resolve`**: Como buscar o valor do campo
6. **`interfaces`**: Interfaces que este tipo implementa

### Tipos GraphQL Disponíveis

```typescript
import {
  GraphQLString,      // String
  GraphQLInt,         // Número inteiro
  GraphQLFloat,       // Número decimal
  GraphQLBoolean,     // true/false
  GraphQLID,          // ID (string ou número)
  GraphQLList,        // Lista
  GraphQLNonNull,     // Não nulo (obrigatório)
} from 'graphql';

// Exemplos:
{ type: GraphQLString }                    // String opcional
{ type: new GraphQLNonNull(GraphQLString) } // String obrigatória
{ type: new GraphQLList(GraphQLString) }   // Lista de strings
{ type: new GraphQLNonNull(new GraphQLList(GraphQLString)) } // Lista obrigatória
```

## Fields (Campos Reutilizáveis)

### Arquivo: [messageFields.ts](../src/modules/message/messageFields.ts)

```typescript
export const messageField = (key: string) => ({
  [key]: {
    type: MessageType,
    resolve: async (obj, _, context) =>
      MessageLoader.load(context, obj.message as string),
  },
});

export const messageConnectionField = (key: string) => ({
  [key]: {
    type: MessageConnection.connectionType,
    args: {
      ...connectionArgs,  // first, after, last, before
    },
    resolve: async (_, args, context) => {
      return await MessageLoader.loadAll(context, args);
    },
  },
});
```

**Por que criar fields separados?**
- Reutilização de código
- Padrão consistente
- Fácil manutenção

**Uso:**
```typescript
// Em QueryType
fields: () => ({
  ...messageConnectionField('messages'),
})

// Em Mutation
outputFields: {
  ...messageField('message'),
}
```

## Context (Contexto)

### Arquivo: [getContext.ts](../src/server/getContext.ts)

```typescript
import { getDataloaders } from "../modules/_loader/loaderRegister";

const getContext = () => {
  const dataloaders = getDataloaders();

  return {
    dataloaders,
  } as const;
};
```

**O que é context?**
- Objeto criado para cada requisição
- Compartilhado entre todos os resolvers
- Contém dataloaders, usuário autenticado, etc.

**Acesso no resolver:**
```typescript
resolve: async (parent, args, context) => {
  // context.dataloaders.MessageLoader
  const message = await MessageLoader.load(context, id);
  return message;
}
```

## GraphiQL - Interface de Teste

Quando você acessa http://localhost:4000/graphql no navegador, abre o GraphiQL.

**Recursos:**
- Autocomplete (Ctrl+Space)
- Documentação automática (canto direito)
- Histórico de queries
- Formatação automática (Ctrl+Shift+F)

**Exemplo de query:**
```graphql
query GetMessages {
  messages(first: 10) {
    edges {
      node {
        id
        content
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Exemplo de mutation:**
```graphql
mutation CreateMessage {
  MessageAdd(input: {
    content: "Hello from GraphiQL!"
    clientMutationId: "1"
  }) {
    message {
      id
      content
      createdAt
    }
    clientMutationId
  }
}
```

## Geração do Schema

### Script: [updateSchema.ts](../scripts/updateSchema.ts)

```bash
npm run schema
```

**O que faz:**
- Gera arquivo `schema.graphql` com o schema completo
- Copia para o projeto web
- Útil para ferramentas de codegen

**Arquivo gerado:** [schema.graphql](../schema/schema.graphql)

```graphql
type Query {
  messages(after: String, first: Int, before: String, last: Int): MessageConnection!
}

type Mutation {
  MessageAdd(input: MessageAddInput!): MessageAddPayload
}

type Message implements Node {
  id: ID!
  content: String
  createdAt: String
}
```

## Boas Práticas

### 1. Use Descrições
```typescript
const MessageType = new GraphQLObjectType({
  name: 'Message',
  description: 'Represents a user message in the system',
  fields: () => ({
    content: {
      type: GraphQLString,
      description: 'The text content of the message',
    },
  }),
});
```

### 2. Valide Inputs
```typescript
mutateAndGetPayload: async (args) => {
  if (!args.content.trim()) {
    throw new Error('Content cannot be empty');
  }
  // ...
}
```

### 3. Use Enums para Valores Fixos
```typescript
const RoleEnum = new GraphQLEnumType({
  name: 'Role',
  values: {
    ADMIN: { value: 'admin' },
    USER: { value: 'user' },
  },
});
```

### 4. Use Interfaces para Tipos Comuns
```typescript
const TimestampedInterface = new GraphQLInterfaceType({
  name: 'Timestamped',
  fields: {
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});
```

## Tratamento de Erros

```typescript
resolve: async (parent, args, context) => {
  try {
    return await Message.findById(args.id);
  } catch (error) {
    throw new Error(`Failed to load message: ${error.message}`);
  }
}
```

**Resposta de erro:**
```json
{
  "errors": [
    {
      "message": "Failed to load message: ...",
      "path": ["message"],
      "locations": [{ "line": 2, "column": 3 }]
    }
  ],
  "data": {
    "message": null
  }
}
```

## Recursos Adicionais

- GraphQL.org: https://graphql.org/learn/
- GraphQL Relay: https://relay.dev/docs/guides/graphql-server-specification/
- How to GraphQL: https://www.howtographql.com/
- GraphQL Best Practices: https://graphql.org/learn/best-practices/

## Próximo Passo

Agora vamos aprender sobre DataLoaders para otimizar queries: **[04-dataloaders.md](04-dataloaders.md)**
