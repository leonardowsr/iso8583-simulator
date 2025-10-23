# MongoDB e Mongoose - Banco de Dados

## O que é MongoDB?

MongoDB é um banco de dados **NoSQL** (Not Only SQL) que armazena dados em formato de documentos semelhantes a JSON.

### SQL vs NoSQL - Conceitos Básicos

**Banco SQL (MySQL, PostgreSQL):**
```
Tabela: Users
+----+---------+------------------+
| id | name    | email            |
+----+---------+------------------+
| 1  | João    | joao@email.com   |
| 2  | Maria   | maria@email.com  |
+----+---------+------------------+
```

**Banco NoSQL (MongoDB):**
```javascript
Collection: users
{
  _id: "507f1f77bcf86cd799439011",
  name: "João",
  email: "joao@email.com",
  addresses: [
    { street: "Rua A", city: "São Paulo" }
  ]
}
```

### Diferenças Principais

| SQL | MongoDB |
|-----|---------|
| Tabela | Collection |
| Linha | Document |
| Coluna | Field |
| JOIN | Embedding ou Referência |
| Schema rígido | Schema flexível |

## O que é Mongoose?

Mongoose é uma biblioteca (ODM - Object Data Modeling) que facilita trabalhar com MongoDB em Node.js.

**Benefícios:**
1. Define schemas (estrutura dos dados)
2. Valida dados automaticamente
3. Fornece métodos úteis
4. Tipagem TypeScript
5. Middleware (hooks)

## Conexão com MongoDB

### Arquivo: [database.ts](../src/database.ts)

```typescript
import mongoose from "mongoose";
import { config } from "./config";

async function connectDatabase() {
  mongoose.connection.on("close", () =>
    console.info("Database connection closed."),
  );

  await mongoose.connect(config.MONGO_URI);
}

export { connectDatabase };
```

### Passo a Passo

#### 1. Importações
```typescript
import mongoose from "mongoose";
import { config } from "./config";
```
- `mongoose`: Biblioteca para trabalhar com MongoDB
- `config`: Configurações (URL do MongoDB)

#### 2. Event Listener
```typescript
mongoose.connection.on("close", () =>
  console.info("Database connection closed."),
);
```
**O que faz:**
- Registra um evento para quando a conexão fechar
- Útil para debug e logs

**Outros eventos disponíveis:**
```typescript
mongoose.connection.on('connected', () => {
  console.log('Conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado do MongoDB');
});
```

#### 3. Conectar
```typescript
await mongoose.connect(config.MONGO_URI);
```
**O que faz:**
- Conecta ao MongoDB usando a URI de configuração
- `await`: Espera a conexão completar antes de continuar
- URI exemplo: `mongodb://localhost:27017/woovi`

**Formato da URI:**
```
mongodb://[usuario:senha@]host[:porta]/database[?opcoes]

Exemplos:
- Local: mongodb://localhost:27017/myapp
- Atlas: mongodb+srv://user:pass@cluster.mongodb.net/myapp
- Docker: mongodb://mongo:27017/myapp
```

### Configuração: [config.ts](../src/config.ts)

```typescript
import dotenvSafe from "dotenv-safe";

dotenvSafe.config({
  path: root(".env"),
  sample: root(".env.example"),
});

const config = {
  PORT: ENV.PORT ?? 4000,
  MONGO_URI: ENV.MONGO_URI ?? "",
};
```

**dotenv-safe:**
- Carrega variáveis de ambiente do arquivo `.env`
- Valida contra `.env.example` (garante que nada foi esquecido)
- Se faltar alguma variável, dá erro

**Arquivo .env:**
```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/woovi
```

## Model de Mensagem

### Arquivo: [MessageModel.ts](../src/modules/message/MessageModel.ts)

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

### Anatomia do Schema

#### 1. Definição do Schema

```typescript
const Schema = new mongoose.Schema<IMessage>(
  { /* campos */ },
  { /* opções */ }
);
```

