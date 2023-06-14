const pool = require("../database/DB_config");

async function createSession(token) {
  const insertSessionSql = `INSERT INTO sessaoadmin (token) 
  VALUES (?);
  SELECT token FROM sessaoadmin WHERE id = LAST_INSERT_ID();
  `;
  const [row] = await pool.query(insertSessionSql, [token]);

  return row[1][0];
}

async function findByToken(token) {
  const querySessionSql = "SELECT * FROM sessaoadmin WHERE token = ?";
  const [row] = await pool.query(querySessionSql, [token]);

  return row[0];
}

async function findEvents() {
  const selectSql = "SELECT id, nome FROM evento";
  const [rows] = await pool.query(selectSql);

  return rows;
}

async function findEvent(id) {
  const selectSql = "SELECT * FROM evento WHERE id = ?";
  const [row] = await pool.query(selectSql, [id]);

  return row[0];
}

module.exports = {
  createSession,
  findByToken,
  findEvents,
  findEvent,
};
