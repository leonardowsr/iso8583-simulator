# Estrutura de Módulos - Organização do Código

## O que é um Módulo?

Um módulo é uma unidade lógica que agrupa toda a funcionalidade relacionada a uma entidade do sistema.

**Exemplo:** O módulo `message` contém tudo relacionado a mensagens:
- Model (estrutura de dados)
- Loader (otimização de queries)
- Type (tipo GraphQL)
- Fields (campos reutilizáveis)
- Mutations (operações de modificação)

## Estrutura do Projeto

```
src/
├── config.ts                  # Configurações gerais
├── database.ts                # Conexão com MongoDB
├── index.ts                   # Ponto de entrada
│
├── server/                    # Servidor Koa
│   ├── app.ts                 # Configuração do app
│   └── getContext.ts          # Contexto GraphQL
│
├── schema/                    # Schema GraphQL
│   ├── schema.ts              # Schema principal
│   ├── QueryType.ts           # Queries disponíveis
│   └── MutationType.ts        # Mutations disponíveis
│
└── modules/                   # Módulos da aplicação
    ├── message/               # Módulo de mensagens
    │   ├── MessageModel.ts
    │   ├── MessageLoader.ts
    │   ├── MessageType.ts
    │   ├── messageFields.ts
    │   └── mutations/
    │       ├── MessageAddMutation.ts
    │       └── messageMutations.ts
    │
    ├── _loader/               # Sistema de loaders
    │   └── loaderRegister.ts
    │
    ├── _node/                 # Sistema de nodes
    │   └── typeRegister.ts
    │
    └── _error/                # Sistema de erros
        └── errorFields.ts
```

## Anatomia de um Módulo

Vamos usar o módulo `message` como exemplo completo.

### 1. Model - Estrutura de Dados

**Arquivo:** [MessageModel.ts](../src/modules/message/MessageModel.ts)

```typescript
import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IMessage>(
  {
    content: {
      type: String,
      description: 'The content of the message',
    },
  },
  {
    collection: 'Message',
    timestamps: true,
  }
);

export type IMessage = {
  content: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;

export const Message: Model<IMessage> = mongoose.model('Message', Schema);
```

**Responsabilidades:**
- Define schema do MongoDB
- Exporta interface TypeScript
- Exporta model para operações CRUD

### 2. Loader - Otimização de Queries

**Arquivo:** [MessageLoader.ts](../src/modules/message/MessageLoader.ts)

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

**Responsabilidades:**
- Cria DataLoader para o model
- Registra loader globalmente
- Exporta funções de carregamento

### 3. Type - Tipo GraphQL

**Arquivo:** [MessageType.ts](../src/modules/message/MessageType.ts)

```typescript
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { IMessage } from './MessageModel';
import { nodeInterface, registerTypeLoader } from '../_node/typeRegister';
import { MessageLoader } from './MessageLoader';

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

const MessageConnection = connectionDefinitions({
  name: 'Message',
  nodeType: MessageType,
});

registerTypeLoader(MessageType, MessageLoader.load);

export { MessageType, MessageConnection };
```

**Responsabilidades:**
- Define tipo GraphQL
- Define campos disponíveis
- Cria connection para paginação
- Registra loader para o tipo

### 4. Fields - Campos Reutilizáveis

**Arquivo:** [messageFields.ts](../src/modules/message/messageFields.ts)

```typescript
import type { BaseContext } from "@entria/graphql-mongo-helpers";
import { connectionArgs } from "graphql-relay";
import { MessageLoader } from "./MessageLoader";
import type { IMessage } from "./MessageModel";
import { MessageConnection, MessageType } from "./MessageType";

export const messageField = (key: string) => ({
  [key]: {
    type: MessageType,
    resolve: async (
      obj: Record<string, unknown>,
      _: any,
      context: BaseContext<"MessageLoader", IMessage>,
    ) => MessageLoader.load(context, obj.message as string),
  },
});

export const messageConnectionField = (key: string) => ({
  [key]: {
    type: MessageConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: async (_: any, args: any, context: any) => {
      return await MessageLoader.loadAll(context, args);
    },
  },
});
```

**Responsabilidades:**
- Cria campos reutilizáveis
- `messageField`: Campo para uma mensagem
- `messageConnectionField`: Campo para lista paginada

