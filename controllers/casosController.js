const casosRepository = require('../repositories/casosRepository');
const agentesController = require('../controllers/agentesController');
const ErrorMsg = require('../utils/ErrorMsg');

async function getCasoOrThrowErrorMsg(id) {
    const caso = await casosRepository.findById(id);
    if (!caso) {
        throw new ErrorMsg(404, `Não foi possível encontrar o caso de Id: ${id}.`);
    }
    return caso;
}

async function getAllCasos(req, res) {
    const agente_id = req.query.agente_id;
    const status = req.query.status;

    if (status) {
        if (!['aberto', 'solucionado'].includes(status)) {
            throw new ErrorMsg(400, 'Parâmetros inválidos', {
                status: "O status deve ser 'aberto' ou 'solucionado'.",
            });
        }
    }

    const filters = {};
    if (status) filters.status = status;
    if (agente_id) filters.agente_id = agente_id;
    const casos = await casosRepository.findAll(filters);

    if (status) {
        if (casos.length === 0) {
            throw new ErrorMsg(404, `Não foi possível encontrar casos com o status: ${status}.`);
        }
    }

    if (agente_id) {
        if (casos.length === 0) {
            throw new ErrorMsg(404, `Nenhum caso foi encontrado para o agente de Id: ${agente_id}`);
        }
    }
    res.status(200).json(casos);
}

async function getCasoById(req, res) {
    const id = req.params.id;
    const caso = await getCasoOrThrowErrorMsg(id);
    res.status(200).json(caso);
}

async function getAgenteByCaso(req, res) {
    const caso_id = req.params.id;
    const caso = await getCasoOrThrowErrorMsg(caso_id);
    const agente = await agentesController.getAgenteOrThrowErrorMsg(caso.agente_id);

    res.status(200).json(agente);
}

async function searchCasos(req, res) {
    const search = req.query.q;
    if (!search || search.trim() === '') {
        throw new ErrorMsg(404, "Parâmetro de pesquisa 'q' não encontrado");
    }

    const searchedCasos = await casosRepository.search(search.trim());

    if (searchedCasos.length === 0) {
        throw new ErrorMsg(
            404,
            `Não foi possível encontrar casos que correspondam à pesquisa: ${search}.`
        );
    }
    res.status(200).send(searchedCasos);
}

async function postCaso(req, res) {
    const caso = req.body;
    await agentesController.getAgenteOrThrowErrorMsg(caso.agente_id);
    const createdCaso = await casosRepository.create(caso);
    res.status(201).json(createdCaso);
}

async function updateCaso(req, res) {
    const id = req.params.id;
    const caso = req.body;
    await getCasoOrThrowErrorMsg(id);
    await agentesController.getAgenteOrThrowErrorMsg(caso.agente_id);

    const updatedCaso = await casosRepository.update(id, caso);
    res.status(200).json(updatedCaso);
}

async function patchCaso(req, res) {
    const id = req.params.id;
    await getCasoOrThrowErrorMsg(id);

    const caso = req.body;
    if (Object.keys(caso).length === 0) {
        throw new ErrorMsg(
            400,
            'Pelo menos um dos campos titulo, descricao, status ou agente_id deve ser fornecido para atualizar um caso.'
        );
    }
    if (caso.agente_id) {
        await agentesController.getAgenteOrThrowErrorMsg(caso.agente_id);
    }

    const patchedCaso = await casosRepository.update(id, caso);
    res.status(200).json(patchedCaso);
}

async function deleteCaso(req, res) {
    const id = req.params.id;
    await getCasoOrThrowErrorMsg(id);
    await casosRepository.remove(id);
    res.status(204).send();
}

module.exports = {
    getAllCasos,
    getCasoById,
    postCaso,
    updateCaso,
    patchCaso,
    deleteCaso,
    getAgenteByCaso,
    searchCasos,
};
