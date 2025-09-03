/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('casos').del();
    await knex('casos').insert([
        {
            titulo: 'Furto em residência',
            descricao:
                'Casa invadida durante a madrugada de 15/08/2015. Pertences de valor foram levados, sem sinais de arrombamento.',
            status: 'aberto',
            agente_id: 1,
        },
        {
            titulo: 'Tráfico de drogas',
            descricao:
                'Operação policial flagrou indivíduos comercializando entorpecentes em via pública no dia 22/09/2018.',
            status: 'solucionado',
            agente_id: 2,
        },
        {
            titulo: 'Estelionato bancário',
            descricao:
                'Vítima relatou transferências não autorizadas realizadas em sua conta corrente no dia 04/01/2021.',
            status: 'solucionado',
            agente_id: 3,
        },
        {
            titulo: 'Incêndio suspeito',
            descricao:
                'Galpão industrial incendiado no dia 30/11/2019. Testemunhas afirmam ter visto indivíduos deixando o local rapidamente.',
            status: 'aberto',
            agente_id: 4,
        },
    ]);
};
