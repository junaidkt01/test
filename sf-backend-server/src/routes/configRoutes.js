const express = require("express");
const configRouter = express();

var jwtTokenValidation = require("../utils/jwtToken.js")

var configService = require("../service/configService.js");
var schemaValidator = require("../schema/configSchemaValidator.js");   


configRouter.post("/bucketInfo", async (request, response) => {

    console.log("Fetching all configurations..."); 

    const config = request.body;
    console.log("Request body: ", config);  
    
    const results = await configService.bucketInfo(config);
    response.json(results);
});
