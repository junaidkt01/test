require('dotenv').config();
const { getDb } = require('../../config/databaseConnection.js');
const albumService = require('../../service/albumInfoService.js');
const pipeline  = require('../aggregateConstants.js');

const PROJECT_COLLECTION_NAME = process.env.PROJECT_COLLECTIONS;


async function findAlbumInfo(albumInfoId){
    const albumInfo = await albumService.findAblbumInfoById(albumInfoId);
    return albumInfo;
}

async function otpVerificationOfAlbum(album_id,otp) {
    const albumcheck = await albumService.otpVerification(album_id,otp);

    return albumcheck;
}
async function updateStatus(albumId,albumStatus) {
  const albumStatusUpdate = await albumService.updateStatus(albumId,albumStatus);
  return albumStatusUpdate;
  
}
async function fetchProjectInfo(albumInfo){
     try {
       const db = getDb();
       const projectDet =   { $match:  { project_id: albumInfo["projectid"] }  };
       var pipeline_projDetails = pipeline.ProjectInfoForUI;
       pipeline_projDetails.push(projectDet); 
      
       console.log(JSON.stringify(pipeline_projDetails))
   
       const projects = await db.collection(PROJECT_COLLECTION_NAME).aggregate(pipeline_projDetails).toArray();
      console.log(projects)
       return projects;
     } catch (err) {
       console.error('DB error:', err);
     }
}

module.exports = {  findAlbumInfo,otpVerificationOfAlbum, fetchProjectInfo,updateStatus };