**Por que criar fields separados?**
- Reutilização em queries e mutations
- Padrão consistente
- DRY (Don't Repeat Yourself)

### 5. Mutations - Operações de Modificação

**Arquivo:** [MessageAddMutation.ts](../src/modules/message/mutations/MessageAddMutation.ts)

```typescript
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Message } from "../MessageModel";
import { messageField } from "../messageFields";

export type MessageAddInput = {
  content: string;
};

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

export const MessageAddMutation = {
  ...mutation,
};
```

**Responsabilidades:**
- Define mutation GraphQL
- Valida inputs
- Executa operação no banco
- Retorna resultado

**Arquivo:** [messageMutations.ts](../src/modules/message/mutations/messageMutations.ts)

```typescript
import { MessageAddMutation } from './MessageAddMutation';

export const messageMutations = {
  MessageAdd: MessageAddMutation,
};
```

**Por que este arquivo?**
- Agrupa todas as mutations do módulo
- Facilita importação no MutationType
- Escalável (fácil adicionar novas mutations)

## Módulos Especiais

### Módulo _loader

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
      [loaderKey]: loaders[loaderKey](),
    }),
    {},
  );

export { registerLoader, getDataloaders };
```

**Responsabilidades:**
- Registro global de loaders
- Criação de loaders por requisição
- Usado em `getContext()`

**Por que `_loader`?**
- Prefixo `_` indica módulo interno/utilitário
- Não é uma entidade de domínio
- Infraestrutura do sistema

### Módulo _node

**Arquivo:** [typeRegister.ts](../src/modules/_node/typeRegister.ts)

```typescript
import type { GraphQLObjectType, GraphQLTypeResolver } from "graphql";
import { fromGlobalId, nodeDefinitions } from "graphql-relay";

type Load = (context: unknown, id: string) => unknown;
type TypeLoaders = {
  [key: string]: {
    type: GraphQLObjectType;
    load: Load;
  };
};

const getTypeRegister = () => {
  const typesLoaders: TypeLoaders = {};

  const registerTypeLoader = (type: GraphQLObjectType, load: Load) => {
    typesLoaders[type.name] = {
      type,
      load,
    };
    return type;
  };

  const { nodeField, nodeInterface } = nodeDefinitions(
    (globalId: string, context: unknown) => {
      const { type, id } = fromGlobalId(globalId);
      const { load } = typesLoaders[type] || { load: null };
      return (load?.(context, id)) || null;
    },
    (obj: GraphQLTypeResolver<unknown, unknown>) => {
      const { type } = typesLoaders[obj.constructor.name] || { type: null };
      return type.name;
    },
  );

  return {
    registerTypeLoader,
    nodeInterface,
    nodeField,
  };
};

const { registerTypeLoader, nodeInterface, nodeField } = getTypeRegister();

export { registerTypeLoader, nodeInterface, nodeField };
```

**Responsabilidades:**
- Implementa padrão Node do Relay
- Permite buscar qualquer objeto por ID global
- Registra tipos e seus loaders

**Como funciona:**
1. Cada tipo chama `registerTypeLoader(MessageType, MessageLoader.load)`
2. Registry armazena: `{ Message: { type: MessageType, load: loadFn } }`
3. Query `node(id: "...")` decodifica ID e usa loader correto

### Módulo _error

**Arquivo:** [errorFields.ts](../src/modules/_error/errorFields.ts)

```typescript
// Campos para tratamento de erros padronizado
// Usado em mutations para retornar erros de validação
```

**Responsabilidades:**
- Define campos de erro padrão
- Usado em mutations para retornar erros

## Como os Módulos se Conectam

### 1. Schema Principal

**[schema.ts](../src/schema/schema.ts):**
```typescript
import { GraphQLSchema } from "graphql";
import { MutationType } from "./MutationType";
import { QueryType } from "./QueryType";

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
```

### 2. Query Type

**[QueryType.ts](../src/schema/QueryType.ts):**
```typescript
import { GraphQLObjectType } from 'graphql';
import { messageConnectionField } from '../modules/message/messageFields';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...messageConnectionField('messages'),
    // Outros módulos adicionariam seus campos aqui:
    // ...userConnectionField('users'),
    // ...postConnectionField('posts'),
  }),
});
```

### 3. Mutation Type

**[MutationType.ts](../src/schema/MutationType.ts):**
```typescript
import { GraphQLObjectType } from "graphql";
import { messageMutations } from "../modules/message/mutations/messageMutations";

export const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...messageMutations,
    // Outros módulos adicionariam suas mutations aqui:
    // ...userMutations,
    // ...postMutations,
  }),
});
```

## Criando um Novo Módulo

Vamos criar um módulo `User` como exemplo.

### Passo 1: Criar Pasta

```
src/modules/user/
```

### Passo 2: Model

**UserModel.ts:**
```typescript
import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: 'User',
    timestamps: true,
  }
);

export type IUser = {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;

export const User: Model<IUser> = mongoose.model('User', Schema);
```

### Passo 3: Loader

**UserLoader.ts:**
```typescript
import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../_loader/loaderRegister";
import { User } from "./UserModel";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: User,
  loaderName: "UserLoader",
});

registerLoader("UserLoader", getLoader);

export const UserLoader = {
  User: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};
```

### Passo 4: Type

**UserType.ts:**
```typescript
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { IUser } from './UserModel';
import { nodeInterface, registerTypeLoader } from '../_node/typeRegister';
import { UserLoader } from './UserLoader';

