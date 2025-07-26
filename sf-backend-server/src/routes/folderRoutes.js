const express = require("express");
const folderRouter = express();

var folderService = require("../service/folderService.js")
var schemaValidator = require("../schema/folderSchemaValidator.js")
var uuidService = require("../utils/createUUID.js");
const { verifyToken } = require("../utils/jwtToken.js");

folderRouter.get("/findAllFolders", async (request, response) => {
    const results = await folderService.findAllFolders();
    response.json(results);
});

// folderRouter.post("/findByEvent/:eventId", async (request, response) => {
//     const eventId = request.params.eventId;

//     const results = await folderService.findByEvent(eventId);
//     response.json(results);
// });

folderRouter.get("/findByEvent/:eventId", async (request, response) => {
    console.log("folders")
    const eventId = request.params.eventId;

    const results = await folderService.findByEvent(eventId);
    response.json(results);
});

folderRouter.get("/findAnFolder/:folder_id", async (request, response) => {
    const folder_id = request.params.folder_id;
    const result = await folderService.getFolderById(folder_id);
    response.json(result);
});

// folderRouter.get("/getBasePath/:folder_id", async (request, response) => {
//     const folder_id = request.params.folder_id;
//     const result = await folderService.getFolderById(folder_id);
//     response.json(result);
// });

// folderRouter.post("/updateBasePath", async (request, response) => {
//     const folder = request.body;
//     const results = await folderService.updatebasePath(folder["folder_id"], folder["base_path"], folder["total_image_count"]);
//     response.json(results);
// });

folderRouter.post("/updateBasePath", async (request, response) => {
    const folder = request.body;
    const results = await folderService.updatebasePath(folder["folder_id"], folder["base_path"]);
    response.json(results);
});

folderRouter.post("/updateTotalNumber", async (request, response) => {
    const folder = request.body;
    const results = await folderService.updatetotalNumber(folder["folder_id"], folder["total_number_of_images"]);
    response.json(results);
});


folderRouter.post("/updateStudioSelectedCount", async (request, response) => {
    const folder = request.body;
    const results = await folderService.updateStudioSelectedCount(folder["folder_id"], folder["image_count"]);
    response.json(results);
});

//Update the folder Status...
//Need to 
folderRouter.post("/updateStatus/InProgress/:folderId", async (request, response) => {
    const folderId = request.params.folderId;
    const folderStatus = "In Progress"
    const results = await folderService.updateStatus(folderId, folderStatus);
    response.json(results);
});

folderRouter.post("/updateStatus/PreSortedFinished/:folderId", async (request, response) => {
    const folderId = request.params.folderId;
    const folderStatus = "PreSorted Finished" // completed
    const results = await folderService.updateStatus(folderId, folderStatus);
    //console.log("Folder results", results)
    response.json(results);
});

folderRouter.post("/updateStatus/UploadInProgress/:folderId", async (request, response) => {
    const folderId = request.params.folderId;
    const folderStatus = "Upload InProgress" //
    const results = await folderService.updateStatus(folderId, folderStatus);
    // console.log("Folder results", results)
    response.json(results);
});

folderRouter.post("/updateStatus/Uploaded/:folderId", async (request, response) => {
    const folderId = request.params.folderId;
    const folderStatus = "Uploaded"
    const results = await folderService.updateStatus(folderId, folderStatus);
    response.json(results);
});

// Folder Status ... 
//InProgress.. 
//PreSortedFinished
///uplaodInProgress
//Uploaded... 

// BASE path Update,,, 

//Event.
//In Progress
//Done


//Project
//InProgress.. FolderUploaded.. ReadyForClientSelection . 
//ClientSelectionInProgress, ClientSelected. 

//



folderRouter.post("/createFolder", async (request, response) => {
    console.log("Insert the create Folder.... ")
    try {
        folder = request.body;

        myVal = await schemaValidator.validateFolderSchema(folder)

        key = folder["folder_name"] + folder["event_id"]
        folderId = uuidService.getUUID(key);

        folder["folder_id"] = folderId

        const results = await folderService.insertFolder(folder);
        response.json(results);
    } catch (err) {
        response.status(400).send("Error while creating Folder." + err.message);
    }
});


module.exports = folderRouter;
