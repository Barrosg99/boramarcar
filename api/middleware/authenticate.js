const sessionsRepositories = require("../repositories/session");
const usersRepositories = require("../repositories/user");

const FIVE_HOURS = 5 * 60 * 60 * 1000;

async function authenticate(req, res, next) {
  if (!req.header("Authorization")) return res.status(401).send({ error: "Token não enviado" });
  if (!req.header("User-Type")) return res.status(401).send({ error: "User-Type não enviado" });

  const token = req.header("Authorization").split(" ")[1];
  const userType = req.header("User-Type");

  try {
    const session = await sessionsRepositories.findByToken(token);
    if (!session) return res.status(401).send({ error: "Token Inválido" });

    const sessionDate = new Date(session.criado_em);

    if (new Date() - sessionDate > FIVE_HOURS) {
      await sessionsRepositories.destroyByUserId(session.usuarioId);
      return res.status(401).send({ error: "Token expirado" });
    }

    let user;

    if (userType === "estabelecimento") {
      user = await usersRepositories.findEstablishmentBy("usuarioId", session.usuarioId);
    } else {
      user = await usersRepositories.findPersonByKey("usuarioId", session.usuarioId);
    }

    if (!user) return res.status(401).send({ error: "Usuário não existe" });
    user.userType = userType;
    req.user = user;
    return next();
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

module.exports = authenticate;
