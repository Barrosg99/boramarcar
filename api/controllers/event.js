const eventsRepositories = require('../repositories/event');

async function getEvents(req, res) { 
    try { 
      const events = await eventsRepositories.findEvents(req.body);
      res.status(200).send(events);
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
    }   
  }

  async function createEvent(req, res) { 
    try { 
      const {addressId} = await eventsRepositories.createAddress({...req.body})
      const events = await eventsRepositories.createEvent({addressId, userId:req.user.id, ...req.body});
      res.status(200).send(events);
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
    }   
  }
  
  async function updateEvent(req, res) {
    try {
      const eventId = req.params.id;
      const { horario, nome, publico, url_imagem} = req.body;
  
      // const existingEvent = await eventsRepositories.getEventById(eventId);
      // if (!existingEvent) {
      //   return res.status(404).send(`Event with ID ${eventId} not found`);
      // }
  
      const updatedEvent = await eventsRepositories.updateEvent({
        id: eventId,
        horario,
        nome,
        publico,
        url_imagem
      });
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  async function removeEvent(req,res) {
    try {
      const events = await eventsRepositories.deleteEvent({id:req.params.id});
      res.status(200).send(events);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    removeEvent
  }