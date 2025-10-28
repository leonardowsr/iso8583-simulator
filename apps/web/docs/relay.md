# Explicação do Módulo Relay

Este documento explica o módulo Relay localizado em `apps/web/src/relay/`. Este módulo configura e facilita o uso do Relay, um cliente GraphQL para React, em uma aplicação Next.js. Abaixo, detalhamos cada arquivo e como utilizá-lo.

## Visão Geral

O Relay é uma biblioteca que ajuda a gerenciar dados GraphQL em aplicações React. Este módulo inclui configurações para ambiente, rede, hidratação e WebSocket para suportar queries, mutations e subscriptions.

## Arquivos do Módulo

### 1. `environment.ts`

Este arquivo cria e configura o ambiente Relay.

**Principais funcionalidades:**
- Cria uma instância de `Environment` do Relay.
- Configura a rede, store e cache.
- Suporte para server-side rendering (SSR) e client-side.
- Logging opcional para debug.

**Como usar:**
- Importe `createEnvironment` e chame-o para obter um ambiente Relay.
- Use o ambiente em contextos onde Relay é necessário.

```typescript
import { createEnvironment } from './relay/environment';

const environment = createEnvironment();
```

### 2. `network.ts`

Define a camada de rede para Relay, incluindo fetching e caching.

**Principais funcionalidades:**
- Cria uma rede Relay com cache de respostas (TTL de 1 minuto).
- Função `fetchResponse` que verifica cache antes de fazer requests.
- `networkFetch` para fazer requests GraphQL via fetch.
- Suporte para preloading de queries.

**Como usar:**
- Chamado automaticamente pelo `createEnvironment`.
- Para preloading, use `getPreloadedQuery` em server-side.

```typescript
import { getPreloadedQuery } from './relay/network';

const preloaded = await getPreloadedQuery(params, variables);
```

### 3. `ReactRelayContainer.tsx`

Um componente React que fornece o contexto Relay.

**Principais funcionalidades:**
- Envolve componentes com `ReactRelayContext.Provider`.
- Usa `Suspense` para renderização assíncrona.
- Integra com `RelayHydrate` para hidratação.

**Como usar:**
- Use para envolver páginas ou componentes que usam Relay.

```tsx
import { ReactRelayContainer } from './relay/ReactRelayContainer';

export default function MyPage() {
  return (
    <ReactRelayContainer Component={MyComponent} props={props} />
  );
}
```

### 4. `RelayHydrate.tsx`

Lida com a hidratação de queries pré-carregadas.

**Principais funcionalidades:**
- Processa `preloadedQueries` das props.
- Define respostas no cache do Relay.
- Renderiza o componente com layout opcional.

**Como usar:**
- Integrado no `ReactRelayContainer`.
- Para layouts customizados, defina `getLayout` no componente.

```tsx
const MyComponent: NextPageWithLayout = () => <div>Hello</div>;
MyComponent.getLayout = (page) => <Layout>{page}</Layout>;
```

### 5. `websocket.ts`

Configura WebSocket para subscriptions GraphQL.

**Principais funcionalidades:**
- Cria cliente WebSocket usando `graphql-ws`.
- Função `subscribe` que retorna um Observable para subscriptions.

**Como usar:**
- Chamado automaticamente pelo Relay para subscriptions.
- Para usar subscriptions em componentes, use hooks do Relay como `useSubscription`.

```typescript
import { useSubscription } from 'react-relay';

const subscription = graphql`
  subscription MySubscription {
    # query here
  }
`;

useSubscription({ subscription });
```

## Como Utilizar o Módulo Relay na Aplicação

1. **Configuração Inicial:**
   - Certifique-se de que as variáveis de ambiente estão definidas: `NEXT_PUBLIC_GRAPHQL_ENDPOINT` e `NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT`.

2. **Envolvendo Páginas:**
   - Use `ReactRelayContainer` em suas páginas Next.js para fornecer o contexto Relay.

3. **Queries e Mutations:**
   - Use hooks do Relay como `useQuery`, `useMutation` em componentes filhos.

4. **Subscriptions:**
   - Use `useSubscription` para dados em tempo real via WebSocket.

5. **Caching e Performance:**
   - O módulo inclui cache automático para queries, melhorando performance.

6. **SSR e Hydration:**
   - Suporte built-in para server-side rendering e hidratação client-side.

Este módulo facilita a integração do Relay em sua aplicação Next.js, fornecendo uma configuração robusta para GraphQL.</content>
<parameter name="filePath">/home/leo/pessoal/projetos/woovi-challenger/apps/web/docs/relay.mdx