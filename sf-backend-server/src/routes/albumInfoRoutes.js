const express = require("express");
const albumInfoRouter = express();

var albumService = require("../service/albumInfoService.js")
var schemaValidator = require("../schema/eventSchemaValidator.js")
var uuidService = require("../utils/createUUID.js")



albumInfoRouter.post("/createClientAlbumInfo", async (request, response) => {
    try {
        albumInfo = request.body;

        console.log("Request.. ." + JSON.stringify(albumInfo));

        email = albumInfo["client_email"];
        phone = albumInfo["client_phone"];
        projectId = albumInfo["project_id"];

        albumId = uuidService.getUUID(email + phone + projectId);

        albumInfo["album_id"] = albumId;
        albumInfo["album_url"] = "BASE_URL" + "/" + albumId
        albumInfo["status"] = "Ready For Client Selection"
        albumInfo["pin"] = "" + Math.floor(1000 + Math.random() * 9000)

        const results = await albumService.createClientAlbumInfo(albumInfo);
        response.json(results);
    } catch (err) {
        request.status(400).send("Error while fetching all the Studios." + err.message);
    }

});

// albumInfoRouter.get("/findByProject/:projectId", async (request, response) => {

//     const projectId = request.params.projectId;

//     const results = await albumService.findByProject(projectId);
//     response.json(results);
// });

albumInfoRouter.get("/albumDetails/:albumId", async (request, response) => {
    const albumId = request.params.albumId;

    const results = await albumService.findByProject(albumId);
    response.json(results);
});


module.exports = albumInfoRouter;