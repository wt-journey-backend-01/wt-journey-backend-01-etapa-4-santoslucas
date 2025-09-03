const express = require('express');
const { z } = require('zod');
const router = express.Router();
const agentesController = require('../controllers/agentesController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const ErrorMsg = require('../utils/ErrorMsg');

const baseAgente = z.object({
    nome: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo nome é obrigatório'
                    : 'O campo nome deve ser uma string',
        })
        .min(1, 'O campo nome é obrigatório'),
    dataDeIncorporacao: z
        .string('O campo dataDeIncorporacao é obrigatório')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'O campo dataDeIncorporacao deve estar no formato YYYY-MM-DD')
        .refine(
            (date) => {
                const parsed = new Date(date);
                return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
            },
            { error: 'O campo dataDeIncorporacao deve ser uma data válida' }
        )
        .refine(
            (dataValida) => {
                const today = new Date();
                const date = new Date(dataValida);
                return date <= today;
            },
            { error: 'A data de incorporação não pode ser futura' }
        ),
    cargo: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo cargo é obrigatório'
                    : 'O campo cargo deve ser uma string',
        })
        .min(1, 'O campo cargo é obrigatório'),
});


const postAgente = baseAgente.strict();
const putAgente = baseAgente.strict();
const patchAgente = baseAgente.strict().partial();

router.get('/:id/casos', authenticateToken, checkID, agentesController.getCasosByAgente);
router.get('/', authenticateToken, agentesController.getAllAgentes);
router.get('/:id', authenticateToken, checkID, agentesController.getAgenteById);
router.post('/', authenticateToken, checkParams(postAgente), agentesController.postAgente);
router.put(
    '/:id',
    authenticateToken,
    checkID,
    checkParams(putAgente),
    agentesController.putAgente
);
router.patch(
    '/:id',
    authenticateToken,
    checkID,
    checkParams(patchAgente),
    agentesController.patchAgente
);
router.delete('/:id', authenticateToken, checkID, agentesController.deleteAgente);

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
