# Instruções para Rodar o Projeto - Etapa 3

## 1. Configurar e Subir o Banco PostgreSQL com Docker

* Certifique-se de ter o [Docker](https://docs.docker.com/get-docker/) instalado e rodando no seu sistema.
* Na raiz do projeto, você deve ter o arquivo `docker-compose.yml` configurado para subir o container do PostgreSQL.

Para iniciar o container com volume persistente:

```bash
docker compose up -d
```

Para parar o container e remover volumes (dados):

```bash
docker compose down -v
```

---

## 2. Configurar Variáveis de Ambiente

* Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (não altere os valores, pois são usados nos testes):

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
NODE_ENV=development
```

---

## 3. Instalar Dependências do Projeto

Na raiz do projeto, rode:

```bash
npm install
```

---

## 4. Executar Migrations

Para criar as tabelas no banco PostgreSQL:

```bash
npx knex migrate:latest
```

---

## 5. Executar Seeds

Para popular o banco com dados iniciais (2 agentes e 2 casos):

```bash
npx knex seed:run
```

---

## 6. Rodar a API

Para iniciar o servidor da API:

```bash
npm start
```

ou, se usar `nodemon` para desenvolvimento:

```bash
npm run dev
```

---

## 7. Scripts Úteis (Bônus)

* Resetar banco (drop + migrate + seed):

```bash
npm run db:reset
```

---

## Observações

* O banco PostgreSQL está configurado para rodar na porta padrão 5432.
* O Knex usa as variáveis do arquivo `.env` para se conectar ao banco.
* Não modifique o arquivo `.env` com outras credenciais para evitar erros de conexão e falha nos testes.
* Use o endpoint `/agentes/:id/casos` para listar casos de um agente específico.

---

## Etapa 4: Segurança e Autenticação

A API agora está protegida com autenticação baseada em JSON Web Token (JWT). Para acessar os endpoints de `/agentes` e `/casos`, você precisa primeiro se registrar e fazer login para obter um token de acesso.

### Fluxo de Autenticação

1.  **Registro**: Crie uma nova conta de usuário no endpoint `POST /auth/register`.
2.  **Login**: Faça login com seu email e senha no endpoint `POST /auth/login` para receber um `access_token`.
3.  **Acesso Protegido**: Inclua o `access_token` no cabeçalho `Authorization` de todas as suas requisições para as rotas protegidas (`/agentes`, `/casos`).

### Como Registrar um Usuário

Envie uma requisição `POST` para `/auth/register` com seu nome, email e uma senha forte.

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "nome": "Seu Nome",
  "email": "usuario@exemplo.com",
  "senha": "SenhaForte123!"
}'
```

### Como Fazer Login

Envie uma requisição `POST` para `/auth/login` com o email e a senha que você registrou.

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "usuario@exemplo.com",
  "senha": "SenhaForte123!"
}'
```

A resposta será um JSON contendo seu token de acesso:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQGV4ZW1wbG8uY29tIiwiaWF0IjoxNzE1ODg0NDAwLCJleHAiOjE3MTU4ODgwMDB9.somerandomsignature"
}
```

### Como Acessar Rotas Protegidas

Para fazer requisições aos endpoints `/agentes` ou `/casos`, você deve incluir o token no cabeçalho `Authorization` com o prefixo `Bearer`.

**Exemplo com cURL (Listando todos os agentes):**
```bash
curl -X GET http://localhost:3000/agentes \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c3VhcmlvQGV4ZW1wbG8uY29tIiwiaWF0IjoxNzE1ODg0NDAwLCJleHAiOjE3MTU4ODgwMDB9.somerandomsignature"
```

Se o token não for fornecido, for inválido ou estiver expirado, a API retornará um erro `401 Unauthorized`.