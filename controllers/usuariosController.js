const usuariosRepository = require('../repositories/usuariosRepository');
const ErrorMsg = require('../utils/ErrorMsg');

async function getMe(req, res) {
    const id = req.user.id;
    const usuario = await usuariosRepository.findById(id);

    if (!usuario) {
        throw new ErrorMsg(404, 'Usuário não encontrado');
    }

    delete usuario.senha;
    return res.json(usuario);
}

async function deleteUsuario(req, res) {
    const id = req.params.id;
    const usuario = await usuariosRepository.findById(id);

    if (!usuario) {
        throw new ErrorMsg(404, 'Usuário não encontrado');
    }

    await usuariosRepository.delete(id);
    return res.status(204).send();
}

module.exports = {
    getMe,
    deleteUsuario,
};
