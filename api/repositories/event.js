const fs = require("fs");

const pool = require("../database/DB_config");

async function findEvents() {
  const getEventsSql = `SELECT ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, fk_Imagem_Id 
  FROM evento AS ev
  join endereco ON endereco.id = fk_Endereco_id;`;
  const [rows] = await pool.query(getEventsSql);
  return rows;
}

// const insertPersonSql = `SELECT Horario, Nome, Publico, url_imagem, fk_Usuario_id, fk_Endereco_id
//   JOIN boramarcar.evento
//   ON endereco.id = evento.fk_Endereco_id`;
//   const [row] = await pool.query(insert, [cpf, data_nasc, addressId])
//   return row[1][0];

async function findEventById(id) {
  const [rows] = await pool.query("SELECT * FROM evento WHERE id = ?", [id]);
  return rows[0];
}

async function createEvent({ horario, nome, descricao, publico, imageId, userId, addressId }) {
  const insertEventSql = `INSERT INTO evento (Horario, nome, descricao, publico, fk_Imagem_id, fk_Usuario_id, fk_Endereco_id) 
  VALUES (?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();`;
  const variables = [horario, nome, descricao, publico === "true", imageId, userId, addressId];
  const [row] = await pool.query(insertEventSql, variables);
  return row[1][0];
}

async function updateEvent({ id, horario, nome, publico, imageUrl }) {
  const row = await pool.query("UPDATE evento SET Horario = ?, Nome = ?, Publico = ?, url_imagem = ? WHERE id = ?", [
    horario,
    nome,
    publico,
    imageUrl,
    id,
  ]);
  return row;
}

async function deleteEvent({ id }) {
  const row = await pool.query("DELETE FROM evento WHERE id = ?", [id]);
  return row;
}

async function createImage({ file }) {
  const tipo = file.mimetype;
  const nome = file.originalname;
  const arquivo = fs.readFileSync(`${__dirname}/../static/temp/${file.filename}`);
  const insertImageSql = `INSERT INTO imagem (nome,tipo,arquivo) 
  VALUES (?, ?, ?); SELECT LAST_INSERT_ID();`;
  const variables = [nome, tipo, arquivo];
  const [row] = await pool.query(insertImageSql, variables);
  return { imageId: row[1][0]["LAST_INSERT_ID()"] };
}

async function createAddress({ logradouro, complemento, cep, municipio, estado }) {
  const insertAddressSql = `INSERT INTO endereco (Logradouro, Complemento, CEP, Municipio, Estado) 
  VALUES (?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();`;
  const variables = [logradouro, complemento, cep, municipio, estado];
  const [row] = await pool.query(insertAddressSql, variables);
  return { addressId: row[1][0]["LAST_INSERT_ID()"] };
}

module.exports = {
  findEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createAddress,
  createImage,
};
