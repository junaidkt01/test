const express = require("express");
const eventRouter = express();

var eventService = require("../service/eventService.js")
var schemaValidator = require("../schema/eventSchemaValidator.js")
var uuidService = require("../utils/createUUID.js")


eventRouter.get("/findAllEvents", async (request, response) => {
    const results = await eventService.findAllEvents();
    response.json(results);
});

eventRouter.post("/updateStatus/InProgress/:eventId", async (request, response) => {
    const eventId = request.params.eventId;
    const eventStatus = "In Progress" // pending
    const results = await eventService.updateStatus(eventId, eventStatus);
    response.json(results);
});

eventRouter.post("/updateStatus/Done/:eventId", async (request, response) => {
    const eventId = request.params.eventId;
    const eventStatus = "Done" // completed
    const results = await eventService.updateStatus(eventId, eventStatus);
    response.json(results);
});


eventRouter.get("/findByProject/:projectId", async (request, response) => {
    const projectId = request.params.projectId;

    const results = await eventService.findByProject(projectId);
    response.json(results);
});

eventRouter.get("/findAnEvent/:eventId", async (request, response) => {
    const eventId = request.params.eventId;

    const results = await eventService.findAnEvent(eventId);
    response.json(results);
});


eventRouter.post("/createEvent", async (request, response) => {
    console.log("Insert the create Event.... ")
    try {
        projEvent = request.body;
        console.log('ProjEvent ', projEvent)
        myVal = await schemaValidator.validateEventSchema(projEvent)

        key = projEvent["event_name"] + projEvent["project_id"]
        eventId = uuidService.getUUID(key);

        projEvent["event_id"] = eventId

        const results = await eventService.insertEvent(projEvent);
        response.json(results);
    } catch (err) {
        response.status(400).send("Error while creating Event." + err.message);
    }
});



module.exports = eventRouter;
