require('dotenv').config();

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger.js");

const cors = require('cors');

const express = require("express"); 
const studioRoute = require("./src/routes/studioRoutes.js");
const projectRoute = require("./src/routes/projectRoutes.js");
const eventRoute = require("./src/routes/eventRoutes.js");
const folderRoute = require("./src/routes/folderRoutes.js");
const imageRoute = require("./src/routes/imageRoutes.js");
const albumRoute = require("./src/routes/albumInfoRoutes.js");

const apiRoute = require("./src/routes/ui/apiRoutes.js");

const { connectToMongo } = require('./src/config/databaseConnection.js');

//import logger from "./src/logger.js";


const app = express();
const port = process.env.PORT;

// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec)); 
      // Documentation in JSON format
app.get("/docs.json", (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
      });

app.use(cors()); // Enable CORS
app.use(express.json());// For parsing JSON request bodies

app.use("/studio",  studioRoute);
app.use("/events",  eventRoute);
app.use("/project", projectRoute);
app.use("/folder",  folderRoute);
app.use("/image",   imageRoute);
app.use("/album",   albumRoute);

app.use("/api",   apiRoute);

app.get('/', function (request, response){

  /*
    logger.fatal('fatal!');
    logger.trace('trace!');
    logger.error('error!');
    logger.warn('warn!');
    logger.info('info!');
    logger.debug('debug!');
    logger.trace('trace!');
 */
    response.send("Hello Davis.....")
})


 


async function startServer() {
    await connectToMongo(); // Initialize pool and DB connection
    app.listen(port, () => {
      console.info(`Server running on http://localhost:${port}`);
    });
  }
  
  startServer();