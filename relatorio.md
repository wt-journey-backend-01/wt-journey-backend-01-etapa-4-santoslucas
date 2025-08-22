<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 8 créditos restantes para usar o sistema de feedback AI.

# Feedback para santoslucas:

Nota final: **45.3/100**

# Feedback do seu Desafio de API REST com Segurança e Autenticação 🚨🔐

Olá, santoslucas! 👋 Que jornada incrível você já percorreu até aqui! Vamos conversar sobre seu projeto, celebrar suas conquistas e destrinchar juntos os pontos que podem ser melhorados para deixar sua API mais robusta e profissional. Bora lá? 🚀

---

## 🎉 Pontos Fortes e Conquistas

- **Organização do código:** Seu projeto está muito bem estruturado, com controllers, repositories, middlewares e rotas separados. Isso facilita manutenção e escalabilidade. Parabéns por seguir a arquitetura MVC!  
- **Autenticação funcionando:** Você implementou o registro, login com JWT, logout e proteção das rotas `/agentes` e `/casos` com middleware, o que é essencial para segurança.  
- **Validações cuidadosas:** Vejo que você fez validações detalhadas nos controllers, como formatos de UUID, datas e campos obrigatórios. Isso é fundamental para garantir a integridade dos dados.  
- **Mensagens de erro claras:** As respostas de erro são amigáveis e ajudam o consumidor da API a entender o que deu errado.  
- **Documentação no INSTRUCTIONS.md:** Você explicou bem o fluxo de autenticação, como registrar, logar e usar o token JWT nos headers, o que é muito importante para quem for consumir sua API.  
- **Bônus conquistado:** Você implementou o endpoint `/usuarios/me` para retornar os dados do usuário autenticado! Isso é um diferencial que mostra seu empenho em ir além do básico. 👏

---

## 🚨 Pontos que precisam de atenção para garantir a aprovação e funcionamento perfeito

### 1. Estrutura de Diretórios — Atenção à organização obrigatória!

Eu percebi que você tem uma estrutura muito boa, mas há uma penalidade detectada indicando que você não seguiu a estrutura de arquivos à risca, principalmente em relação a arquivos estáticos ou extras que não deveriam estar presentes.

**Por que isso importa?**  
O projeto espera que você entregue exatamente a estrutura abaixo, sem arquivos extras ou fora do lugar, para que o ambiente de avaliação e testes funcione corretamente.

**Estrutura esperada:**

```
📦 SEU-REPOSITÓRIO
│
├── package.json
├── server.js
├── .env
├── knexfile.js
├── INSTRUCTIONS.md
│
├── db/
│ ├── migrations/
│ ├── seeds/
│ └── db.js
│
├── routes/
│ ├── agentesRoutes.js
│ ├── casosRoutes.js
│ └── authRoutes.js
│
├── controllers/
│ ├── agentesController.js
│ ├── casosController.js
│ └── authController.js
│
├── repositories/
│ ├── agentesRepository.js
│ ├── casosRepository.js
│ └── usuariosRepository.js
│
├── middlewares/
│ └── authMiddleware.js
│
├── utils/
│ └── errorHandler.js
```

**O que fazer?**  
- Remova qualquer arquivo ou pasta que não esteja listado acima, especialmente arquivos estáticos, temporários, ou que não fazem parte do escopo do projeto.  
- Verifique se não há arquivos duplicados ou com nomes incorretos (por exemplo, `authRoutes.js` deve estar na pasta `routes/`, não em outro lugar).  

Essa organização é fundamental para que o ambiente reconheça seu projeto corretamente.

---

### 2. Endpoint de exclusão de usuários (`DELETE /users/:id`)

No arquivo `routes/authRoutes.js`, seu endpoint de exclusão de usuário está definido assim:

```js
router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await usuariosRepository.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});
```

**Problema identificado:**  
Esse endpoint está **sem proteção**. Ou seja, qualquer pessoa pode deletar usuários sem estar autenticada.

