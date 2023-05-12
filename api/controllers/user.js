const bcrypt = require('bcrypt');
const usersRepositories = require('../repositories/user');
const sessionsRepositories = require('../repositories/session');


async function getUsers(req, res) {
  // const user = req.body;

  // const { error } = userSchemas.signUp.validate(user);
  // if (error) return res.status(422).send({ errors: error.details[0].message });

  try {
    // if(await usersRepositories.findUserByEmail(user.email)) return res.status(409).send({ errors: 'Email already in use'});

    const users = await usersRepositories.findUsers();
    res.status(200).send(users);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }   
}

async function signUpUser(req, res) {
  try {
    // if(await usersRepositories.findUserByEmail(user.email)) return res.status(409).send({ errors: 'Email already in use'});

    const { userId } = await usersRepositories.createUser({id:req.params.id,...req.body});
    const person = await usersRepositories.createPerson({ userId,...req.body })
    res.status(200).send(person);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }  
}

async function signInUser(req, res) {
  const userInfo = req.body;

  // const { error } = userSchemas.signIn.validate(userInfo);
  // if (error) return res.status(422).send({ errors: error.details[0].message });

  try {
    const user = await usersRepositories.findUserByEmail(userInfo.email);
    if (!user) return res.status(401).send({ error: "Email ou senha incorretos" });

    const checkPassword = bcrypt.compareSync( userInfo.senha, user.Senha);
    if(!checkPassword) return res.status(401).send({ error: "Email ou senha incorretos" });

    const { token } = await sessionsRepositories.createByUserId(user.id);
    const userData = getUser(user);
  
    res.send({ ...userData, token });

  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function signOut(req, res) {
  try {
      const userId = `${req.user.id}`
      await sessionsRepositories.destroyByUserId(userId);
      res.sendStatus(200)
  } catch(e) {
      console.log(e);
      res.sendStatus(500);
  }
}

function getUser(userData) {
  const { id, Nome_Razao_Social, Email } = userData;
  
  return {
      id,
      Nome_Razao_Social,
      Email
  }
}

async function removeUser(req,res) {
  try {
    const user = await usersRepositories.deleteUser({id:req.params.id});
    res.status(200).send(user);
  } catch (error) {
    console.log(e);
    res.sendStatus(500);
  }
}

module.exports = {
  getUsers,
  signUpUser,
  signInUser,
  removeUser,
  signOut
}