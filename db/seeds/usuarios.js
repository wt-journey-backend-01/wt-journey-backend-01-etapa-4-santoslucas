const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('usuarios').del();

  const senhaHash = await bcrypt.hash('Senha@123', 10);

  await knex('usuarios').insert([
    { id: 1, nome: 'Admin', email: 'admin@policia.com', senha: senhaHash },
    { id: 2, nome: 'Agente Silva', email: 'silva@policia.com', senha: senhaHash },
    { id: 3, nome: 'Delegada Souza', email: 'souza@policia.com', senha: senhaHash }
  ]);
};
