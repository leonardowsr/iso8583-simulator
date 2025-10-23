# DataLoaders - Otimização de Queries

## O Problema: N+1 Query

Imagine que você quer buscar 10 mensagens e o autor de cada uma:

```graphql
query {
  messages(first: 10) {
    edges {
      node {
        content
        author {  # Busca o autor de cada mensagem
          name
        }
      }
    }
  }
}
```

**Sem DataLoader:**
```
1. SELECT * FROM messages LIMIT 10
2. SELECT * FROM users WHERE id = 1  (autor da mensagem 1)
3. SELECT * FROM users WHERE id = 2  (autor da mensagem 2)
4. SELECT * FROM users WHERE id = 3  (autor da mensagem 3)
... 10 queries de usuários!

Total: 11 queries! (1 + 10)
```

**Com DataLoader:**
```
1. SELECT * FROM messages LIMIT 10
2. SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Total: 2 queries! (1 + 1)
```

## O que é DataLoader?

DataLoader é uma biblioteca que:
1. **Agrupa requisições**: Junta múltiplas buscas em uma só
2. **Cache**: Evita buscar o mesmo item mais de uma vez
3. **Por requisição**: Novo loader a cada request (evita cache entre usuários)

## Como DataLoader Funciona

### Batching (Agrupamento)

```typescript
// Múltiplas chamadas durante a mesma tick do event loop
loader.load('1');
loader.load('2');
loader.load('3');

// DataLoader agrupa automaticamente em uma chamada:
batchLoadFn(['1', '2', '3'])
```

### Caching

```typescript
// Primeira vez: busca no banco
const message1 = await loader.load('123');

// Segunda vez: retorna do cache
const message2 = await loader.load('123');  // Mesmo ID, retorna cache!
```

## DataLoader no Projeto

### Biblioteca Helper: @entria/graphql-mongo-helpers

O projeto usa uma biblioteca da Entria que facilita criar DataLoaders para MongoDB/Mongoose.

### Arquivo: [MessageLoader.ts](../src/modules/message/MessageLoader.ts)

```typescript
import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../_loader/loaderRegister";
import { Message } from "./MessageModel";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: Message,
  loaderName: "MessageLoader",
});

registerLoader("MessageLoader", getLoader);

export const MessageLoader = {
  Message: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};
```

### Passo a Passo

#### 1. createLoader

```typescript
const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: Message,
  loaderName: "MessageLoader",
});
```

**O que retorna:**

- **`Wrapper`**: Wrapper para o tipo GraphQL (adiciona metadata)
- **`getLoader`**: Função que cria uma nova instância do loader
- **`clearCache`**: Limpa o cache do loader
- **`load`**: Função para carregar um único item
- **`loadAll`**: Função para carregar múltiplos itens (com paginação)

**Como funciona internamente:**
```typescript
// Simplificado
function createLoader({ model }) {
  return {
    load: async (context, id) => {
      // Busca no DataLoader do contexto
      const loader = context.dataloaders.MessageLoader;
      return loader.load(id);
    },

    loadAll: async (context, args) => {
      // Busca todos com paginação
      const messages = await model.find()
        .skip(args.offset)
        .limit(args.first);

      return connectionFromMongoCursor({
        cursor: messages,
        args,
      });
    },
  };
}
```

#### 2. registerLoader

```typescript
registerLoader("MessageLoader", getLoader);
```

**O que faz:**
- Registra o loader globalmente
- Permite criar instâncias do loader no contexto
- Cada requisição terá seu próprio loader

**Arquivo:** [loaderRegister.ts](../src/modules/_loader/loaderRegister.ts)

```typescript
const loaders: Record<string, () => unknown> = {};

const registerLoader = (key: string, getLoader: () => unknown) => {
  loaders[key] = getLoader;
};

const getDataloaders = (): Record<string, () => unknown> =>
  Object.keys(loaders).reduce(
    (prev, loaderKey) => ({
      ...prev,
      [loaderKey]: loaders[loaderKey](),  // Cria nova instância
    }),
    {},
  );
```

**Fluxo:**
```
1. registerLoader("MessageLoader", getLoader)
   → Armazena getLoader em loaders["MessageLoader"]

2. getDataloaders()
   → Para cada loader registrado, cria nova instância
   → Retorna { MessageLoader: new DataLoader(...) }

3. getContext()
   → Chama getDataloaders()
   → Contexto tem dataloaders frescos a cada requisição
```

