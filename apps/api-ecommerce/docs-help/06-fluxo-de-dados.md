# Fluxo de Dados - Do Cliente ao Banco de Dados

Este documento mostra o fluxo completo de dados no sistema, desde a requisição do cliente até a resposta.

## Visão Geral

```
Cliente (Browser/App)
    ↓ HTTP POST
Koa Server
    ↓ Middleware
GraphQL Handler
    ↓ Parse Query
Schema Resolver
    ↓ Load Data
DataLoader
    ↓ Batch Query
MongoDB
    ↓ Results
Cliente (Response)
```

## Fluxo de Inicialização

### 1. Início da Aplicação

**[index.ts](../src/index.ts):6**

```typescript
(async () => {
  // 1. Conectar ao MongoDB
  await connectDatabase();

  // 2. Criar servidor HTTP
  const server = http.createServer(app.callback());

  // 3. Iniciar servidor
  server.listen(config.PORT, () => {
    console.info(`Server running on port:${config.PORT}`);
  });
})();
```

**Ordem de execução:**
1. Carrega configurações ([config.ts](../src/config.ts))
2. Conecta ao MongoDB ([database.ts](../src/database.ts))
3. Cria servidor HTTP com app Koa ([app.ts](../src/server/app.ts))
4. Escuta na porta configurada

### 2. Conexão com MongoDB

**[database.ts](../src/database.ts):5**

```typescript
async function connectDatabase() {
  mongoose.connection.on("close", () =>
    console.info("Database connection closed."),
  );

  await mongoose.connect(config.MONGO_URI);
}
```

**O que acontece:**
1. Registra event listeners
2. Conecta ao MongoDB usando URI do .env
3. Aguarda conexão completar
4. Retorna controle para index.ts

### 3. Configuração do Servidor

**[app.ts](../src/server/app.ts):11**

```typescript
const app = new Koa();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(logger());
app.use(bodyParser({ ... }));

// Rotas
const routes = new Router();
routes.all("/graphql", graphqlHTTP(() => ({
  schema,
  graphiql: true,
  context: getContext(),
})));

app.use(routes.routes());
app.use(routes.allowedMethods());
```

**Estado após inicialização:**
- ✅ MongoDB conectado
- ✅ Servidor HTTP escutando
- ✅ Middlewares configurados
- ✅ Rota /graphql pronta
- ✅ GraphiQL disponível

## Fluxo de Query (Leitura)

### Exemplo: Buscar Mensagens

**Query GraphQL:**
```graphql
query {
  messages(first: 2) {
    edges {
      node {
        id
        content
        createdAt
      }
    }
  }
}
```

### Passo a Passo Detalhado

#### 1. Cliente Envia Requisição

```http
POST http://localhost:4000/graphql
Content-Type: application/json

{
  "query": "query { messages(first: 2) { edges { node { id content } } } }"
}
```

#### 2. Koa Recebe e Processa

**[app.ts](../src/server/app.ts):13**

```
Requisição HTTP
    ↓
CORS Middleware
    → Adiciona headers: Access-Control-Allow-Origin: *
    ↓
Logger Middleware
    → Loga: <-- POST /graphql
    ↓
Body Parser Middleware
    → Converte JSON para objeto JavaScript
    → ctx.request.body = { query: "..." }
    ↓
Router
    → Encontra rota /graphql
    → Chama handler graphqlHTTP
```

#### 3. GraphQL Handler Processa

**[app.ts](../src/server/app.ts):27**

```typescript
graphqlHTTP(() => ({
  schema,           // Schema GraphQL
  graphiql: true,   // Interface GraphiQL
  context: getContext(),  // Cria contexto
}))
```

**O que acontece:**

1. **Cria Context:**
   ```typescript
   // getContext() é chamado
   const dataloaders = getDataloaders();
   return { dataloaders };
   ```

2. **Parse Query:**
   ```
   String: "query { messages(first: 2) ... }"
       ↓
   AST (Abstract Syntax Tree):
   {
     kind: 'Document',
     definitions: [{
       kind: 'OperationDefinition',
       operation: 'query',
       selectionSet: {
         selections: [{
           name: { value: 'messages' },
           arguments: [{ name: 'first', value: 2 }]
         }]
       }
     }]
   }
   ```

3. **Valida Query:**
   - Verifica se campo 'messages' existe em QueryType
   - Verifica se argumentos são válidos
   - Verifica tipos

#### 4. Resolve Query

**[QueryType.ts](../src/schema/QueryType.ts):8**

```typescript
export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...messageConnectionField('messages'),
  }),
});
```

**Expande para:**
```typescript
{
  messages: {
    type: MessageConnection.connectionType,
    args: { first: Int, after: String, ... },
    resolve: async (_, args, context) => {
      return await MessageLoader.loadAll(context, args);
    },
  }
}
```

