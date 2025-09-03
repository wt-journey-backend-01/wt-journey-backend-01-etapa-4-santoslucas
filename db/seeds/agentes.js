/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('agentes').del();
    await knex('agentes').insert([
        {
            nome: 'Mariana Oliveira',
            dataDeIncorporacao: '2000-09-15',
            cargo: 'delegado',
        },
        {
            nome: 'Ricardo Almeida',
            dataDeIncorporacao: '2012-07-03',
            cargo: 'inspetor',
        },
        {
            nome: 'Fernanda Souza',
            dataDeIncorporacao: '2008-11-21',
            cargo: 'inspetor',
        },
        {
            nome: 'João Batista',
            dataDeIncorporacao: '2019-05-10',
            cargo: 'delegado',
        },
    ]);
};
