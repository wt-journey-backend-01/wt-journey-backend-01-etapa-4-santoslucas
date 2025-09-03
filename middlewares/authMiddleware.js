const jwt = require('jsonwebtoken');
const ErrorMsg = require('../utils/ErrorMsg');

const secret = process.env.JWT_SECRET || 'secret';

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return next(
                new ErrorMsg(401, 'Token não fornecido', {
                    token: 'O token de autenticação é necessário',
                })
            );
        }
        
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next(
                new ErrorMsg(401, 'Token fornecido com formato inválido', {
                    token: 'O token de autenticação é necessário',
                })
            );
        }

        jwt.verify(token, secret, (err, user) => {
            if (err) {
                return next(
                    new ErrorMsg(401, 'Token inválido ou expirado', {
                        token: 'O token de autenticação é inválido ou expirou',
                    })
                );
            }
            req.user = user;
            next();
        });
    } catch (error) {
        return next(new ErrorMsg(401, 'Erro na validação do token'));
    }
}

module.exports = { authenticateToken };
