const express = require("express");
const apiRouter = express();


var apiService = require("../../service/ui/apiervice.js");
const { response, request } = require("../albumInfoRoutes.js");
const { generateToken, authMiddleware } = require("../../utils/jwtToken.js");


const logger = require("../../logger.js");

apiRouter.get("/dummy", async (request, response) => {
    const albumInfoId = request.params.albumInfoId;
    
    logger.info("Inside Dummy....");
  
    const results = await apiService.findAlbumInfo(albumInfoId);

    logEntry = {"albumid": albumInfoId, "result": results};

    logger.debug(logEntry);
    response.json(results);
});


apiRouter.get("/album/:albumInfoId", async (request, response) => {
    const albumInfoId = request.params.albumInfoId;

    const results = await apiService.findAlbumInfo(albumInfoId);

    response.json(results);
});


apiRouter.post("/album/projectDetails",authMiddleware, async (request, response) => {
    const albumInfo = request.body;
    console.log(albumInfo)
    const results = await apiService.fetchProjectInfo(albumInfo);
    console.log(results)
    response.json(results);
});

apiRouter.get("/album/updateStatus/:albumid",async(request,response) =>{
  const albumId = request.params.albumid;
  const albumStatus = "Client Selection Completed"
  const results = await apiService.updateStatus(albumId,albumStatus);
  response.json(results);
})

apiRouter.post("/album/optverification",async (request ,response) =>{
     const { album_id, otp } = request.body;

    try {
    const result = await apiService.otpVerificationOfAlbum(album_id, otp);
    // console.log("Result from apiRoutes : ",result)
    response.json(result)
    // if (isValid) {
    //   response.json({ success: true });
    // } else {
    //   response.json({ success: false, message: "Invalid OTP or album ID" });
    // }
  } catch (error) {
    console.error("OTP verification error:", error.message);
    response.status(400).json({ success: false, message: error.message });
  }
});

// apiRouter.post("/album/tokenverification",authMiddleware,(request,response)=>{
//   response.json({
//     message:"Access granded to protected route",
//     user:request.user,
//   });
// });



module.exports = apiRouter;