**Por que isso é um problema?**  
Excluir usuários é uma operação sensível que deve ser protegida por autenticação e autorização. Caso contrário, qualquer cliente malicioso pode apagar usuários do sistema.

**Como corrigir?**  
Adicione o middleware `authMiddleware` para proteger essa rota:

```js
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await usuariosRepository.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});
```

Assim, só usuários autenticados poderão excluir usuários.

---

### 3. Consistência no nome do campo do token JWT retornado no login

No seu `authController.js`, no método `login`, você retorna o token com a chave `access_token`:

```js
res.status(200).json({ access_token: token });
```

Porém, no enunciado e no INSTRUCTIONS.md, o campo esperado é `acess_token` (com "c" só uma vez). Isso pode causar falha na integração com clientes que esperam o nome exato.

**O que fazer?**  
Padronize para o nome correto, que é:

```js
res.status(200).json({ acess_token: token });
```

ou altere a documentação para usar `access_token`. O importante é que seja consistente.

---

### 4. Validação de campos extras no registro de usuário

No `authController.js`, você verifica se há campos extras no corpo da requisição:

```js
const receivedFields = Object.keys(req.body);
const allowedFields = ["nome", "email", "senha"];

const hasExtraFields = receivedFields.some(field => !allowedFields.includes(field));
if (hasExtraFields) {
  return res.status(400).json({ error: "Campos extras não são permitidos." });
}
```

Essa validação é ótima! Porém, faltou validar se os campos obrigatórios estão presentes **antes** de validar a senha.

**Sugestão:**  
Coloque a validação de campos obrigatórios antes da validação da senha, para que o erro seja mais claro para o usuário.

---

### 5. Middleware de autenticação — validação do token

Seu middleware `authMiddleware.js` está correto e bem implementado, porém, ele depende da variável de ambiente `JWT_SECRET` estar corretamente configurada.

**Verifique:**  
- Se o arquivo `.env` contém a variável `JWT_SECRET` com um valor seguro e não vazio.  
- Se você está carregando o `.env` antes de usar o middleware (no `server.js` você fez isso corretamente com `require('dotenv').config()`).

Se `JWT_SECRET` estiver ausente, o JWT não poderá ser validado, e o middleware vai falhar.

---

### 6. Migrations e Seeds — Confirmação da criação da tabela usuários

Sua migration para criar a tabela `usuarios` está assim:

```js
exports.up = function (knex) {
  return knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.string("email").notNullable().unique();
    table.string("senha").notNullable();
  });
};
```

Está perfeita para o requisito.

**Certifique-se de que:**  
- Você executou `npx knex migrate:latest` para aplicar essa migration.  
- Não há conflito de versões ou migrations pendentes.  
- Os seeds para usuários, se houver, estão populando dados válidos.  

Se a tabela `usuarios` não existir, a criação de usuários falhará.

---

### 7. Uso de pacotes para hashing de senha

No seu `package.json`, você tem tanto `bcrypt` quanto `bcryptjs` instalados:

```json
"dependencies": {
  "bcrypt": "^6.0.0",
  "bcryptjs": "^3.0.2",
  ...
}
```

No seu código, você está usando o `bcrypt` (nativo com bindings em C++), que é mais performático.

**Recomendação:**  
- Remova o pacote `bcryptjs` para evitar confusão e dependências desnecessárias.  
- Use somente `bcrypt` para hashing e comparação de senhas.

---

### 8. Inconsistência no logout

No seu `authRoutes.js`:

```js
router.post("/logout", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
});
```

E no `authController.js`:

```js
async function logout(req, res) {
  res.status(200).json({ message: "Logout realizado com sucesso" });
}
```

Você não está usando o controller no route, e o logout aqui não invalida o token JWT (pois JWT é stateless). Isso está correto para o escopo, mas talvez cause confusão.