## Usando DataLoaders

### Carregar um Item: load()

```typescript
import { MessageLoader } from './MessageLoader';

// No resolver
const message = await MessageLoader.load(context, messageId);
```

**Assinatura:**
```typescript
load(context: Context, id: string): Promise<Message | null>
```

**Exemplo de uso:** [messageFields.ts](../src/modules/message/messageFields.ts):14

```typescript
export const messageField = (key: string) => ({
  [key]: {
    type: MessageType,
    resolve: async (obj, _, context) =>
      MessageLoader.load(context, obj.message as string),
  },
});
```

### Carregar Múltiplos: loadAll()

```typescript
const connection = await MessageLoader.loadAll(context, {
  first: 10,        // Primeiros 10
  after: cursor,    // Depois deste cursor
});
```

**Assinatura:**
```typescript
loadAll(
  context: Context,
  args: ConnectionArguments
): Promise<Connection<Message>>
```

**Exemplo de uso:** [messageFields.ts](../src/modules/message/messageFields.ts):25

```typescript
export const messageConnectionField = (key: string) => ({
  [key]: {
    type: MessageConnection.connectionType,
    args: { ...connectionArgs },
    resolve: async (_, args, context) => {
      return await MessageLoader.loadAll(context, args);
    },
  },
});
```

## Context e DataLoaders

### Criação do Context: [getContext.ts](../src/server/getContext.ts)

```typescript
import { getDataloaders } from "../modules/_loader/loaderRegister";

const getContext = () => {
  const dataloaders = getDataloaders();

  return {
    dataloaders,
  } as const;
};
```

**Por que criar novo context a cada requisição?**
1. **Isolamento**: Cache não vaza entre requisições
2. **Segurança**: Dados de um usuário não vazam para outro
3. **Performance**: Cache otimizado para cada query específica

### Fluxo Completo

```
1. Cliente faz query
         ↓
2. graphqlHTTP cria contexto
   → getContext() é chamado
   → getDataloaders() cria novos loaders
         ↓
3. Resolver executa
   → MessageLoader.load(context, id)
   → Usa loader do contexto
         ↓
4. DataLoader agrupa chamadas
   → Busca múltiplos IDs de uma vez
   → Retorna resultados
         ↓
5. Resposta enviada ao cliente
   → Contexto/cache descartado
```

## Exemplo Prático

### Query GraphQL

```graphql
query {
  messages(first: 3) {
    edges {
      node {
        id
        content
        # Imagine que Message tem um campo 'author'
        author {
          name
        }
      }
    }
  }
}
```

### Fluxo Sem DataLoader

```typescript
// Resolver de messages
const messages = await Message.find().limit(3);
// Query 1: SELECT * FROM messages LIMIT 3

// Para cada mensagem, resolver de author
for (const message of messages) {
  const author = await User.findById(message.authorId);
  // Query 2: SELECT * FROM users WHERE id = 1
  // Query 3: SELECT * FROM users WHERE id = 2
  // Query 4: SELECT * FROM users WHERE id = 3
}

// Total: 4 queries (1 + 3)
```

### Fluxo Com DataLoader

```typescript
// Resolver de messages
const messages = await Message.find().limit(3);
// Query 1: SELECT * FROM messages LIMIT 3

// Para cada mensagem, usar DataLoader
for (const message of messages) {
  userLoader.load(message.authorId);
  // Não executa query ainda, apenas agrupa!
}

// Após o event loop tick, DataLoader executa:
// Query 2: SELECT * FROM users WHERE id IN (1, 2, 3)

// Total: 2 queries (1 + 1)
```

## Recursos Avançados

### clearCache()

```typescript
// Limpa cache do loader (raramente necessário)
MessageLoader.clearCache(context, id);
```

**Quando usar:**
- Depois de uma mutation que atualiza um item
- Para forçar reload de dados

```typescript
mutateAndGetPayload: async (args, context) => {
  const message = await Message.findByIdAndUpdate(
    args.id,
    { content: args.content }
  );

  // Limpa cache para garantir dados frescos
  MessageLoader.clearCache(context, args.id);

  return { message: message._id };
}
```

### Wrapper

```typescript
export const MessageLoader = {
  Message: Wrapper,  // Wrapper do tipo
  // ...
};
```

**O que é:**
- Wrapper que adiciona metadata ao tipo GraphQL
- Usado internamente pela biblioteca
- Raramente usado diretamente

## Criando Seu Próprio DataLoader