**Execução do resolver:**
```typescript
// args = { first: 2 }
// context = { dataloaders: { MessageLoader: ... } }

const result = await MessageLoader.loadAll(context, args);
```

#### 5. DataLoader Busca Dados

**[MessageLoader.ts](../src/modules/message/MessageLoader.ts):7**

```typescript
const { load, loadAll } = createLoader({
  model: Message,
  loaderName: "MessageLoader",
});
```

**loadAll internamente faz:**

1. **Busca no MongoDB:**
   ```typescript
   const messages = await Message.find()
     .sort({ createdAt: -1 })
     .limit(2);
   ```

2. **Converte para Connection:**
   ```typescript
   const edges = messages.map((message, index) => ({
     cursor: offsetToCursor(index),
     node: message,
   }));

   return {
     edges,
     pageInfo: {
       hasNextPage: messages.length === 2,
       hasPreviousPage: false,
     },
   };
   ```

#### 6. MongoDB Executa Query

```
DataLoader
    ↓
Mongoose
    ↓
MongoDB Driver
    ↓
MongoDB Server
```

**Query executada:**
```javascript
db.Message.find({}).sort({ createdAt: -1 }).limit(2)
```

**Resultado do MongoDB:**
```javascript
[
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    content: "Hello World",
    createdAt: ISODate("2024-01-15T10:30:00Z"),
    updatedAt: ISODate("2024-01-15T10:30:00Z")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    content: "Second message",
    createdAt: ISODate("2024-01-15T11:00:00Z"),
    updatedAt: ISODate("2024-01-15T11:00:00Z")
  }
]
```

#### 7. Resolve Campos Aninhados

Para cada mensagem, GraphQL resolve os campos solicitados:

**[MessageType.ts](../src/modules/message/MessageType.ts):14**

```typescript
const MessageType = new GraphQLObjectType({
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
});
```

**Para cada mensagem:**
```typescript
// message = { _id: "507f...", content: "Hello", createdAt: Date }

id: globalIdField('Message')
  → toGlobalId('Message', '507f1f77bcf86cd799439011')
  → "TWVzc2FnZTo1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTE="

content: message.content
  → "Hello World"

createdAt: message.createdAt.toISOString()
  → "2024-01-15T10:30:00.000Z"
```

#### 8. Monta Resposta

```javascript
{
  "data": {
    "messages": {
      "edges": [
        {
          "node": {
            "id": "TWVzc2FnZTo1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTE=",
            "content": "Hello World",
            "createdAt": "2024-01-15T10:30:00.000Z"
          }
        },
        {
          "node": {
            "id": "TWVzc2FnZTo1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTI=",
            "content": "Second message",
            "createdAt": "2024-01-15T11:00:00.000Z"
          }
        }
      ]
    }
  }
}
```

#### 9. Retorna ao Cliente

```
GraphQL
    ↓ JSON
Koa Router
    ↓ ctx.body = result
Logger Middleware
    → Loga: --> POST /graphql 200 42ms
    ↓
CORS Middleware
    → Adiciona headers
    ↓ HTTP Response
Cliente
```

