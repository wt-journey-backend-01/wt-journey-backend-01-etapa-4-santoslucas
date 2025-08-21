const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuariosRepository = require("../repositories/usuariosRepository");

async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
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
    res.status(500).json({ error: "Erro ao registrar usuário" });
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
  // Para JWT, basta invalidar no cliente
  res.status(200).json({ message: "Logout realizado com sucesso" });
}

module.exports = { register, login, logout };