Se precisar criar um loader customizado:

```typescript
import DataLoader from 'dataloader';

// Função batch que recebe múltiplos IDs
const batchLoadUsers = async (ids: string[]) => {
  // Busca todos os usuários de uma vez
  const users = await User.find({ _id: { $in: ids } });

  // Cria mapa id → user
  const userMap = new Map(
    users.map(user => [user._id.toString(), user])
  );

  // IMPORTANTE: Retorna na mesma ordem dos IDs!
  return ids.map(id => userMap.get(id) || null);
};

// Cria o DataLoader
const userLoader = new DataLoader(batchLoadUsers);

// Uso
const user1 = await userLoader.load('1');
const user2 = await userLoader.load('2');
const users = await userLoader.loadMany(['3', '4', '5']);
```

**Regras importantes:**
1. Retornar array com **mesmo tamanho** que ids
2. Retornar na **mesma ordem** que ids
3. Retornar `null` para IDs não encontrados

## TypeScript e DataLoaders

### Tipo do Context

```typescript
import type { BaseContext } from "@entria/graphql-mongo-helpers";

type Context = {
  dataloaders: {
    MessageLoader: ReturnType<typeof MessageLoader.getLoader>;
  };
};

// Nos resolvers
resolve: async (obj, args, context: Context) => {
  const message = await MessageLoader.load(context, args.id);
  return message;
}
```

### Tipo do Loader

```typescript
import type { IMessage } from './MessageModel';

// Loader retorna IMessage ou null
MessageLoader.load(context, id) // Promise<IMessage | null>
```

## Performance e Boas Práticas

### 1. Sempre use DataLoaders

```typescript
// ❌ EVITE: Busca direta no resolver
resolve: async (obj) => {
  return await User.findById(obj.authorId);
}

// ✅ BOM: Use DataLoader
resolve: async (obj, _, context) => {
  return await UserLoader.load(context, obj.authorId);
}
```

### 2. Cache por Requisição

```typescript
// ✅ BOM: Novo context a cada requisição
graphqlHTTP(() => ({
  schema,
  context: getContext(),  // Função que cria novo contexto
}))

// ❌ EVITE: Context compartilhado
const sharedContext = getContext();
graphqlHTTP(() => ({
  schema,
  context: sharedContext,  // Mesmo context = cache vazando!
}))
```

### 3. Primeiros Carregamentos

```typescript
// Se você já tem os dados, pode popular o cache
const message = await Message.create({ content: 'Hello' });

// Popula cache do loader
const loader = context.dataloaders.MessageLoader;
loader.prime(message._id.toString(), message);

// Próxima chamada usa cache
const cached = await MessageLoader.load(context, message._id);
```

### 4. Monitore Queries

Use logs para verificar se DataLoaders estão funcionando:

```typescript
// Em database.ts
mongoose.set('debug', true);

// Vai logar todas as queries do MongoDB
// Verifique se múltiplas queries foram agrupadas
```

## Troubleshooting

### Problema: Muitas queries ainda

**Causa:** Pode estar buscando fora do DataLoader

**Solução:**
```typescript
// ❌ Busca direta
const messages = await Message.find();

// ✅ Use loadAll
const connection = await MessageLoader.loadAll(context, { first: 10 });
```

### Problema: Dados desatualizados

**Causa:** Cache do DataLoader

**Solução:**
```typescript
// Limpar cache após mutation
MessageLoader.clearCache(context, id);
```

### Problema: TypeError context is undefined

**Causa:** Esqueceu de passar context

**Solução:**
```typescript
// ❌ Faltando context
MessageLoader.load(id)

// ✅ Com context
MessageLoader.load(context, id)
```

## Comparação: Com vs Sem DataLoader

| Aspecto | Sem DataLoader | Com DataLoader |
|---------|----------------|----------------|
| Queries | N+1 (muitas) | 1 ou 2 (poucas) |
| Performance | Lento | Rápido |
| Complexidade | Simples | Média |
| Recomendado | Nunca | Sempre |

## Recursos Adicionais

- DataLoader GitHub: https://github.com/graphql/dataloader
- @entria/graphql-mongo-helpers: https://github.com/entria/graphql-mongo-helpers
- GraphQL Best Practices: https://graphql.org/learn/best-practices/#batching

## Próximo Passo

Agora vamos entender como organizar código em módulos: **[05-estrutura-modulos.md](05-estrutura-modulos.md)**

