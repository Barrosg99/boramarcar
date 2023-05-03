const bcrypt = require('bcrypt');
const usersRepositories = require('../repositories/user');


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

async function signUpOrEditUser(req, res) {
  try {
    // if(await usersRepositories.findUserByEmail(user.email)) return res.status(409).send({ errors: 'Email already in use'});

    const users = await usersRepositories.createOrUpdateUser({id:req.params.id,...req.body});
    res.status(200).send(users);
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
      if (!user) return res.status(401).send({ error: "Wrong email or password" });

      const checkPassword = bcrypt.compareSync( userInfo.senha, user.senha_encript);
      if(!checkPassword) return res.status(401).send({ error: "Wrong email or password" });

      // const { token } = await sessionsRepositories.createByUserId(user.id);
      // const userData = getUser(user);
      res.send("Autenticado");

  } catch(e) {
      console.log(e);
      res.sendStatus(500);
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
  signUpOrEditUser,
  signInUser,
  removeUser
}