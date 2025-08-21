const express = require('express');
require('dotenv').config();

const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const authRoutes = require("./routes/authRoutes");
const { globalErrorHandler } = require('./utils/errorHandler');
const swaggerDocs = require('./docs/swagger');
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas públicas
app.use("/auth", authRoutes);

// Rotas protegidas
app.use("/agentes", authMiddleware, agentesRoutes);
app.use("/casos", authMiddleware, casosRoutes);

swaggerDocs(app);

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});
