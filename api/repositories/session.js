const pool = require("../database/DB_config");

async function createByUserId(userId, token) {
  const insertSessionSql = `INSERT INTO sessao (usuarioId, token) 
  VALUES (?,?);
  SELECT * FROM sessao WHERE id = LAST_INSERT_ID();
  `;
  const [row] = await pool.query(insertSessionSql, [userId, token]);

  return row[1][0];
}

async function findByToken(token) {
  const querySessionSql = "SELECT * FROM sessao WHERE token = ?";
  const [row] = await pool.query(querySessionSql, [token]);

  return row[0];
}

async function destroyByUserId(userId) {
  const querySessionSql = "DELETE FROM sessao WHERE usuarioId = ?";
  const row = await pool.query(querySessionSql, [userId]);

  return row;
}

module.exports = {
  createByUserId,
  findByToken,
  destroyByUserId,
};
