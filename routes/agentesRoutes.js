const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

/**
 * @swagger
 * tags:
 *   - name: Agentes
 *     description: API para gerenciamento de agentes
 */

/**
 * @swagger
/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Retorna a lista de todos os agentes
 *     tags: [Agentes]
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *         description: Filtra agentes pelo cargo.
 *       - in: query
 *         name: dataDeIncorporacaoInicio
 *         schema:
 *           type: string
 *           format: date
 *           example: "2000-01-01"
 *         description: Filtra agentes com data de incorporação a partir desta data (formato YYYY-MM-DD).
 *       - in: query
 *         name: dataDeIncorporacaoFim
 *         schema:
 *           type: string
 *           format: date
 *           example: "2015-12-31"
 *         description: Filtra agentes com data de incorporação até esta data (formato YYYY-MM-DD).
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-dataDeIncorporacao"
 *         description: >
 *           Ordena os resultados. Use o nome do campo para ordem ascendente e "-nomeDoCampo" para descendente
 *           (ex: dataDeIncorporacao ou -dataDeIncorporacao).
 *     responses:
 *       200:
 *         description: A lista de agentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Parâmetro de filtro inválido.
 */
router.get('/', agentesController.getAllAgentes);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Retorna um agente específico pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do agente.
 *     responses:
 *       200:
 *         description: Os dados do agente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado.
 */
router.get('/:id', agentesController.getAgenteById);

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *     responses:
 *       201:
 *         description: O agente foi criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', agentesController.createAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza um agente existente por completo (todos os campos são necessários)
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do agente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agente'
 *     responses:
 *       200:
 *         description: O agente foi atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Agente não encontrado.
 */
router.put('/:id', agentesController.updateAgenteCompleto);
/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza um agente existente parcialmente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do agente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *     responses:
 *       200:
 *         description: O agente foi atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Agente não encontrado.
 */
router.patch('/:id', agentesController.updateAgenteParcial);
/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do agente.
 *     responses:
 *       204:
 *         description: Agente removido com sucesso.
 *       404:
 *         description: Agente não encontrado.
 */
router.delete('/:id', agentesController.deleteAgente);
router.get('/:id/casos', agentesController.findCasosByAgente);

module.exports = router;
