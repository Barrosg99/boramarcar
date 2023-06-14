const adminRepositories = require("../repositories/admin");
const usersRepositories = require("../repositories/user");

async function authenticateAdmin(req, res, next) {
  if (!req.header("Authorization")) return res.status(401).send({ error: "Token não enviado" });
  if (!req.header("from")) return res.status(401).send({ error: "Ambiente não autorizado" });
  if (req.header("from") !== "admin") return res.status(401).send({ error: "Ambiente não autorizado" });

  const token = req.header("Authorization").split(" ")[1];

  try {
    const sessionAdmin = await adminRepositories.findByToken(token);
    if (!sessionAdmin) return res.status(401).send({ error: "Token Inválido" });

    let user;

    if (req.url.includes("pessoas")) {
      user = await usersRepositories.findPersonBy("usuarioId", req.params.id);
    } else if (req.url.includes("estabelecimento")) {
      user = await usersRepositories.findEstablishmentBy("usuarioId", req.params.id);
    }

    if (req.params.id && !user) return res.status(401).send({ error: "Usuário não existe" });

    req.user = user;
    return next();
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

module.exports = authenticateAdmin;
