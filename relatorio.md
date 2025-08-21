<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 9 créditos restantes para usar o sistema de feedback AI.

# Feedback para santoslucas:

Nota final: **34.8/100**

Olá, santoslucas! 👋🚀

Primeiramente, parabéns pelo esforço e dedicação em construir essa API completa e segura para o Departamento de Polícia! 🎉 Você já conseguiu implementar várias funcionalidades importantes, como o uso do JWT para autenticação, proteção das rotas, hashing de senha com bcrypt, e a organização geral do projeto está bem alinhada com a arquitetura MVC. Isso é fundamental para projetos profissionais! 👏

---

## 🎯 O que você já mandou muito bem

- **Proteção das rotas `/agentes` e `/casos` com middleware de autenticação JWT**: você aplicou o `authMiddleware` corretamente no `server.js`, garantindo que apenas usuários autenticados acessam essas rotas.
  
- **Uso correto do bcrypt para hashing e comparação de senhas** no `authController.js`.

- **Geração do token JWT com tempo de expiração e segredo vindo do `.env`** — isso é essencial para segurança.

- **Separação das responsabilidades**: você dividiu o código em controllers, repositories, rotas e middlewares, o que facilita manutenção e escalabilidade.

- **Validações robustas nas controllers** para os dados de agentes e casos, com mensagens de erro claras.

- **Documentação no `INSTRUCTIONS.md`** explicando como registrar, logar e usar o token JWT — isso ajuda muito quem for consumir sua API.

- **Seeds e migrations bem configurados** para popular as tabelas de agentes e casos.

- **Endpoints de CRUD para agentes e casos estão completos e funcionais.**

- **Bônus conquistados:** Você implementou a filtragem de casos por status, agente e palavras-chave, além do endpoint para buscar casos de um agente e o `/usuarios/me` para retornar dados do usuário autenticado. Isso mostra que você foi além do básico! 🌟

---

## 🚨 Pontos que precisam de atenção para melhorar e passar para o próximo nível

### 1. Validação da senha no registro do usuário está faltando

O maior motivo das falhas na criação de usuário é que o seu código **não está validando a força da senha** conforme o requisito:

> A senha deve ter no mínimo 8 caracteres, sendo pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.

No seu `authController.js`, o código atual só verifica se a senha existe, mas não faz essa validação específica. Isso permite senhas fracas passarem, e o sistema de testes espera que você retorne erro 400 quando a senha não cumprir esses critérios.

**Como corrigir?**  
Adicione uma validação usando expressão regular antes de fazer o hash da senha. Por exemplo:

```js
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

async function register(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }

  if (!passwordRegex.test(senha)) {
    return res.status(400).json({ error: "Senha fraca: deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais." });
  }

  // restante do código...
}
```

Assim, você garante que só senhas fortes são aceitas, conforme o requisito.

---

### 2. Validação de campos extras no payload de registro

Outro problema relacionado é que seu endpoint de registro aceita campos extras no JSON, o que não deveria acontecer. Por exemplo, se enviar um campo `idade` ou `endereco`, isso deve gerar erro 400.

No seu código atual, não há nenhuma verificação para proibir campos extras. Isso pode causar problemas de segurança e inconsistência.

**Como corrigir?**  
Você pode fazer uma validação simples para garantir que só os campos esperados estejam presentes:

```js
const allowedFields = ["nome", "email", "senha"];
const receivedFields = Object.keys(req.body);

const hasExtraFields = receivedFields.some(field => !allowedFields.includes(field));
if (hasExtraFields) {
  return res.status(400).json({ error: "Campos extras não são permitidos." });
}
```

Coloque isso no começo do seu `register` para garantir que a requisição está no formato correto.

---

### 3. Erro no nome do campo do token JWT no retorno do login

No seu `authController.js`, no método `login`, você retorna o token assim:

```js
res.status(200).json({ acess_token: token });
```

Repare que o campo está escrito com **"acess_token"** (faltando um "c"). O correto, conforme o enunciado e documentação, é **"access_token"** (com dois "c").