const UserType = new GraphQLObjectType<IUser>({
  name: 'User',
  description: 'Represents a user',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.name,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.email,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (user) => user.createdAt.toISOString(),
    },
  }),
  interfaces: () => [nodeInterface],
});

const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

registerTypeLoader(UserType, UserLoader.load);

export { UserType, UserConnection };
```

### Passo 5: Fields

**userFields.ts:**
```typescript
import { connectionArgs } from "graphql-relay";
import { UserLoader } from "./UserLoader";
import { UserConnection, UserType } from "./UserType";

export const userField = (key: string) => ({
  [key]: {
    type: UserType,
    resolve: async (obj: any, _: any, context: any) =>
      UserLoader.load(context, obj.user),
  },
});

export const userConnectionField = (key: string) => ({
  [key]: {
    type: UserConnection.connectionType,
    args: { ...connectionArgs },
    resolve: async (_: any, args: any, context: any) => {
      return await UserLoader.loadAll(context, args);
    },
  },
});
```

### Passo 6: Mutations

**mutations/UserRegisterMutation.ts:**
```typescript
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { User } from "../UserModel";
import { userField } from "../userFields";

export type UserRegisterInput = {
  name: string;
  email: string;
};

const mutation = mutationWithClientMutationId({
  name: "UserRegister",
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async (args: UserRegisterInput) => {
    const user = await new User({
      name: args.name,
      email: args.email,
    }).save();

    return { user: user._id.toString() };
  },
  outputFields: {
    ...userField("user"),
  },
});

export const UserRegisterMutation = { ...mutation };
```

**mutations/userMutations.ts:**
```typescript
import { UserRegisterMutation } from './UserRegisterMutation';

export const userMutations = {
  UserRegister: UserRegisterMutation,
};
```

### Passo 7: Adicionar ao Schema

**QueryType.ts:**
```typescript
import { userConnectionField } from '../modules/user/userFields';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...messageConnectionField('messages'),
    ...userConnectionField('users'),  // Novo!
  }),
});
```

**MutationType.ts:**
```typescript
import { userMutations } from "../modules/user/mutations/userMutations";

export const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...messageMutations,
    ...userMutations,  // Novo!
  }),
});
```

## Padrões e Convenções

### Nomenclatura

- **Model**: `EntityModel.ts` (ex: `UserModel.ts`)
- **Loader**: `EntityLoader.ts` (ex: `UserLoader.ts`)
- **Type**: `EntityType.ts` (ex: `UserType.ts`)
- **Fields**: `entityFields.ts` (ex: `userFields.ts`)
- **Mutations**: `EntityActionMutation.ts` (ex: `UserRegisterMutation.ts`)

### Exports

```typescript
// Model
export type IEntity = { ... };
export const Entity: Model<IEntity> = ...;

// Loader
export const EntityLoader = { ... };

// Type
export { EntityType, EntityConnection };

// Fields
export const entityField = ...;
export const entityConnectionField = ...;

// Mutation
export const EntityActionMutation = ...;
export const entityMutations = ...;
```

### Imports

```typescript
// Sempre use imports relativos dentro do módulo
import { User } from './UserModel';
import { UserLoader } from './UserLoader';

// Use imports absolutos para outros módulos
import { registerLoader } from '../_loader/loaderRegister';
import { nodeInterface } from '../_node/typeRegister';
```

## Vantagens da Arquitetura Modular

1. **Organização**: Código relacionado fica junto
2. **Escalabilidade**: Fácil adicionar novos módulos
3. **Manutenibilidade**: Mudanças são isoladas
4. **Reutilização**: Fields e tipos são reutilizáveis
5. **Testabilidade**: Módulos podem ser testados isoladamente

## Boas Práticas

### 1. Um Módulo por Entidade

```
✅ BOM:
- modules/user/
- modules/message/
- modules/post/

❌ EVITE:
- modules/userAndMessage/
- modules/everything/
```

### 2. Dependências Claras

```typescript
// ✅ BOM: Import explícito
import { MessageLoader } from '../message/MessageLoader';

// ❌ EVITE: Import de index
import { MessageLoader } from '../message';
```

### 3. Módulos Independentes

```typescript
// ✅ BOM: Módulos não dependem um do outro diretamente
// Use relacionamentos via GraphQL

// ❌ EVITE: Importar models de outros módulos
import { User } from '../user/UserModel';
```

### 4. Coesão Alta

Todo código de um módulo deve estar relacionado à mesma entidade.

### 5. Acoplamento Baixo

Módulos devem se comunicar via interfaces bem definidas (GraphQL, Loaders).

## Próximo Passo

Agora vamos ver o fluxo completo de dados: **[06-fluxo-de-dados.md](06-fluxo-de-dados.md)**
