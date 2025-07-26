const express = require("express");
const studioRouter = express();

var uuidService = require("../utils/createUUID.js")
var studioDetails = require("../service/studioService.js")
var studioValidator = require("../schema/studioSchemaValidator.js");
const { sendOtpEmail } = require("../mailService.js");
const { getDb } = require("../config/databaseConnection.js");

studioRouter.get("/findAllStudios", async (request, response) => {
  try {
    const results = await studioDetails.findAllStudios();
    response.json(results);
  } catch (err) {
    res.status(400).send("Error while fetching all the Studios." + err.message);
  }

});


studioRouter.post("/validateLogin", async (request, response) => {
  try {
    studio = request.body;

    console.log("Request.. ." + JSON.stringify(studio));

    const results = await studioDetails.validateLogin(studio);
    response.json(results);
  } catch (err) {
    request.status(400).send("Error while fetching all the Studios." + err.message);
  }

});

studioRouter.post("/checkForFolderStatus", async (request, response) => {
  try {
    studio = request.body;

    console.log("Request.. ." + JSON.stringify(studio));

    const results = await studioDetails.checkForFolderStatus(studio);
    response.json(results);
  } catch (err) {
    request.status(400).send("Error while fetching all the Studios." + err.message);
  }
});

// studioRouter.post("/createStudio", async (request, response) => {
//   console.log("Insert the create Studio.... ")
//   try {
//     studio = request.body;
//     //Validate the Schema...

//     myVal = await studioValidator.validateStudioSchema(studio)

//     busEmail = studio["businessEmail"]
//     studioId = uuidService.getUUID(busEmail);

//     studio["studio_id"] = studioId

//     studio["status"] = "Pending"
//     studio["otp"] = "" + Math.floor(1000 + Math.random() * 9000)
//     studio["started_on"] = new Date();

//     const results = await studioDetails.insertStudio(studio);
//     response.json(results);
//   } catch (err) {
//     response.status(400).send("Error while creating Studio." + err.message);
//   }
// });


studioRouter.post("/createStudio", async (request, response) => {
  console.log("Insert the create Studio.... ");
  try {
    let studio = request.body;

    // Validate the Schema
    const myVal = await studioValidator.validateStudioSchema(studio);

    const busEmail = studio["businessEmail"];
    const studioId = uuidService.getUUID(busEmail);

    studio["studio_id"] = studioId;
    studio["status"] = "Pending";
    studio["otp"] = "" + Math.floor(1000 + Math.random() * 9000);
    studio["started_on"] = new Date();

    // Insert into DB
    const results = await studioDetails.insertStudio(studio);

    // Send OTP Email
    await sendOtpEmail(busEmail, studio["otp"], studioId);

    // Respond back
    response.json({
      message: "Studio created successfully. OTP has been sent to your email.",
      studio_id: studioId
    });

  } catch (err) {
    console.error("Error while creating Studio:", err);
    response.status(400).send("Error while creating Studio. " + err.message);
  }
});


studioRouter.post("/verifyOtp", async (req, res) => {
  try {
    const result = await studioDetails.validateOtp(req.body); // expects { studio_id, otp }
    res.json(result);
  } catch (err) {
    res.status(400).send("Error verifying OTP: " + err.message);
  }
});

studioRouter.post("/resendOtp", async (req, res) => {
  try {
    const { studio_id, businessEmail } = req.body;

    if (!studio_id || !businessEmail) {
      return res.status(400).send("studio_id and businessEmail are required.");
    }

    const result = await studioDetails.resendOtp(studio_id, businessEmail);
    res.json(result);
  } catch (err) {
    res.status(400).send("Error resending OTP: " + err.message);
  }
});


// studioRouter.post("/resendOtp", async (req, res) => {
//   try {
//     const { studio_id } = req.body;
//     const result = await studioDetails.resendOtp(studio_id);
//     res.json(result);
//   } catch (err) {
//     res.status(400).send("Error resending OTP: " + err.message);
//   }
// });

module.exports = studioRouter;
