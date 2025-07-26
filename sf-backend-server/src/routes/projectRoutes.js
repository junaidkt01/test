const express = require("express");
const projectRouter = express();

var projectService = require("../service/projectService.js")

var uuidService = require("../utils/createUUID.js")
var schemaValidator = require("../schema/projectSchemaValidator.js")

//var jwtTokenValidation = require("../utils/jwtToken.js")

projectRouter.get("/findAllProject", async (request, response) => {
    const results = await projectService.findAllProjects();
    response.json(results);
});


projectRouter.get("/findByStudio/:studioId", async (request, response) => {

    const studioId = request.params.studioId;

    const results = await projectService.findByStudio(studioId);
    response.json(results);
});


projectRouter.get("/projectDetails/:projectId", async (request, response) => {
    const projectId = request.params.projectId;
    const results = await projectService.projectDetails(projectId);
    console.log("results: ", results)
    response.json(results);
});

projectRouter.post("/createProject", async (request, response) => {
    console.log("Insert the create Project.... ")

    console.log("Inserted Data " + JSON.stringify(request.studioInfo));

    try {
        project = request.body;

        myVal = await schemaValidator.validateProjectSchema(project)

        nameProj = project["project_name"] + project["created_on"]
        projectId = uuidService.getUUID(nameProj);

        project["project_id"] = projectId

        console.log(project)
        const results = await projectService.insertProject(project);
        response.json(results);
    } catch (err) {
        response.status(400).send("Error while creating Project." + err.message);
    }
});

projectRouter.post("/updateStatus/InProgress/:projectId", async (request, response) => {
    const projectId = request.params.projectId;
    const projectStatus = "In Progress"
    const results = await projectService.updateStatus(projectId, projectStatus);
    response.json(results);
});

projectRouter.post("/updateStatus/FolderUploaded/:projectId", async (request, response) => {
    const projectId = request.params.projectId;
    const projectStatus = "Folder Uploaded"
    const results = await projectService.updateStatus(projectId, projectStatus);
    response.json(results);
});

projectRouter.post("/updateStatus/ReadyClientSelection/:projectId", async (request, response) => {
    const projectId = request.params.projectId;
    const projectStatus = "Ready For Client Selection"
    const results = await projectService.updateStatus(projectId, projectStatus);
    response.json(results);
});

projectRouter.post("/updateStatus/ClientSelectionInProgress/:projectId", async (request, response) => {
    const projectId = request.params.projectId;
    const projectStatus = "Client Selection InProgress"
    const results = await projectService.updateStatus(projectId, projectStatus);
    response.json(results);
});

projectRouter.post("/updateStatus/ClientSelected/:projectId", async (request, response) => {
    const projectId = request.params.projectId;
    const projectStatus = "Client Selected"
    const results = await projectService.updateStatus(projectId, projectStatus);
    response.json(results);
});




module.exports = projectRouter;
