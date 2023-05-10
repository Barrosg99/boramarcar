const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const usersController = require("./controllers/user");
const authenticate = require('./middleware/authenticate');

const app = express();
//Configuring express server

app.use(cors());
app.use(bodyparser.json());

//Establish the server connection
//PORT ENVIRONMENT VARIABLE

app
  .get('/pessoas' , usersController.getUsers)
  .post('/pessoas',usersController.signUpUser)
  // .put('/pessoas/:id', usersController.signUpOrEditUser)
  .delete('/pessoas/:id',usersController.removeUser);

app
  .post('/login',usersController.signInUser)
  .post('/sign-out',authenticate,usersController.signOut);
  

module.exports = app;