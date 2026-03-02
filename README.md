# API Express com Prisma ORM (Users)

API de usuários construída com **Express** e **Prisma ORM**, utilizando **MySQL** como banco principal e suporte opcional a **SQLite** (comentado no `schema.prisma`) para desenvolvimento/testes.

---

## Requisitos

- Node.js 18+ (recomendado)
- NPM (ou Yarn)
- Banco **MySQL** acessível

---

## Configuração do ambiente

1. Clone o repositório e acesse a pasta do projeto:

```bash
git clone <seu-repo.git>
cd api_express/api_express
```

2. Crie o arquivo `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

3. Edite o `.env` e configure a variável `DATABASE_URL` para o seu MySQL:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
PORT=3001
```

### Usando SQLite (opcional, para dev/testes)

No arquivo `prisma/schema.prisma` já existe a configuração de SQLite comentada.  
Para usar SQLite:

1. Comente as linhas de MySQL e descomente as de SQLite em `datasource db`:

```prisma
datasource db {
  // provider = "mysql"
  // url      = env("DATABASE_URL")

  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Nesse caso, a variável `DATABASE_URL` não é necessária.

---

## Instalação das dependências

Na raiz do projeto (`api_express/api_express`), execute:

```bash
npm install
```

Caso queira instalar manualmente:

```bash
npm install @prisma/client bcrypt cors dotenv express
npm install -D prisma nodemon
```

---

## Migrações e Prisma Client

### Gerar o Prisma Client

```bash
npx prisma generate
```

ou usando o script:

```bash
npm run prisma:generate
```

### Criar e aplicar migrações (MySQL ou SQLite)

```bash
npx prisma migrate dev --name init
```

ou:

```bash
npm run prisma:migrate
```

---

## Rodando a API

### Ambiente de desenvolvimento (com nodemon)

```bash
npm run dev
```

### Ambiente de produção (sem nodemon)

```bash
npm start
```

A API será iniciada na porta definida em `PORT` (padrão `3001`):

```text
http://localhost:3001
```

---

## Estrutura de pastas

```text
src/
├── controllers/
│   └── userController.js
├── routes/
│   └── userRoutes.js
├── services/
│   └── userService.js
├── lib/
│   └── prisma.js
├── middlewares/
│   └── errorHandler.js
└── server.js
prisma/
└── schema.prisma
```

Fluxo de responsabilidade:

- `routes` → define as rotas HTTP.
- `controllers` → tratam a requisição/resposta (Express).
- `services` → regra de negócio e chamadas ao Prisma.
- `lib/prisma` → singleton do Prisma Client.
- `middlewares/errorHandler` → tratamento centralizado de erros (incluindo erros do Prisma).

---

## Rotas da API

Prefixo base das rotas de usuário: **`/api/usuarios`**

### 1. Listar usuários

- **Método**: `GET`
- **Path**: `/api/usuarios`
- **Descrição**: Lista todos os usuários com seus perfis.
- **Resposta (exemplo)**:

```json
{
  "mensagem": "Usuários encontrados com sucesso",
  "users": [
    {
      "id": 1,
      "nome": "João",
      "email": "joao@example.com",
      "id_perfil": 1,
      "created_at": "2026-02-24T10:00:00.000Z",
      "updated_at": "2026-02-24T10:00:00.000Z",
      "profile": {
        "id": 1,
        "perfil_nome": "admin"
      }
    }
  ]
}
```

### 2. Buscar usuário por ID

- **Método**: `GET`
- **Path**: `/api/usuarios/:id`
- **Descrição**: Retorna um usuário específico com os dados de perfil.

### 3. Criar usuário + perfil

- **Método**: `POST`
- **Path**: `/api/usuarios`
- **Descrição**: Cria um usuário e seu perfil associado (nested create).
- **Body (JSON)**:

```json
{
  "nome": "João",
  "email": "joao@example.com",
  "senha": "senha_em_texto_plano",
  "perfil_nome": "admin"
}
```

- **Observações**:
  - A senha é hasheada com **bcrypt** antes de ser salva.
  - A senha **nunca** é retornada na resposta.
  - Se o `email` já existir, o Prisma lança erro `P2002` e a API responde com **409**.

### 4. Atualizar usuário

- **Método**: `PUT`
- **Path**: `/api/usuarios/:id`
- **Descrição**: Atualiza dados do usuário e, opcionalmente, o `perfil_nome`.
- **Body (JSON)** – todos os campos são opcionais:

```json
{
  "nome": "Novo Nome",
  "email": "novoemail@example.com",
  "senha": "nova_senha",
  "perfil_nome": "novo_perfil"
}
```

### 5. Remover usuário

- **Método**: `DELETE`
- **Path**: `/api/usuarios/:id`
- **Descrição**: Remove um usuário pelo ID.

---

## Tratamento de erros

O middleware `errorHandler` centraliza a resposta de erros:

- **P2002 (unique constraint)** → HTTP `409` (ex.: email duplicado).
- **P2025 (registro não encontrado)** → HTTP `404`.
- Erros com `statusCode` definido no código → usa o status informado.
- Demais erros → HTTP `500` com mensagem genérica.

