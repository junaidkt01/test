const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
openapi: "3.0.0",
info: {
title: "StudioFlow - Backend Node Server",
version: "1.0.0",
description: "Node Server to process business logic and MongoDB Communication",
          contact: {
            name: "Phloem Weddings",
            email: "hr@phloemweddings.com",
            url: "http://phloemweddings.com"
          },
},
};


const options = {
        swaggerDefinition,
                servers: [
                    { //Local Server
                        url: "http://localhost:3000/",
                        description: "Local server"
                    }
        ],
        apis: ["../app.js", "./routes/studioRoutes.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;