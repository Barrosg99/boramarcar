const pool = require("../database/DB_config");

async function createAddress({ logradouro, complemento, cep, municipio, estado }) {
  const insertAddressSql = `INSERT INTO endereco (Logradouro, Complemento, CEP, Municipio, Estado) 
  VALUES (?, ?, ?, ?, ?); SELECT LAST_INSERT_ID();`;
  const variables = [logradouro, complemento, cep, municipio, estado];
  const [row] = await pool.query(insertAddressSql, variables);
  return { addressId: row[1][0]["LAST_INSERT_ID()"] };
}

module.exports = {
  createAddress,
};
