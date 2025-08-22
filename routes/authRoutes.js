const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usuariosRepository = require("../repositories/usuariosRepository");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
});


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


module.exports = router;
