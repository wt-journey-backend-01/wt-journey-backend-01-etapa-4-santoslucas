const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');
const ErrorMsg = require('../utils/ErrorMsg');

async function getAgenteOrThrowErrorMsg(id) {
    const agente = await agentesRepository.findById(id);
    if (!agente) {
        throw new ErrorMsg(404, `Não foi possível encontrar o agente de Id: ${id}.`);
    }
    return agente;
}

async function getAllAgentes(req, res) {
    const cargo = req.query.cargo;
    const sort = req.query.sort;
    if (sort && !['dataDeIncorporacao', '-dataDeIncorporacao'].includes(sort)) {
        throw new ErrorMsg(400, 'Parâmetros inválidos', {
            sort: "O parâmetro 'sort' deve ser 'dataDeIncorporacao' ou '-dataDeIncorporacao'.",
        });
    }
    const filters = {};
    if (cargo) filters.cargo = cargo;
    if (sort) filters.sort = sort;
    const agentes = await agentesRepository.findAll(filters);

    if (cargo) {
        if (agentes.length === 0) {
            throw new ErrorMsg(404, `Não foi possível encontrar agentes com o cargo: ${cargo}.`);
        }
    }
    res.status(200).json(agentes);
}

async function getAgenteById(req, res) {
    const id = req.params.id;
    const agente = await getAgenteOrThrowErrorMsg(id);
    res.status(200).json(agente);
}

async function getCasosByAgente(req, res) {
    const id = req.params.id;
    await getAgenteOrThrowErrorMsg(id);

    const casos = await casosRepository.findByAgenteId(id);
    if (casos.length === 0) {
        throw new ErrorMsg(404, `Não foi possível encontrar casos para o agente de Id: ${id}`);
    }
    res.status(200).json(casos);
}

async function postAgente(req, res) {
    const agente = req.body;
    const createdAgente = await agentesRepository.create(agente);
    res.status(201).json(createdAgente);
}

async function putAgente(req, res) {
    const id = req.params.id;
    await getAgenteOrThrowErrorMsg(id);

    const agente = req.body;
    const updatedAgente = await agentesRepository.update(id, agente);
    res.status(200).json(updatedAgente);
}

async function patchAgente(req, res) {
    const id = req.params.id;
    await getAgenteOrThrowErrorMsg(id);

    const agente = req.body;
    if (Object.keys(agente).length === 0) {
        throw new ErrorMsg(
            400,
            'Deve haver pelo menos um campo para realizar a atualização de agente'
        );
    }
    const updatedAgente = await agentesRepository.update(id, agente);
    res.status(200).json(updatedAgente);
}

async function deleteAgente(req, res) {
    const id = req.params.id;
    await getAgenteOrThrowErrorMsg(id);
    await agentesRepository.remove(id);
    res.status(204).send();
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    getCasosByAgente,
    postAgente,
    putAgente,
    patchAgente,
    deleteAgente,
    getAgenteOrThrowErrorMsg,
};
