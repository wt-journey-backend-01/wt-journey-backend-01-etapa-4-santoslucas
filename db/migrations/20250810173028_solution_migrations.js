/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('agentes', (table) => {
            table.increments('id').primary();
            table.string('nome').notNullable();
            table.date('dataDeIncorporacao').notNullable();
            table.string('cargo').notNullable();
        })
        .createTable('casos', (table) => {
            table.increments('id').primary();
            table.string('titulo').notNullable();
            table.text('descricao').notNullable();
            table.enum('status', ['aberto', 'solucionado']).notNullable();
            table
                .integer('agente_id')
                .notNullable()
                .references('id')
                .inTable('agentes')
                .onDelete('CASCADE');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('casos').dropTableIfExists('agentes');
};
