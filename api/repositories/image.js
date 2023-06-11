const fs = require("fs");

const pool = require("../database/DB_config");

async function createImage({ file }) {
  if (!file) throw new Error("Error ao receber arquivo, verifique o envio");
  const tipo = file.mimetype;
  const nome = file.originalname;
  const arquivo = fs.readFileSync(`${__dirname}/../static/temp/${file.filename}`);
  const insertImageSql = `INSERT INTO imagem (nome,tipo,arquivo) 
  VALUES (?, ?, ?); SELECT LAST_INSERT_ID();`;
  const variables = [nome, tipo, arquivo];
  const [row] = await pool.query(insertImageSql, variables);
  return { imageId: row[1][0]["LAST_INSERT_ID()"] };
}

async function findImageById(id) {
  const [rows] = await pool.query("SELECT * FROM imagem WHERE id = ?", [id]);
  return rows[0];
}

async function deleteImage(id) {
  const row = await pool.query("DELETE FROM imagem WHERE id = ?", [id]);
  return row;
}

module.exports = {
  createImage,
  findImageById,
  deleteImage,
};