**Primeiro parâmetro - Campos:**
```typescript
{
  content: {
    type: String,              // Tipo do campo
    description: '...',        // Descrição (documentação)
    required: true,            // Opcional: Campo obrigatório
    default: 'texto padrão',   // Opcional: Valor padrão
    minlength: 1,              // Opcional: Tamanho mínimo
    maxlength: 500,            // Opcional: Tamanho máximo
  },
}
```

**Tipos disponíveis:**
- `String`: Texto
- `Number`: Números
- `Date`: Datas
- `Boolean`: true/false
- `Array`: Listas
- `mongoose.Schema.Types.ObjectId`: Referência a outro documento
- `mongoose.Schema.Types.Mixed`: Qualquer tipo

**Segundo parâmetro - Opções:**
```typescript
{
  collection: 'Message',    // Nome da collection no MongoDB
  timestamps: true,         // Adiciona createdAt e updatedAt automaticamente
}
```

#### 2. Interface TypeScript

```typescript
export type IMessage = {
  content: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;
```

**Por que isso?**
- Define o tipo TypeScript para o documento
- `& Document`: Adiciona métodos do Mongoose (_id, save, etc.)
- TypeScript vai autocomplete nos seus campos!

#### 3. Criação do Model

```typescript
export const Message: Model<IMessage> = mongoose.model('Message', Schema);
```

**O que é um Model?**
- É uma classe que cria e lê documentos do MongoDB
- Fornece métodos como: `find()`, `create()`, `updateOne()`, etc.

## Operações CRUD

### Create (Criar)

```typescript
// Opção 1: new + save
const message = new Message({
  content: "Hello World"
});
await message.save();

// Opção 2: create
const message = await Message.create({
  content: "Hello World"
});
```

**Usado em:** [MessageAddMutation.ts](../src/modules/message/mutations/MessageAddMutation.ts):19

### Read (Ler)

```typescript
// Buscar todos
const messages = await Message.find();

// Buscar por ID
const message = await Message.findById("507f1f77bcf86cd799439011");

// Buscar com filtro
const messages = await Message.find({ content: "Hello" });

// Buscar um
const message = await Message.findOne({ content: "Hello" });
```

### Update (Atualizar)

```typescript
// Atualizar um
await Message.updateOne(
  { _id: "507f..." },
  { content: "Novo conteúdo" }
);

// Atualizar vários
await Message.updateMany(
  { content: "Old" },
  { content: "New" }
);

// Buscar e atualizar
const message = await Message.findByIdAndUpdate(
  "507f...",
  { content: "Novo" },
  { new: true }  // Retorna documento atualizado
);
```

### Delete (Deletar)

```typescript
// Deletar um
await Message.deleteOne({ _id: "507f..." });

// Deletar vários
await Message.deleteMany({ content: "Spam" });

// Buscar e deletar
const message = await Message.findByIdAndDelete("507f...");
```

## Queries Avançadas

### Filtros

```typescript
// Operadores de comparação
Message.find({ views: { $gt: 100 } });        // maior que
Message.find({ views: { $gte: 100 } });       // maior ou igual
Message.find({ views: { $lt: 100 } });        // menor que
Message.find({ views: { $lte: 100 } });       // menor ou igual
Message.find({ views: { $ne: 100 } });        // diferente

// Operadores lógicos
Message.find({
  $or: [
    { content: "Hello" },
    { content: "Hi" }
  ]
});

// Regex
Message.find({ content: /hello/i });  // case-insensitive
```

### Seleção de Campos

```typescript
// Apenas campos específicos
Message.find().select('content createdAt');

// Excluir campos
Message.find().select('-__v');
```

### Ordenação

```typescript
// Crescente
Message.find().sort('createdAt');
Message.find().sort({ createdAt: 1 });

// Decrescente
Message.find().sort('-createdAt');
Message.find().sort({ createdAt: -1 });
```

### Paginação

```typescript
// Skip e Limit
Message.find()
  .skip(20)   // Pula os primeiros 20
  .limit(10); // Retorna apenas 10
```

### Populate (JOINs)