**Sugestão:**  
- Use o controller no route para manter padrão:

```js
router.post("/logout", authMiddleware, authController.logout);
```

- Documente no INSTRUCTIONS.md que o logout é apenas uma resposta, pois o token continuará válido até expirar.

---

### 9. Endpoint `/usuarios/me` — Implementação não encontrada no código enviado

Você mencionou no bônus a implementação do endpoint `/usuarios/me` para retornar os dados do usuário autenticado, mas não encontrei o arquivo de rota ou controller que expõe esse endpoint.

**O que fazer?**  
- Crie uma rota protegida em `routes/authRoutes.js`:

```js
router.get("/usuarios/me", authMiddleware, authController.getMe);
```

- Implemente no `authController.js`:

```js
async function getMe(req, res) {
  try {
    const user = await usuariosRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json({ id: user.id, nome: user.nome, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
}
```

- E no `usuariosRepository.js`, crie o método `findById`:

```js
async function findById(id) {
  return await db("usuarios").where({ id }).first();
}
```

Assim você completa esse bônus com sucesso.

---

## 📚 Recursos para você aprofundar e corrigir esses pontos

- Para autenticação, JWT e bcrypt, recomendo muito **esse vídeo, feito pelos meus criadores, que fala muito bem sobre os conceitos básicos e fundamentais da cibersegurança:**  
  https://www.youtube.com/watch?v=Q4LQOfYwujk

- Para entender o uso prático de JWT, veja também:  
  https://www.youtube.com/watch?v=keS0JWOypIU

- Para hashing de senha com bcrypt, esse vídeo é excelente:  
  https://www.youtube.com/watch?v=L04Ln97AwoY

- Sobre estrutura de projeto e arquitetura MVC para Node.js, esse vídeo vai te ajudar a organizar seu código de forma profissional:  
  https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

- Se tiver dúvidas sobre migrations e seeds com Knex e PostgreSQL, recomendo esses vídeos:  
  - Configuração do banco com Docker e Knex: https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s  
  - Documentação oficial do Knex sobre migrations: https://www.youtube.com/watch?v=dXWy_aGCW1E  
  - Guia detalhado do Knex Query Builder: https://www.youtube.com/watch?v=GLwHSs7t3Ns&t=4s  
  - Como usar seeds: https://www.youtube.com/watch?v=AJrK90D5el0&t=9s

---

## 📝 Resumo rápido dos principais pontos para focar

- 🚧 **Corrigir estrutura de diretórios**: remova arquivos extras e siga o padrão exigido.  
- 🔒 **Proteger a rota DELETE /users/:id** com middleware de autenticação.  
- 🔄 **Padronizar o nome do token JWT retornado no login** (`access_token` ou `acess_token`).  
- ✅ **Garantir que a migration da tabela usuarios foi aplicada** e o banco está configurado corretamente.  
- 🧹 **Remover pacote bcryptjs e usar somente bcrypt** para evitar confusão.  
- 🔄 **Usar controller no logout para manter padrão de código.**  
- 🚀 **Implementar o endpoint `/usuarios/me` para retornar dados do usuário autenticado.**  
- 🔑 **Garantir que a variável JWT_SECRET está no `.env` e carregada corretamente.**

---

## Finalizando... ✨

santoslucas, você está no caminho certo! Seu código mostra que você entende bem os conceitos de API REST, validação, autenticação e organização de projeto. Com alguns ajustes pontuais que detalhei aqui, seu projeto vai brilhar ainda mais e ficar pronto para uso profissional!

Continue firme, revise esses pontos com calma e não hesite em usar os recursos que indiquei para aprofundar seu conhecimento. Estou aqui para te ajudar a evoluir sempre! 💪🚀

Um abraço e sucesso na sua jornada de desenvolvimento! 👊😄

---

Se precisar de ajuda para implementar qualquer uma das correções, me chama que a gente resolve juntos! 😉

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>