**Response HTTP:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "data": { ... }
}
```

## Fluxo de Mutation (Modificação)

### Exemplo: Criar Mensagem

**Mutation GraphQL:**
```graphql
mutation {
  MessageAdd(input: {
    content: "Nova mensagem"
    clientMutationId: "1"
  }) {
    message {
      id
      content
    }
    clientMutationId
  }
}
```

### Passo a Passo Detalhado

#### 1-3. Igual ao Fluxo de Query

Requisição → Koa → GraphQL Handler

#### 4. Resolve Mutation

**[MutationType.ts](../src/schema/MutationType.ts):7**

```typescript
export const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...messageMutations,  // { MessageAdd: ... }
  }),
});
```

**[MessageAddMutation.ts](../src/modules/message/mutations/MessageAddMutation.ts):11**

```typescript
const mutation = mutationWithClientMutationId({
  name: "MessageAdd",

  inputFields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
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

#### 5. Valida Input

```typescript
// args = { content: "Nova mensagem" }

// GraphQL valida:
if (!args.content) {
  throw new Error('Field "content" of required type "String!" was not provided');
}
```

#### 6. Executa mutateAndGetPayload

```typescript
const message = await new Message({
  content: "Nova mensagem",
}).save();
```

**O que acontece:**

1. **Cria documento Mongoose:**
   ```typescript
   const message = new Message({
     content: "Nova mensagem",
   });
   ```

2. **Valida contra schema:**
   ```typescript
   // MessageModel.ts definiu:
   // content: { type: String }
   // Mongoose valida tipo
   ```

3. **Salva no MongoDB:**
   ```typescript
   await message.save();
   ```

#### 7. MongoDB Insere Documento

**Comando MongoDB:**
```javascript
db.Message.insertOne({
  content: "Nova mensagem",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Resultado:**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  content: "Nova mensagem",
  createdAt: ISODate("2024-01-15T12:00:00Z"),
  updatedAt: ISODate("2024-01-15T12:00:00Z")
}
```

#### 8. Retorna Payload

```typescript
return {
  message: message._id.toString(),
  // "507f1f77bcf86cd799439013"
};
```

#### 9. Resolve Output Fields

```typescript
outputFields: {
  ...messageField("message"),
}
```

**Expande para:**
```typescript
{
  message: {
    type: MessageType,
    resolve: async (obj, _, context) =>
      MessageLoader.load(context, obj.message),
  }
}
```

**Execução:**
```typescript
// obj = { message: "507f1f77bcf86cd799439013" }
const message = await MessageLoader.load(context, "507f1f77bcf86cd799439013");
```

**DataLoader busca:**
```typescript
const message = await Message.findById("507f1f77bcf86cd799439013");
```

#### 10. Resolve Campos da Mensagem

Igual ao fluxo de query, resolve:
- `id`: Global ID
- `content`: "Nova mensagem"

#### 11. Monta Resposta

```javascript
{
  "data": {
    "MessageAdd": {
      "message": {
        "id": "TWVzc2FnZTo1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTM=",
        "content": "Nova mensagem"
      },
      "clientMutationId": "1"
    }
  }
}
```

#### 12. Retorna ao Cliente

Igual ao fluxo de query.

## Fluxo de Context

**Por Requisição:**

```
Nova Requisição
    ↓
graphqlHTTP(() => ({
  context: getContext(),  // Chamado a cada requisição!
}))
    ↓
getContext()
    ↓
getDataloaders()
    → Para cada loader registrado:
      → loaders[key]() cria nova instância DataLoader
    ↓
return { dataloaders }
    ↓
Context disponível em todos os resolvers
    ↓
Requisição termina
    ↓
Context descartado (cache limpo)
```

## Fluxo de DataLoader (N+1 Prevention)

### Cenário: Buscar mensagens e seus autores

```graphql
query {
  messages(first: 10) {
    edges {
      node {
        content
        author {  # Cada mensagem tem um autor
          name
        }
      }
    }
  }
}
```

### Sem DataLoader

```
1. Buscar mensagens: SELECT * FROM messages LIMIT 10
2. Para mensagem 1: SELECT * FROM users WHERE id = 1
3. Para mensagem 2: SELECT * FROM users WHERE id = 2
4. Para mensagem 3: SELECT * FROM users WHERE id = 3
...
11. Para mensagem 10: SELECT * FROM users WHERE id = 10

Total: 11 queries!
```

### Com DataLoader

```
1. Buscar mensagens: SELECT * FROM messages LIMIT 10

2. Resolver campo 'author' para cada mensagem:
   - message 1: userLoader.load('1')
   - message 2: userLoader.load('2')
   - message 3: userLoader.load('3')
   ...
   - message 10: userLoader.load('10')

3. DataLoader agrupa:
   batchLoadFn(['1', '2', '3', ..., '10'])

4. Uma query:
   SELECT * FROM users WHERE id IN ('1', '2', '3', ..., '10')

Total: 2 queries!
```

### Como DataLoader Agrupa

```typescript
// Tick 1 do event loop
userLoader.load('1');  // Adicionado à fila
userLoader.load('2');  // Adicionado à fila
userLoader.load('3');  // Adicionado à fila

// Fim do tick
// DataLoader executa batchLoadFn(['1', '2', '3'])

// Tick 2
userLoader.load('1');  // Cache hit! Retorna imediatamente
userLoader.load('4');  // Adicionado à fila

// Fim do tick
// DataLoader executa batchLoadFn(['4'])
```

## Diagrama Completo: Query

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ POST /graphql { query: "..." }
       ↓
┌─────────────────────────────────────┐
│          Koa Middlewares            │
│  1. CORS                            │
│  2. Logger                          │
│  3. Body Parser                     │
└──────┬──────────────────────────────┘
       │ ctx.request.body
       ↓
┌─────────────────────────────────────┐
│       koa-graphql Handler           │
│  - Cria context: getContext()       │
│  - Parse query                      │
│  - Valida query                     │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│          Schema Resolver            │
│  QueryType.fields.messages          │
└──────┬──────────────────────────────┘
       │ MessageLoader.loadAll(ctx, args)
       ↓
┌─────────────────────────────────────┐
│           DataLoader                │
│  - Agrupa requisições               │
│  - Usa cache                        │
└──────┬──────────────────────────────┘
       │ Message.find().limit(10)
       ↓
┌─────────────────────────────────────┐
│         MongoDB Query               │
│  db.Message.find().limit(10)        │
└──────┬──────────────────────────────┘
       │ Documentos
       ↓
┌─────────────────────────────────────┐
│       Resolve Campos                │
│  - id: globalIdField                │
│  - content: message.content         │
│  - createdAt: message.createdAt     │
└──────┬──────────────────────────────┘
       │ JSON
       ↓
┌─────────────────────────────────────┐
│     Resposta HTTP                   │
│  { data: { messages: { ... } } }    │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────┐
│   Cliente   │
└─────────────┘
```

## Diagrama Completo: Mutation

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ POST /graphql { mutation: "..." }
       ↓
┌─────────────────────────────────────┐
│       [Igual Query: Koa + Parse]    │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│       MutationType Resolver         │
│  MessageAddMutation                 │
└──────┬──────────────────────────────┘
       │ Valida input
       ↓
┌─────────────────────────────────────┐
│     mutateAndGetPayload             │
│  new Message({ ... }).save()        │
└──────┬──────────────────────────────┘
       │ INSERT INTO messages
       ↓
┌─────────────────────────────────────┐
│         MongoDB Insert              │
│  db.Message.insertOne({ ... })      │
└──────┬──────────────────────────────┘
       │ Novo documento
       ↓
┌─────────────────────────────────────┐
│      Output Fields Resolver         │
│  MessageLoader.load(ctx, id)        │
└──────┬──────────────────────────────┘
       │ SELECT FROM messages WHERE id
       ↓
┌─────────────────────────────────────┐
│         MongoDB Query               │
│  db.Message.findOne({ _id: ... })   │
└──────┬──────────────────────────────┘
       │ Documento completo
       ↓
┌─────────────────────────────────────┐
│       Resolve Campos                │
│  [Igual Query]                      │
└──────┬──────────────────────────────┘
       │ JSON
       ↓
┌─────────────┐
│   Cliente   │
└─────────────┘
```

## Resumo dos Componentes

| Componente | Responsabilidade | Arquivo |
|------------|------------------|---------|
| **Koa** | Receber/responder HTTP | [app.ts](../src/server/app.ts) |
| **CORS** | Permitir cross-origin | [app.ts](../src/server/app.ts):13 |
| **Logger** | Logar requisições | [app.ts](../src/server/app.ts):14 |
| **Body Parser** | Parse JSON | [app.ts](../src/server/app.ts):15 |
| **Router** | Gerenciar rotas | [app.ts](../src/server/app.ts):23 |
| **graphqlHTTP** | Processar GraphQL | [app.ts](../src/server/app.ts):25 |
| **Schema** | Definir API | [schema.ts](../src/schema/schema.ts) |
| **QueryType** | Queries disponíveis | [QueryType.ts](../src/schema/QueryType.ts) |
| **MutationType** | Mutations disponíveis | [MutationType.ts](../src/schema/MutationType.ts) |
| **Context** | Compartilhar dados | [getContext.ts](../src/server/getContext.ts) |
| **DataLoader** | Otimizar queries | [MessageLoader.ts](../src/modules/message/MessageLoader.ts) |
| **Model** | Estrutura de dados | [MessageModel.ts](../src/modules/message/MessageModel.ts) |
| **Mongoose** | ODM MongoDB | [database.ts](../src/database.ts) |
| **MongoDB** | Banco de dados | - |

## Dicas de Debug

### 1. Ver Queries MongoDB

```typescript
// database.ts
mongoose.set('debug', true);

// Console mostrará:
// Mongoose: messages.find({}) { limit: 10 }
```

### 2. Logar Resolvers

```typescript
resolve: async (obj, args, context) => {
  console.log('Resolver chamado:', { obj, args });
  const result = await MessageLoader.load(context, args.id);
  console.log('Resultado:', result);
  return result;
}
```

### 3. Verificar Context

```typescript
graphqlHTTP(() => {
  const context = getContext();
  console.log('Context criado:', Object.keys(context.dataloaders));
  return { schema, context };
})
```

### 4. Monitorar DataLoader

```typescript
const loader = new DataLoader(batchFn, {
  batch: true,
  cache: true,
  cacheKeyFn: (key) => {
    console.log('Cache key:', key);
    return key;
  },
});
```

## Conclusão

Agora você entende o fluxo completo:

1. Cliente faz requisição HTTP
2. Koa processa com middlewares
3. GraphQL parseia e valida query
4. Resolvers executam lógica
5. DataLoaders otimizam banco
6. MongoDB retorna dados
7. GraphQL monta resposta
8. Cliente recebe JSON

Continue explorando o código e experimentando!
