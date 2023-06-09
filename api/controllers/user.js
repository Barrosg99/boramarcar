const bcrypt = require("bcrypt");
const fs = require("fs");

const usersRepositories = require("../repositories/user");
const sessionsRepositories = require("../repositories/session");
const imageRepositories = require("../repositories/image");

function getUser(userData) {
  const { id, nome, email } = userData;

  return {
    id,
    nome,
    email,
  };
}

async function getUsers(req, res) {
  // const user = req.body;

  // const { error } = userSchemas.signUp.validate(user);
  // if (error) return res.status(422).send({ errors: error.details[0].message });

  try {
    // if (await usersRepositories.findUserByEmail(user.email)) {
    //   return res.status(409).send({ errors: "Email already in use" });
    // }

    const users = await usersRepositories.findUsers();
    return res.status(200).send(users);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function getPerson(req, res) {
  const person = await usersRepositories.findPersonByKey("fk_Usuario_id", req.user.id);
  delete person.senha;
  return res.status(200).send(person);
}

async function signUpUser(req, res) {
  try {
    if (await usersRepositories.findUserBy("email", req.body.email)) {
      return res.status(409).send({ error: "Email já está em uso" });
    }

    if (await usersRepositories.findUserBy("telefone", req.body.telefone)) {
      return res.status(409).send({ error: "Telefone já está em uso" });
    }

    if (await usersRepositories.findPersonByKey("cpf", req.body.cpf)) {
      return res.status(409).send({ error: "CPF já está em uso" });
    }

    const { file } = req;
    const { imageId } = await imageRepositories.createImage({ file });
    const { userId } = await usersRepositories.createUser({
      imageId,
      ...req.body,
    });
    const person = await usersRepositories.createPerson({ userId, ...req.body });
    fs.rmSync(`${__dirname}/../static/temp/${file.filename}`);
    return res.status(200).send(person);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e.message });
  }
}

async function signInUser(req, res) {
  try {
    const userInfo = req.body;
    const user = await usersRepositories.findUserBy("email", userInfo.email);
    if (!user) return res.status(401).send({ error: "Email ou senha incorretos" });

    const checkPassword = bcrypt.compareSync(userInfo.senha, user.senha);
    if (!checkPassword) return res.status(401).send({ error: "Email ou senha incorretos" });

    const { token } = await sessionsRepositories.createByUserId(user.id);
    const userData = getUser(user);

    const response = { ...userData, token };

    return res.status(200).send(response);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function signOut(req, res) {
  try {
    const userId = `${req.user.id}`;
    await sessionsRepositories.destroyByUserId(userId);
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function removeUser(req, res) {
  try {
    const user = await usersRepositories.deleteUser({ id: req.params.id });
    return res.status(200).send(user);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

module.exports = {
  getUsers,
  getPerson,
  signUpUser,
  signInUser,
  removeUser,
  signOut,
};
