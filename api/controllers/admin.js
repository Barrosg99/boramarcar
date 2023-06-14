const { v4: uuidv4 } = require("uuid");
const { createSession } = require("../repositories/admin");
const { findPeople, findPersonBy, findUserBy, editUser, editPerson: userEditPerson } = require("../repositories/user");
const { removeUser } = require("./user");

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

async function getPeople(req, res) {
  try {
    const people = await findPeople();
    return res.send(people);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function getPerson(req, res) {
  try {
    const person = await findPersonBy("usuarioId", req.params.id);
    delete person.senha;
    return res.status(200).send(person);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function editPerson(req, res) {
  try {
    if (req.user.email !== req.body.email && (await findUserBy("email", req.body.email))) {
      return res.status(409).send({ error: "Email já está em uso" });
    }

    if (req.user.telefone !== req.body.telefone && (await findUserBy("telefone", req.body.telefone))) {
      return res.status(409).send({ error: "Telefone já está em uso" });
    }

    if (req.user.cpf !== req.body.cpf && (await findPersonBy("cpf", req.body.cpf))) {
      return res.status(409).send({ error: "CPF já está em uso" });
    }

    await editUser({
      userId: req.params.id,
      ...req.body,
    });

    await userEditPerson({ id: req.params.id, ...req.body });

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function deletePerson(req, res) {
  try {
    return await removeUser(req, res);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

module.exports = { signInAdmin, getPeople, getPerson, editPerson, deletePerson };
