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
  const [rows] = await pool.query('SELECT * FROM pessoa WHERE email = ?', [ email ]);
  return rows[0];
}

async function createOrUpdateUser({id = 0, nome, email, senha, cpf, data_nasc, telefone, estado, cep, cidade,endereco }) {
  const senha_encript = bcrypt.hashSync(senha, 10);
  const sql = `CALL pessoaAddOrEdit(?,?,?,?,?,?,?,?,?,?,?);`;
  const [row] = await pool.query(sql,[id,nome,cpf,email,senha_encript,endereco,cep,estado,cidade,telefone,data_nasc])
  return row[0];
}

async function deleteUser({id}) {
  const row = await pool.query('DELETE FROM pessoa WHERE idPessoa = ?', [id])
  return row;
}

module.exports = {
  findUsers,
  findUserByEmail,
  createOrUpdateUser,
  deleteUser
}