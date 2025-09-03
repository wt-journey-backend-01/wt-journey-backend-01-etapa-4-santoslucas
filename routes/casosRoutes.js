const express = require('express');
const { z } = require('zod');
const router = express.Router();
const casosController = require('../controllers/casosController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const ErrorMsg = require('../utils/ErrorMsg');

const baseCaso = z.object({
    titulo: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo título é obrigatório'
                    : 'O campo título deve ser uma string',
        })
        .min(1, 'O campo título é obrigatório'),
    descricao: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo descrição é obrigatório'
                    : 'O campo descrição deve ser uma string',
        })
        .min(1, 'O campo descrição é obrigatório'),
    status: z.enum(['aberto', 'solucionado'], {
        error: (issue) =>
            issue.input === undefined
                ? 'O campo status é obrigatório'
                : "O campo status deve ser 'aberto' ou 'solucionado'",
    }),

    agente_id: z
        .int({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo agente_id é obrigatório'
                    : 'O campo agente_id deve ser um número inteiro',
        })
        .positive('O campo agente_id deve ser positivo'),
});

const postCaso = baseCaso.strict();
const putCaso = baseCaso.strict();
const patchCaso = baseCaso.strict().partial();

router.get('/search', authenticateToken, casosController.searchCasos);
router.get('/:id/agente', authenticateToken, checkID, casosController.getAgenteByCaso);
router.get('/', authenticateToken, casosController.getAllCasos);
router.get('/:id', authenticateToken, checkID, casosController.getCasoById);
router.post('/', authenticateToken, checkParams(postCaso), casosController.postCaso);
router.put(
    '/:id',
    authenticateToken,
    checkID,
    checkParams(putCaso),
    casosController.updateCaso
);
router.patch(
    '/:id',
    authenticateToken,
    checkID,
    checkParams(patchCaso),
    casosController.patchCaso
);
router.delete('/:id', authenticateToken, checkID, casosController.deleteCaso);


function checkID(req, res, next) {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
        return next(
            new ErrorMsg(404, 'Parâmetros inválidos', {
                id: 'O parâmetro ID deve ser um número inteiro',
            })
        );
    }
    next();
}

function checkParams(schema) {
    return (req, res, next) => {
        const data = req.body;
        const results = schema.safeParse(data);

        if (!results.success) {
            const issues = results.error.issues;
            const errors = {};

            for (const issue of issues) {
                if (issue.path[0] != errors.key) {
                    const field = issue.path[0];
                    if (!errors[field]) {
                        errors[field] = issue.message;
                    }
                }
            }

            return next(new ErrorMsg(400, 'Parâmetros inválidos', errors));
        }

        req.body = results.data;
        next();
    };
}

module.exports = router;
