const pool = require('../database/DB_config');

async function findEvents() {
  const [rows] = await pool.query('SELECT * FROM evento');
  return rows;
}

// const insertPersonSql = `SELECT Horario, Nome, Publico, url_imagem, fk_Usuario_id, fk_Endereco_id 
//   JOIN boramarcar.evento 
//   ON endereco.id = evento.fk_Endereco_id`;
//   const [row] = await pool.query(insert, [cpf, data_nasc, addressId])
//   return row[1][0];

async function findEventById(id) {
  const [rows] = await pool.query('SELECT * FROM evento WHERE id = ?', [ id ]);
  return rows[0];
}

async function createEvent({horario, nome, publico, url_imagem, userId, addressId}) {
  const insertEventSql = `INSERT INTO evento (Horario, nome, publico, url_imagem, fk_Usuario_id, fk_Endereco_id) 
  VALUES (?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();`
  const [row] = await pool.query(insertEventSql, [horario, nome, publico, url_imagem, userId, addressId]);
  return row[1][0];
}

async function updateEvent({id}) {
  const row = await pool.query('UPDATE Evento SET Horario = ?, Nome = ?, Publico = ?, url_imagem = ?, fk_Usuario_id = ?, fk_Endereco_id = ? WHERE id = ?', [id])
  return row;
}

async function deleteEvent({id}) {
  const row = await pool.query('DELETE FROM evento WHERE idEvento = ?', [id])
  return row;
}

async function createAddress({logradouro, complemento, cep, municipio, estado}) {
  const insertAddressSql = `INSERT INTO endereco (Logradouro, Complemento, CEP, Municipio, Estado) 
  VALUES (?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();`
  const [row] = await pool.query(insertAddressSql,[logradouro, complemento, cep, municipio, estado]);
  return {addressId: row[1][0]['LAST_INSERT_ID()']};
}

module.exports = {
  findEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createAddress
}
