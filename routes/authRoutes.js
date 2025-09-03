const express = require('express');
const { z } = require('zod');
const router = express.Router();
const authController = require('../controllers/authController');
const ErrorMsg = require('../utils/ErrorMsg');

const baseUsuario = z.object({
    nome: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo nome é obrigatório'
                    : 'O campo nome deve ser uma string',
        })
        .min(1, 'O campo nome é obrigatório'),
    email: z.email({
        error: (issue) =>
            issue.input === undefined
                ? 'O campo email é obrigatório'
                : 'O campo email deve ser um email válido',
    }),
    senha: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo senha é obrigatório'
                    : 'O campo senha deve ser uma string',
        })
        .min(8, 'O campo senha deve ter pelo menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/, {
            message:
                'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
        }),
});

const loginUsuario = z
    .object({
        email: z.email({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo email é obrigatório'
                    : 'O campo email deve ser um email válido',
        }),
        senha: z.string({
            error: (issue) =>
                issue.input === undefined
                    ? 'O campo senha é obrigatório'
                    : 'O campo senha deve ser uma string',
        }),
    })
    .strict();

const registerUsuario = baseUsuario.strict();

router.post('/register', checkParams(registerUsuario), authController.register);
router.post('/login', checkParams(loginUsuario), authController.login);
router.post('/logout', authController.logout);

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
