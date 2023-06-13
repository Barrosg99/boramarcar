// const fs = require("fs");

const pool = require("../database/DB_config");

async function findEvents({ userId, eventosMarcados, meusEventos }) {
  let getEventsSql;
  if (userId && meusEventos === "true") {
    getEventsSql = `SELECT ev.id ,ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId 
    FROM evento AS ev
    join endereco ON endereco.id = enderecoId
    where ev.usuarioId = ${userId};`;
  } else if (userId && eventosMarcados === "false") {
    // getEventsSql = `SELECT ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId
    // FROM evento AS ev
    // join endereco ON endereco.id = enderecoId
    // where ev.usuarioId != ${userId};`;
  } else if (userId && eventosMarcados === "true") {
    // getEventsSql = `SELECT ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId
    // FROM evento AS ev
    // join endereco ON endereco.id = enderecoId
    // where ev.usuarioId != ${userId};`;
  } else {
    getEventsSql = `SELECT ev.id, ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId 
    FROM evento AS ev
    join endereco ON endereco.id = enderecoId;`;
  }

  const [rows] = await pool.query(getEventsSql);
  return rows;
}

async function findEventById(id) {
  const [rows] = await pool.query("select * from evento join endereco on endereco.id = enderecoId where evento.id = ?;", [id]);
  return rows[0];
}

async function createEvent({ horario, nome, descricao, publico, imageId, userId, addressId }) {
  const insertEventSql = `INSERT INTO evento (Horario, nome, descricao, publico, imagemId, usuarioId, enderecoId) 
  VALUES (?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();`;
  const variables = [horario, nome, descricao, publico === "true", imageId, userId, addressId];
  const [row] = await pool.query(insertEventSql, variables);
  return row[1][0];
}

async function updateEvent({ id, horario, nome, publico, descricao, imageId, removeImageId }) {
  let fields = "Horario = ?, Nome = ?, Publico = ?, Descricao = ?";
  const variables = [horario, nome, publico === "true", descricao, id];
  if (imageId) {
    fields += ", imagemId = ?";
    variables.splice(variables.length - 1, 0, imageId);
  }
  const row = await pool.query(`UPDATE evento SET ${fields} WHERE id = ?`, variables);
  if (imageId) pool.query("DELETE FROM imagem WHERE id = ?", [removeImageId]);
  return row;
}

async function deleteEvent(id) {
  const row = await pool.query("DELETE FROM evento WHERE id = ?", [id]);
  return row;
}

module.exports = {
  findEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
