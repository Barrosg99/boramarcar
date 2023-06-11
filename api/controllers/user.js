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
  const person = await usersRepositories.findPersonByKey("usuarioId", req.user.id);
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

    req.body.senha = bcrypt.hashSync(req.body.senha, 10);
    let person;
    const { file } = req;
    const { imageId } = await imageRepositories.createImage({ file });
    const { userId } = await usersRepositories.createUser({
      imageId,
      ...req.body,
    });
    try {
      person = await usersRepositories.createPerson({ userId, ...req.body });
    } catch (error) {
      usersRepositories.deleteUser(userId);
      imageRepositories.deleteImage(imageId);
      throw error;
    } finally {
      fs.rmSync(`${__dirname}/../static/temp/${file.filename}`);
    }

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

async function editUser(req, res) {
  if (req.user.email !== req.body.email && (await usersRepositories.findUserBy("email", req.body.email))) {
    return res.status(409).send({ error: "Email já está em uso" });
  }

  if (req.user.telefone !== req.body.telefone && (await usersRepositories.findUserBy("telefone", req.body.telefone))) {
    return res.status(409).send({ error: "Telefone já está em uso" });
  }

  if (req.user.cpf !== req.body.cpf && (await usersRepositories.findPersonByKey("cpf", req.body.cpf))) {
    return res.status(409).send({ error: "CPF já está em uso" });
  }

  if (req.body.senha) req.body.senha = bcrypt.hashSync(req.body.senha, 10);

  const { file } = req;

  if (file) {
    const { imageId } = await imageRepositories.createImage({ file });
    req.body.imageId = imageId;
    req.body.removeImageId = req.user.imagemId;
    fs.rmSync(`${__dirname}/../static/temp/${file.filename}`);
  }

  await usersRepositories.editUser({
    userId: req.user.usuarioId,
    ...req.body,
  });
  await usersRepositories.editPerson({ id: req.user.id, ...req.body });

  return res.status(200).send(req.user);
}

async function removeUser(req, res) {
  try {
    const { id } = req.user;
    await sessionsRepositories.destroyByUserId(id);
    await imageRepositories.deleteEventImages(id);
    await imageRepositories.deleteImage(req.user.imagemId);
    return res.sendStatus(200);
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
  editUser,
  removeUser,
  signOut,
};
