const fs = require("fs");

const eventsRepositories = require("../repositories/event");
const imageRepositories = require("../repositories/image");
const addressRepositories = require("../repositories/address");

async function getEvents(req, res) {
  const { eventosMarcados, id, meusEventos } = req.query;
  try {
    const events = await eventsRepositories.findEvents({
      userId: id,
      eventosMarcados,
      meusEventos,
    });
    if (id) {
      for (const event of events) {
        const attendance = await eventsRepositories.getPersonEvent({
          userId: id,
          eventId: event.id,
        });
        event.presente = !!(attendance && !!attendance.presente);
      }
    }
    res.status(200).send(events);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function getEvent(req, res) {
  try {
    const event = await eventsRepositories.findEventById(req.params.id);
    const attendance = await eventsRepositories.getPersonEvent({
      userId: req.user.usuarioId,
      eventId: req.params.id,
    });
    const meuEvento = event.usuarioId === req.user.usuarioId;
    res.status(200).send({ meuEvento, presente: attendance && !!attendance.presente, ...event });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function createEvent(req, res) {
  try {
    const { file } = req;
    const { id, userType } = req.user;
    let addressId;
    if (userType === "estabelecimento") {
      addressId = req.user.enderecoId;
    } else {
      const { addressId: id } = await addressRepositories.createAddress({ ...req.body });
      addressId = id;
    }

    const { imageId } = await imageRepositories.createImage({ file });

    const events = await eventsRepositories.createEvent({
      addressId,
      imageId,
      userId: id,
      ...req.body,
    });
    fs.rmSync(`${__dirname}/../static/temp/${file.filename}`);
    res.status(200).send(events);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function updateEvent(req, res) {
  try {
    const eventId = req.params.id;
    const { file } = req;

    if (file) {
      const { imageId } = await imageRepositories.createImage({ file });
      req.body.imageId = imageId;
      fs.rmSync(`${__dirname}/../static/temp/${file.filename}`);
    }

    await eventsRepositories.updateEvent({
      id: eventId,
      ...req.body,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function removeEvent(req, res) {
  try {
    const { imagemId } = await eventsRepositories.findEventById(req.params.id);
    await eventsRepositories.deleteEvent(req.params.id);
    await imageRepositories.deleteImage(imagemId);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function attendEvent(req, res) {
  try {
    const { comparece, eventoId } = req.body;
    const userId = req.user.id;
    let presente;
    const personEvent = await eventsRepositories.getPersonEvent({
      userId,
      eventId: eventoId,
    });
    if (!personEvent) {
      await eventsRepositories.createPersonEvent({ userId, eventId: eventoId });
      presente = true;
    } else {
      const { presente: p } = await eventsRepositories.toggleAttendanceEvent({
        userId,
        eventId: eventoId,
        comparece,
      });
      presente = p;
    }
    res.status(200).send({ presente: !!presente });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function getEventAttendants(req, res) {
  const persons = await eventsRepositories.getEventPersons({ eventId: req.params.id });
  res.send(persons);
}

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  removeEvent,
  attendEvent,
  getEventAttendants,
};
