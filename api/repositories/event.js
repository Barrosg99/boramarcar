const pool = require("../database/DB_config");

async function findEvents({ userId, eventosMarcados, meusEventos }) {
  let getEventsSql;
  if (userId && meusEventos === "true") {
    getEventsSql = `SELECT ev.id ,ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId 
    FROM evento AS ev
    join endereco ON endereco.id = enderecoId
    where ev.usuarioId = ${userId};`;
  } else if (userId && eventosMarcados === "false") {
    getEventsSql = `SELECT ev.id ,ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId
    FROM evento AS ev
    JOIN endereco ON endereco.id = enderecoId
    WHERE 
    (ev.id IN (SELECT eventoId FROM comparece WHERE usuarioId = ${userId} AND presente = false)
    OR ev.id NOT IN (SELECT eventoId FROM comparece WHERE usuarioId = ${userId})) AND usuarioId != ${userId};`;
  } else if (userId && eventosMarcados === "true") {
    getEventsSql = `SELECT ev.id ,ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId
    FROM evento AS ev
    JOIN endereco ON endereco.id = enderecoId
    WHERE ev.id IN (SELECT eventoId FROM comparece WHERE usuarioId = ${userId} AND presente = ${true});`;
  } else {
    getEventsSql = `SELECT ev.id, ev.horario, ev.nome, ev.descricao, ev.publico, logradouro, complemento, cep, municipio, estado, imagemId 
    FROM evento AS ev
    join endereco ON endereco.id = enderecoId`;
    if (userId) getEventsSql += `\nWHERE ev.usuarioId != ${userId}`;
  }

  const [rows] = await pool.query(getEventsSql);
  return rows;
}

async function findEventById(id) {
  const [rows] = await pool.query(
    `SELECT ev.id,ev.nome,ev.descricao,ev.publico,ev.horario,ev.imagemId,en.logradouro,en.municipio,en.estado,en.cep,en.complemento,us.nome as nomeUsuario,us.imagemId as imagemUsuario,ev.usuarioId
FROM evento as ev 
JOIN endereco as en ON en.id = enderecoId 
JOIN usuario as us ON us.id = usuarioId
WHERE ev.id = ?;`,
    [id],
  );
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

async function getPersonEvent({ userId, eventId }) {
  const selectSql = "SELECT presente FROM comparece WHERE usuarioId = ? AND eventoId = ?";
  const [rows] = await pool.query(selectSql, [userId, eventId]);
  return rows[0];
}

async function createPersonEvent({ userId, eventId }) {
  const insertSql = `INSERT INTO comparece (usuarioId, eventoId, presente)
  VALUES
  (?,?,?);`;
  await pool.query(insertSql, [userId, eventId, true]);
}

async function toggleAttendanceEvent({ userId, eventId }) {
  const updateSql = `UPDATE comparece SET presente = not presente WHERE usuarioId = ? AND eventoId = ?;
  SELECT presente FROM comparece WHERE usuarioId = ? AND eventoId = ?;`;
  const [row] = await pool.query(updateSql, [userId, eventId, userId, eventId]);
  return row[1][0];
}

module.exports = {
  findEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getPersonEvent,
  createPersonEvent,
  toggleAttendanceEvent,
};
