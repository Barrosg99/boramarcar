const fs = require("fs");

const eventsRepositories = require("../repositories/event");
const imageRepositories = require("../repositories/image");

async function getEvents(req, res) {
  try {
    const events = await eventsRepositories.findEvents(req.body);
    res.status(200).send(events);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function createEvent(req, res) {
  try {
    const { file } = req;
    const { imageId } = await imageRepositories.createImage({ file });
    const { addressId } = await eventsRepositories.createAddress({ ...req.body });
    const events = await eventsRepositories.createEvent({
      addressId,
      imageId,
      userId: req.user.id,
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
    const events = await eventsRepositories.deleteEvent({ id: req.params.id });
    res.status(200).send(events);
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