```typescript
// Schema com referência
const CommentSchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Referência ao model User
  }
});

// Buscar com populate
const comment = await Comment.findById(id)
  .populate('author');  // Carrega dados do autor

// Resultado:
{
  _id: "...",
  content: "Great post!",
  author: {
    _id: "...",
    name: "João",
    email: "joao@email.com"
  }
}
```

## Validação

```typescript
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,           // Obrigatório
    unique: true,             // Único no banco
    lowercase: true,          // Converte para minúsculo
    trim: true,               // Remove espaços
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,  // Regex
  },
  age: {
    type: Number,
    min: 0,                   // Valor mínimo
    max: 120,                 // Valor máximo
  },
  role: {
    type: String,
    enum: ['user', 'admin'],  // Apenas valores permitidos
    default: 'user',
  },
});
```

**Validação customizada:**
```typescript
const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    validate: {
      validator: (v) => v.length >= 8,
      message: 'Senha deve ter pelo menos 8 caracteres'
    }
  }
});
```

## Middleware (Hooks)

Mongoose permite executar código antes ou depois de operações.

```typescript
// Antes de salvar
MessageSchema.pre('save', function(next) {
  // 'this' é o documento sendo salvo
  console.log('Salvando mensagem:', this.content);
  next();
});

// Depois de salvar
MessageSchema.post('save', function(doc, next) {
  console.log('Mensagem salva:', doc._id);
  next();
});

// Exemplo prático: Hash de senha
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

## Métodos Personalizados

### Métodos de Instância

```typescript
MessageSchema.methods.markAsRead = function() {
  this.read = true;
  return this.save();
};

// Uso:
const message = await Message.findById(id);
await message.markAsRead();
```

### Métodos Estáticos

```typescript
MessageSchema.statics.findByContent = function(content: string) {
  return this.find({ content: new RegExp(content, 'i') });
};

// Uso:
const messages = await Message.findByContent('hello');
```

## Virtual Fields

Campos que não são salvos no banco, mas calculados dinamicamente.

```typescript
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

// Virtual field
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Uso:
const user = await User.findById(id);
console.log(user.fullName);  // "João Silva"
```

## Timestamps Automáticos

```typescript
const Schema = new mongoose.Schema(
  { content: String },
  { timestamps: true }  // Adiciona createdAt e updatedAt
);
```

**Resultado no MongoDB:**
```javascript
{
  _id: "...",
  content: "Hello",
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

## Índices

Melhoram performance de queries.

```typescript
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,        // Índice simples
    unique: true,       // Índice único
  },
  lastName: String,
  firstName: String,
});

// Índice composto
UserSchema.index({ lastName: 1, firstName: 1 });
```

## Boas Práticas

### 1. Use Lean Queries
```typescript
// ❌ Retorna documento Mongoose (mais pesado)
const messages = await Message.find();

// ✅ Retorna objeto JavaScript puro (mais rápido)
const messages = await Message.find().lean();
```

### 2. Use Select para Campos Grandes
```typescript
// Não carregar campos grandes desnecessariamente
Message.find().select('-largeField');
```

### 3. Use Índices em Campos Filtrados
```typescript
// Se você sempre busca por email, crie índice
{ email: { type: String, index: true } }
```

### 4. Use Limit em Queries
```typescript
// Evite carregar milhares de documentos
Message.find().limit(100);
```

## Exemplo Completo

```typescript
import mongoose from 'mongoose';

// Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Método personalizado
UserSchema.methods.greet = function() {
  return `Hello, ${this.name}!`;
};

// Model
export const User = mongoose.model('User', UserSchema);

// Uso
const user = await User.create({
  name: 'João',
  email: 'joao@email.com',
  age: 25,
});

console.log(user.greet());  // "Hello, João!"
```

## Recursos Adicionais

- Documentação Mongoose: https://mongoosejs.com/docs/guide.html
- MongoDB University (grátis): https://university.mongodb.com/
- Schema Types: https://mongoosejs.com/docs/schematypes.html

## Próximo Passo

Agora vamos aprender sobre GraphQL: **[03-graphql.md](03-graphql.md)**
