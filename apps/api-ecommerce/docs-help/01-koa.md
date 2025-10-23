# Entendendo Koa - O Framework Web

## O que é Koa?

Koa é um framework web minimalista e moderno para Node.js, criado pela mesma equipe que fez o Express. Ele foi projetado para ser menor, mais expressivo e mais robusto.

## Por que Koa?

1. **Async/Await nativo**: Usa async/await ao invés de callbacks
2. **Middleware elegante**: Sistema de middleware simples e poderoso
3. **Sem bloat**: Não vem com nada embutido, você adiciona o que precisa
4. **Melhor tratamento de erros**: Contexto unificado para cada requisição

## Como Koa funciona no nosso projeto

### Arquivo Principal: [app.ts](../src/server/app.ts)

```typescript
import cors from "kcors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { graphqlHTTP } from "koa-graphql";
import logger from "koa-logger";
import Router from "koa-router";

import { schema } from "../schema/schema";
import { getContext } from "./getContext";

const app = new Koa();
```

### Passo a Passo

#### 1. Criação da Aplicação

```typescript
const app = new Koa();
```

- Cria uma nova instância do Koa
- Esta é a aplicação principal que vai receber todas as requisições

#### 2. Middlewares

Middlewares são funções que processam requisições. Eles são executados na ordem que foram adicionados.

##### CORS - Cross-Origin Resource Sharing

```typescript
app.use(cors({ origin: "*" }));
```

**O que faz:**
- Permite que qualquer domínio faça requisições para sua API
- Necessário quando frontend e backend estão em domínios diferentes

**Por que é importante:**
- Sem CORS, navegadores bloqueiam requisições de outros domínios
- `origin: "*"` significa "aceitar de qualquer lugar" (use com cuidado em produção!)

**Exemplo prático:**
```
Frontend em: http://localhost:3000
Backend em: http://localhost:4000
Sem CORS: ❌ Bloqueado
Com CORS: ✅ Permitido
```

##### Logger - Registro de Requisições

```typescript
app.use(logger());
```

**O que faz:**
- Imprime informações sobre cada requisição no console
- Mostra: método HTTP, URL, status, tempo de resposta

**Saída no console:**
```
  <-- POST /graphql
  --> POST /graphql 200 42ms 150b
```

Significa:
- Recebeu uma requisição POST para /graphql
- Respondeu com status 200, levou 42ms, enviou 150 bytes

##### Body Parser - Processador de Corpo

```typescript
app.use(
  bodyParser({
    onerror(err, ctx) {
      ctx.throw(err, 422);
    },
  }),
);
```

**O que faz:**
- Converte o corpo da requisição (JSON, formulários) em objeto JavaScript
- Disponibiliza em `ctx.request.body`

**Exemplo:**
```javascript
// Cliente envia:
{
  "query": "{ messages { edges { node { content } } } }"
}

// Body parser converte para objeto JavaScript
// Acessível em ctx.request.body
```

**Tratamento de erro:**
- Se o JSON for inválido, retorna erro 422 (Unprocessable Entity)

#### 3. Rotas

```typescript
const routes = new Router();

routes.all(
  "/graphql",
  graphqlHTTP(() => ({
    schema,
    graphiql: true,
    context: getContext(),
  })),
);
```

**O que é Router:**
- Gerencia rotas (URLs) da aplicação
- Conecta URLs com handlers (funções que processam)

**`routes.all("/graphql", ...)`:**
- `all`: Aceita qualquer método HTTP (GET, POST, etc.)
- `"/graphql"`: A URL da rota
- Handler: `graphqlHTTP(...)` processa requisições GraphQL

**Configuração do GraphQL:**

1. **`schema`**: O schema GraphQL (define queries e mutations disponíveis)

2. **`graphiql: true`**: Ativa o GraphiQL
   - Interface web para testar queries
   - Acessível em http://localhost:4000/graphql no navegador
   - Tem autocomplete e documentação automática!

3. **`context: getContext()`**: Cria contexto para cada requisição
   - Contexto contém dataloaders e outras informações
   - Acessível em todos os resolvers
   - Novo contexto a cada requisição (isolamento)

#### 4. Aplicando Rotas

```typescript
app.use(routes.routes());
app.use(routes.allowedMethods());
```

**`routes.routes()`:**
- Adiciona todas as rotas definidas ao app

**`routes.allowedMethods()`:**
- Responde automaticamente a requisições OPTIONS
- Retorna erro 405 para métodos não permitidos
- Útil para CORS e REST API

#### 5. Exportando

```typescript
export { app };
```

- Exporta a aplicação configurada
- Será usada em [index.ts](../src/index.ts) para criar o servidor HTTP

