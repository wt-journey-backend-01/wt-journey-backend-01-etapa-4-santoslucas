const bcrypt = require('bcryptjs');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('usuarios').del();
    await knex('usuarios').insert([
        {
            nome: 'Carlos Mendes',
            email: 'carlosm@gmail.com',
            senha: await bcrypt.hash(
                'MinhaSenha@1',
                await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10)
            ),
        },
        {
            nome: 'Ana Pereira',
            email: 'anap@gmail.com',
            senha: await bcrypt.hash(
                'Segura#2025',
                await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10)
            ),
        },
        {
            nome: 'Roberto Lima',
            email: 'robertol@gmail.com',
            senha: await bcrypt.hash(
                'Forte!Senha7',
                await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10)
            ),
        },
    ]);
};
