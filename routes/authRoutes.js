const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usuariosRepository = require("../repositories/usuariosRepository");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.delete("/users/:id", async (req, res) => {
  try {
    await usuariosRepository.deleteUser(req.params.id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

module.exports = router;
