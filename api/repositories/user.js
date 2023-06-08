const bcrypt = require("bcrypt");
const pool = require("../database/DB_config");

// {
//   "nome": "Gabriel Barros",
//   "senha": "dahoralek123",
//   "email": "gabrielbarros1999@hotmail.com",
//   "cpf": "416.495.558.90",
//   "data_nasc": "1999-06-17",
//   "telefone": "12992372037",
//   "estado": "Parana",
//   "cep": "12031260",
//   "cidade": "Curitiba",
//   "enderco": "Rua iapó 1174, rebouças"
// }

// funcoes de usuário
async function findUsers() {
  const [rows] = await pool.query("SELECT * FROM pessoa");
  return rows;
}

async function findUserBy(key, value) {
  const [rows] = await pool.query(`SELECT * FROM usuario WHERE ${key} = ?`, [value]);
  return rows[0];
}

async function createUser({ nome, email, senha, telefone }) {
  const encrypPassword = bcrypt.hashSync(senha, 10);
  const insertUserSql = `INSERT INTO usuario (nome, telefone, email, senha) 
  VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID();`;
  const [row] = await pool.query(insertUserSql, [nome, telefone, email, encrypPassword]);
  return { userId: row[1][0]["LAST_INSERT_ID()"] };
}

async function deleteUser({ id }) {
  const row = await pool.query("DELETE FROM pessoa WHERE idPessoa = ?", [id]);
  return row;
}

// funcoes de pessoa
async function findPersonByCpf(cpf) {
  const [rows] = await pool.query("SELECT * FROM pessoa WHERE cpf = ?", [cpf]);
  return rows[0];
}

async function createPerson({ userId, cpf, dataNascimento }) {
  const insertPersonSql = `INSERT INTO pessoa (cpf, data_nascimento, fk_Usuario_id)
  VALUES (?,?,?);
  SELECT nome, telefone, email, cpf FROM boramarcar.usuario 
  JOIN boramarcar.pessoa 
  ON usuario.id = pessoa.fk_Usuario_id`;
  const [row] = await pool.query(insertPersonSql, [cpf, dataNascimento, userId]);
  return row[1][0];
}

// funcoes de estabelecimento
async function createEstablishment({ userId, cnpj, tipo, addressId }) {
  const insertEstablishmentSql = `INSERT INTO estabelecimento (cnpj, tipo, fk_Usuario_id, fk_Endereco_id)
  VALUES (?,?,?, ?);
  SELECT nome, telefone, email, cpf FROM boramarcar.usuario 
  JOIN boramarcar.estabelecimento 
  ON usuario.id = estabelecimento.fk_Usuario_id`;
  const [row] = await pool.query(insertEstablishmentSql, [cnpj, tipo, userId, addressId]);
  return row[1][0];
}

async function findEstablishmentByCnpj(cnpj) {
  const [rows] = await pool.query("SELECT * FROM estabelecimento WHERE cnpj = ?", [cnpj]);
  return rows[0];
}

async function createAddress({ logradouro, complemento, cep, municipio, estado }) {
  const insertAddressSql = `INSERT INTO endereco (Logradouro, Complemento, CEP, Municipio, Estado) 
  VALUES (?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();`;
  const variables = [logradouro, complemento, cep, municipio, estado];
  const [row] = await pool.query(insertAddressSql, variables);
  return { addressId: row[1][0]["LAST_INSERT_ID()"] };
}

module.exports = {
  findUsers,
  findUserBy,
  findPersonByCpf,
  createUser,
  createPerson,
  deleteUser,
  createEstablishment,
  createAddress,
  findEstablishmentByCnpj,
  // findUserById,
};
