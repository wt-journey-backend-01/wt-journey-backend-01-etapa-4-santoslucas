const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuariosRepository = require("../repositories/usuariosRepository");

async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const requiredFields = ["nome", "email", "senha"];
    for (const field of requiredFields) {
      if (!req.body.hasOwnProperty(field)) {
        return res.status(400).json({ error: `O campo '${field}' é obrigatório.` });
      }
      if (typeof req.body[field] !== 'string' || req.body[field].trim() === '') {
        return res.status(400).json({ error: `O campo '${field}' não pode estar vazio.` });
      }
    }

    const allowedFields = ["nome", "email", "senha"];
    const extraFields = Object.keys(req.body).filter(f => !allowedFields.includes(f));
    if (extraFields.length > 0) {
      return res.status(400).json({ error: "Campos extras não são permitidos." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(senha)) {
      return res.status(400).json({
        error: "Senha fraca: deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
      });
    }

    // Verifica email já usado
    const existingUser = await usuariosRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email já está em uso" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const [newUser] = await usuariosRepository.createUser({
      nome,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({ id: newUser.id, nome: newUser.nome, email: newUser.email });
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro ao registrar usuário" });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const user = await usuariosRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isValid = await bcrypt.compare(senha, user.senha);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ acess_token: token });
  } catch (error) {
    res.status(500).json({ error: "Erro no login" });
  }
}

async function logout(req, res) {
  res.status(200).json({ message: "Logout realizado com sucesso" });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const deleted = await usuariosRepository.deleteUser(id);
    if (!deleted) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
}

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

module.exports = { register, login, logout, deleteUser, getMe };