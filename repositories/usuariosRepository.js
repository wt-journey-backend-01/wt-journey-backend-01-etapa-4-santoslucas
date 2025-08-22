const db = require("../db/db");

async function createUser({ nome, email, senha }) {
  return await db("usuarios").insert({ nome, email, senha }).returning("*");
}

async function findByEmail(email) {
  return await db("usuarios").where({ email }).first();
}

async function deleteUser(id) {
  return await db("usuarios").where({ id }).del();
}

async function findById(id) {
  return await db("usuarios").where({ id }).first();
}

module.exports = { createUser, findByEmail, deleteUser, findById };
