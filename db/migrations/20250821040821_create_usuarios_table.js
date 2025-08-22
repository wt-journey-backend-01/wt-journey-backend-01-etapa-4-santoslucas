/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("usuarios", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string("nome").notNullable();
    table.string("email").notNullable().unique();
    table.string("senha").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("usuarios");
};
