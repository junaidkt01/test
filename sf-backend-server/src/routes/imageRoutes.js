const express = require("express");
const imageRouter = express();

var iamgeService = require("../service/imageService.js")
var schemaValidator = require("../schema/imageSchemaValidator.js")
var uuidService = require("../utils/createUUID.js")

imageRouter.post("/updateSelectedImages", async (request, response) => {
    const imageList = request.body.selected_items;
    console.log("the selected imghes: ",imageList)
    results = await iamgeService.updateClientSelectedImages(imageList);
    response.json(results);
});

imageRouter.post("/favSelectImageCount", async (request, response) => {
    const albumInfo = request.body;
 
    selectedCount   = await iamgeService.getSelectedCount(albumInfo);
    favouriteCount  = await iamgeService.getFavouriteCount(albumInfo);
    
    response.json([selectedCount, favouriteCount]);

});

imageRouter.post("/updateFavouriteImages", async (request, response) => {
    const imageList = request.body.favorite_items;
    console.log("the favorite imghes: ",imageList)
    results = await iamgeService.updateClientFavouriteImages(imageList);
    response.json(results);
});	


imageRouter.get("/findAllImages", async (request, response) => {
    const results = await iamgeService.findAllImages();
    response.json(results);
});

imageRouter.post("/findByFolderAndAlbum/:folderId/:albumId", async (request, response) => {

    const folderId = request.params.folderId;
    const albumId = request.params.albumId;

    const results = await iamgeService.findByFolderAndAlbumId(folderId, albumId);
    response.json(results);
});

imageRouter.post("/findByFolder/:folderId", async (request, response) => {

    const folderId = request.params.folderId;

    const results = await iamgeService.findByFolder(folderId);
    response.json(results);
});

imageRouter.post("/createImage", async (request, response) => {
    console.log("Insert the create Image.... ")
    try{
        image = request.body;
 
        myVal = await schemaValidator.validateImageSchema(image)

        //key = image["relative_path"] + image["folder_id"]
        // imageId = uuidService.getUUID(key); 
        // image["image_id"] = imageId
        //Need to have a lambda function to validate the image info .esp UUID

        const results = await iamgeService.insertImage(image);
        response.json(results);
    }  catch (err) {
    response.status(400).send("Error while creating Image." + err.message);
  }
});

imageRouter.post("/clientSelectedImages", async (request, response) => {

    try{
        imgAlbum = request.body;
        console.log(imgAlbum);
        const results = await iamgeService.clientSelectedImages(imgAlbum);
        console.log("results : ",results);
        response.json(results);
    }catch (err) {
    response.status(400).send("Error while creating Image." + err.message);
  }



});

imageRouter.post("/countByProject/:project_id", async (request, response) => {

    const project_id = request.params.project_id;

    const results = await iamgeService.findByProject(project_id);
    console.log()
    response.json(results);
});



module.exports = imageRouter;
