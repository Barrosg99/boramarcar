const express = require("express");
const cors = require("cors");

const usersController = require("./controllers/user");
const eventsController = require("./controllers/event");
const imagesController = require("./controllers/image");

const authenticate = require("./middleware/authenticate");
const upload = require("./middleware/upload");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app
  .get("/pessoas", usersController.getUsers)
  .post("/pessoas", upload.single("file"), usersController.signUpUser)
  // .put('/pessoas/:id', usersController.signUpOrEditUser)
  .delete("/pessoas/:id", usersController.removeUser);

app.post("/login", usersController.signInUser).post("/sign-out", authenticate, usersController.signOut);

app.get("/imagens/:id", imagesController.getImage);

app
  .post("/eventos", authenticate, upload.single("file"), eventsController.createEvent)
  .get("/eventos", eventsController.getEvents)
  .delete("/eventos/:id", authenticate, eventsController.removeEvent)
  .put("/eventos/:id", authenticate, eventsController.updateEvent);

module.exports = app;
