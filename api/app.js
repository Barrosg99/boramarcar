const express = require("express");
const cors = require("cors");

const usersController = require("./controllers/user");
const eventsController = require("./controllers/event");
const imagesController = require("./controllers/image");
const adminController = require("./controllers/admin");

const authenticate = require("./middleware/authenticate");
const authenticateAdmin = require("./middleware/authenticateAdmin");
const upload = require("./middleware/upload");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app
  .get("/pessoas", usersController.getUsers)
  .get("/pessoas/eu", authenticate, usersController.getPerson)
  .post("/pessoas", upload.single("file"), usersController.signUpUser)
  .put("/pessoas/eu", authenticate, upload.single("file"), usersController.editUser)
  .delete("/pessoas/eu", authenticate, usersController.removeUser);

app
  .post("/estabelecimento", upload.single("file"), (req, res) => usersController.signUpUser(req, res, "estabelecimento"))
  .put("/estabelecimento/eu", authenticate, upload.single("file"), usersController.editUser)
  .get("/estabelecimento/eu", authenticate, usersController.getEstablishment)
  .delete("/estabelecimento/eu", authenticate, usersController.removeUser);

app.post("/login", usersController.signInUser).post("/sign-out", authenticate, usersController.signOutUser);

app.get("/imagens/:id", imagesController.getImage);

app
  .post("/eventos", authenticate, upload.single("file"), eventsController.createEvent)
  .get("/eventos", eventsController.getEvents)
  .get("/eventos/:id", authenticate, eventsController.getEvent)
  .put("/eventos/:id", authenticate, upload.single("file"), eventsController.updateEvent)
  .delete("/eventos/:id", authenticate, eventsController.removeEvent)
  .post("/eventos/marcar", authenticate, eventsController.attendEvent)
  .get("/eventos/:id/presentes", authenticate, eventsController.getEventAttendants);

app
  .post("/admin", adminController.signInAdmin)
  .get("/admin/pessoas", authenticateAdmin, adminController.getPeople)
  .get("/admin/pessoas/:id", authenticateAdmin, adminController.getPerson)
  .put("/admin/pessoas/:id", authenticateAdmin, adminController.editPerson)
  .delete("/admin/pessoas/:id", authenticateAdmin, adminController.deleteUser)

  .get("/admin/estabelecimento", authenticateAdmin, adminController.getEstablishments)
  .get("/admin/estabelecimento/:id", authenticateAdmin, adminController.getEstablishment)
  .put("/admin/estabelecimento/:id", authenticateAdmin, adminController.editEstablishment)
  .delete("/admin/estabelecimento/:id", authenticateAdmin, adminController.deleteUser)

  .get("/admin/eventos", authenticateAdmin, adminController.getEvents)
  .get("/admin/eventos/:id", authenticateAdmin, adminController.getEvent)
  .put("/admin/eventos/:id", authenticateAdmin, adminController.editEvent)
  .delete("/admin/eventos/:id", authenticateAdmin, adminController.deleteEvent);

module.exports = app;
