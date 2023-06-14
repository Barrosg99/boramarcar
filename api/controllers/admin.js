const { v4: uuidv4 } = require("uuid");
const { createSession } = require("../repositories/admin");

async function signInAdmin(req, res) {
  try {
    const { username, password } = req.body;

    if (username === process.env.USER && password === process.env.PASSWORD) {
      const token = await createSession(uuidv4());
      return res.send({ token });
    }

    return res.status(401).send({ error: "Você não tem permissão para acessar o admin" });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

module.exports = { signInAdmin };