Esse detalhe pode parecer pequeno, mas é crucial para que o cliente da API consiga interpretar corretamente o token.

**Como corrigir?**

```js
res.status(200).json({ access_token: token });
```

---

### 4. Endpoint de exclusão de usuário `/users/:id` deve retornar status 204 (sem conteúdo)

No seu `routes/authRoutes.js`, o endpoint para deletar usuário está assim:

```js
router.delete("/users/:id", async (req, res) => {
  try {
    await usuariosRepository.deleteUser(req.params.id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});
```

Por padrão, para deleção, o ideal é retornar status **204 No Content** e um corpo vazio, para indicar sucesso sem conteúdo extra.

**Como corrigir?**

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

Além disso, é importante verificar se o usuário existia antes de deletar, para retornar 404 quando apropriado.

---

### 5. Estrutura de diretórios — Atenção à pasta `middlewares`

Você fez a pasta `middlewares` e colocou o `authMiddleware.js` lá, o que está correto. Porém, a penalidade detectada indica que sua estrutura de arquivos não está exatamente conforme o esperado.

Por exemplo, verifique se:

- O arquivo `.env` está na raiz do projeto.
- Os arquivos de migrations e seeds estão dentro de `db/migrations` e `db/seeds`.
- O arquivo `authRoutes.js` está dentro da pasta `routes`.
- O arquivo `authController.js` está dentro da pasta `controllers`.
- O arquivo `usuariosRepository.js` está dentro de `repositories`.
- O arquivo `authMiddleware.js` está dentro de `middlewares`.
- O arquivo `errorHandler.js` está dentro de `utils`.

Se algum desses estiver fora do lugar, pode causar problemas nos testes e na manutenção do projeto.

---

### 6. Falta de validação do token JWT no logout (opcional)

Atualmente seu endpoint de logout apenas responde com sucesso, o que é aceitável para JWT, já que o logout é controlado no cliente. Porém, uma melhoria seria proteger essa rota com o middleware de autenticação para garantir que só usuários logados possam chamar logout.

---

## 🚀 Dicas extras para você brilhar ainda mais!

- Para validar senhas fortes, recomendo este vídeo, feito pelos meus criadores, que fala muito bem sobre autenticação e segurança:  
  https://www.youtube.com/watch?v=Q4LQOfYwujk

- Para entender melhor JWT na prática e como validar tokens, veja este vídeo:  
  https://www.youtube.com/watch?v=keS0JWOypIU

- Se quiser reforçar o uso do bcrypt para hashing e comparação de senhas, este vídeo é ótimo:  
  https://www.youtube.com/watch?v=L04Ln97AwoY

- Sobre organização e arquitetura MVC em Node.js, para deixar seu projeto super profissional:  
  https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

- E para garantir que suas migrations e seeds estejam rodando perfeitamente com Knex e Docker:  
  https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s  
  https://www.youtube.com/watch?v=dXWy_aGCW1E  
  https://www.youtube.com/watch?v=AJrK90D5el0&t=9s

---

## 🔍 Resumo rápido para você focar:

- [ ] **Implemente validação da senha no registro** para garantir força (mínimo 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais).

- [ ] **Proíba campos extras no payload de registro**, retornando erro 400 se houver.

- [ ] **Corrija o nome do campo do token no login para `access_token`** (com dois "c").

- [ ] **Ajuste o endpoint de exclusão de usuário para retornar status 204 e corpo vazio**, e valide se o usuário existe antes de deletar.

- [ ] **Revise a estrutura de diretórios e arquivos**, garantindo que todos estejam nos locais corretos conforme o enunciado.

- [ ] (Opcional) Proteja o endpoint de logout com o middleware de autenticação.

---

Lucas, você está muito perto de ter uma API robusta e profissional! Com essas correções, seu projeto vai ficar alinhado com as melhores práticas e pronto para produção. Continue firme que você está no caminho certo! 🚀✨

Se precisar de ajuda para implementar as validações, só chamar! Estou aqui para te ajudar a destravar esses pontos. 😉

Um abraço e sucesso no seu código! 👊💻🔥

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>