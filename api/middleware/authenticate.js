const sessionsRepositories = require("../repositories/session");
const usersRepositories = require("../repositories/user");

async function authenticate(req, res, next) {
  if (!req.header("Authorization")) return res.sendStatus(401);

  const token = req.header("Authorization").split(" ")[1];

  try {
    const session = await sessionsRepositories.findByToken(token);
    if (!session) return res.status(401).send({ error: "Token Inválido" });

    const user = await usersRepositories.findUserBy("id", session.fk_Usuario_id);

    if (!user) return res.sendStatus(500);

    req.user = user;
    return next();
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

module.exports = authenticate;
