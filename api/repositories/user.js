const pool = require('../database/DB_config');
const bcrypt = require('bcrypt');

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

async function findUsers() {
  const [rows] = await pool.query('SELECT * FROM pessoa');
  return rows;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuario JOIN pessoa ON id = fk_Usuario_id WHERE Email = ?', [ email ]);
  return rows[0];
}

async function createUser({nome, email, senha, telefone}) {
  const senha_encript = bcrypt.hashSync(senha, 10);
  const insertUserSql = `INSERT INTO usuario (Nome_Razao_Social, Telefone, Email, Senha) 
  VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID();`
  const [row] = await pool.query(insertUserSql,[nome,telefone,email,senha_encript,]);
  return {userId: row[1][0]['LAST_INSERT_ID()']};
}

async function createPerson({userId, cpf, data_nasc}) {
  const insertPersonSql = `INSERT INTO pessoa (CPF, Data_nascimento, fk_Usuario_id)
  VALUES (?,?,?);
  SELECT Nome_Razao_Social, Telefone, Email, CPF FROM boramarcar.usuario 
  JOIN boramarcar.pessoa 
  ON usuario.id = pessoa.fk_Usuario_id`;
  const [row] = await pool.query(insertPersonSql, [cpf, data_nasc, userId])
  return row[1][0];
}

async function deleteUser({id}) {
  const row = await pool.query('DELETE FROM pessoa WHERE idPessoa = ?', [id])
  return row;
}

module.exports = {
  findUsers,
  findUserByEmail,
  createUser,
  createPerson,
  deleteUser
}