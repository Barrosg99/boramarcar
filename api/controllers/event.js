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
    res.status(200).send(events);
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
    const { horario, nome, publico, imageUrl } = req.body;

    // const existingEvent = await eventsRepositories.getEventById(eventId);
    // if (!existingEvent) {
    //   return res.status(404).send(`Event with ID ${eventId} not found`);
    // }

    const updatedEvent = await eventsRepositories.updateEvent({
      id: eventId,
      horario,
      nome,
      publico,
      imageUrl,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function removeEvent(req, res) {
  try {
    await eventsRepositories.deleteEvent(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  removeEvent,
};
