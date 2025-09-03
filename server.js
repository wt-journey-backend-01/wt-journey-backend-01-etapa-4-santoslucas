const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 3000;
const usuariosRouter = require('./routes/usuariosRoutes');
const casosRouter = require('./routes/casosRoutes');
const agentesRouter = require('./routes/agentesRoutes');
const authRouter = require('./routes/authRoutes');
const swaggerDocs = require('./docs/swagger');
const errorHandler = require('./utils/errorHandler');

app.use(express.json());
app.use('/usuarios', usuariosRouter);
app.use('/casos', casosRouter);
app.use('/agentes', agentesRouter);
app.use('/auth', authRouter);
swaggerDocs(app);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(
        `Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`
    );
});