## Fluxo de uma Requisição

```
1. Cliente faz requisição → POST /graphql
         ↓
2. CORS middleware → Adiciona headers CORS
         ↓
3. Logger middleware → Loga a requisição
         ↓
4. Body Parser → Converte JSON para objeto
         ↓
5. Router → Encontra handler para /graphql
         ↓
6. graphqlHTTP → Processa query GraphQL
         ↓
7. Resposta volta pelos middlewares
         ↓
8. Cliente recebe resposta
```

## Conceitos do Koa

### Context (ctx)

Cada requisição tem um objeto `ctx` (context) que contém:

```typescript
ctx.request   // Informações da requisição
ctx.response  // Para construir a resposta
ctx.body      // Atalho para ctx.response.body
ctx.status    // Atalho para ctx.response.status
ctx.throw()   // Lança erro HTTP
```

**Exemplo:**
```typescript
ctx.request.body    // { query: "..." }
ctx.status = 200    // Define status da resposta
ctx.body = {...}    // Define corpo da resposta
```

### Middlewares em Cascata

Koa usa o padrão "onion model" (modelo de cebola):

```typescript
app.use(async (ctx, next) => {
  console.log('1 - Antes');
  await next();  // Chama próximo middleware
  console.log('1 - Depois');
});

app.use(async (ctx, next) => {
  console.log('2 - Antes');
  await next();
  console.log('2 - Depois');
});

// Saída:
// 1 - Antes
// 2 - Antes
// 2 - Depois
// 1 - Depois
```

## Comparação: Koa vs Express

| Aspecto | Koa | Express |
|---------|-----|---------|
| Async/Await | ✅ Nativo | ⚠️ Precisa de libs extras |
| Tamanho | 🪶 Menor | 📦 Maior |
| Middlewares | Cascata | Linear |
| Features | Minimalista | Mais opinado |
| Comunidade | Menor | Maior |

## Exemplo Completo de Middleware

```typescript
// Middleware customizado de autenticação
app.use(async (ctx, next) => {
  const token = ctx.request.headers.authorization;

  if (!token) {
    ctx.throw(401, 'Token não fornecido');
    return;
  }

  // Validar token aqui
  ctx.state.user = { id: '123', name: 'João' };

  await next(); // Próximo middleware
});
```

## Pacotes Koa Usados no Projeto

### kcors
```typescript
import cors from "kcors";
app.use(cors({ origin: "*" }));
```
- Gerencia CORS
- Permite requisições cross-origin

### koa-logger
```typescript
import logger from "koa-logger";
app.use(logger());
```
- Loga requisições no console
- Útil para debug

### koa-bodyparser
```typescript
import bodyParser from "koa-bodyparser";
app.use(bodyParser());
```
- Processa corpo de requisições
- Suporta JSON, formulários, texto

### koa-router
```typescript
import Router from "koa-router";
const routes = new Router();
routes.get('/users', handler);
```
- Gerencia rotas
- Suporta parâmetros, prefixos, etc.

### koa-graphql
```typescript
import { graphqlHTTP } from "koa-graphql";
routes.all('/graphql', graphqlHTTP({ schema }));
```
- Integra GraphQL com Koa
- Fornece endpoint GraphQL
- Inclui GraphiQL

## Inicialização do Servidor

Em [index.ts](../src/index.ts):

```typescript
import http from "http";
import { app } from "./server/app";

const server = http.createServer(app.callback());

server.listen(config.PORT, () => {
  console.info(`Server running on port:${config.PORT}`);
});
```

**Por que `app.callback()`?**
- Koa não é um servidor HTTP
- É um request handler
- `app.callback()` retorna uma função compatível com `http.createServer`

## Dicas e Boas Práticas

### 1. Ordem dos Middlewares Importa
```typescript
// ❌ ERRADO - Logger não verá as rotas
app.use(routes.routes());
app.use(logger());

// ✅ CORRETO - Logger vê tudo
app.use(logger());
app.use(routes.routes());
```

### 2. Tratamento de Erros
```typescript
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});
```

### 3. Use async/await
```typescript
// ✅ BOM
app.use(async (ctx, next) => {
  const data = await fetchData();
  ctx.body = data;
});

// ❌ EVITE
app.use((ctx, next) => {
  fetchData().then(data => {
    ctx.body = data;
  });
});
```

## Recursos Adicionais

- Documentação oficial: https://koajs.com/
- Middlewares oficiais: https://github.com/koajs
- Comparação com Express: https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md

## Próximo Passo

Agora que você entende como o Koa funciona, vamos aprender sobre o banco de dados: **[02-mongodb-mongoose.md](02-mongodb-mongoose.md)**
