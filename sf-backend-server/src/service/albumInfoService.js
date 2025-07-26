require('dotenv').config();
const { getDb } = require('../config/databaseConnection.js');
const { generateToken, verifyToken } = require("../utils/jwtToken.js")
const COLLECTION_NAME = process.env.ALBUM_INFO_COLLECTIONS;

async function createClientAlbumInfo(albumInfo) {

  try {
    const db = getDb();
    const ablumInfo = await db.collection(COLLECTION_NAME).insertOne(albumInfo);
    return ablumInfo;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function findByProject(projectId) {
  query = { "project_id": projectId };
  try {
    const db = getDb();
    console.log("QUery ", query)
    const albums = await db.collection(COLLECTION_NAME).find(query).toArray();
    return albums;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function findAblbumInfoById(ablumInfoId) {
  query = { "album_id": ablumInfoId }
  const projection = { client_email: 1, project_id: 1, album_id: 1, status: 1 };
  try {
    const db = getDb();
    const albumInfo = await db.collection(COLLECTION_NAME).find(query, { projection }).toArray();
    console.log("albumInfo .. ", albumInfo)
    return albumInfo
  } catch (err) {
    console.error('DB error : ', err)
  }
}
//for react website
async function updateStatus(albumId, albumStatus) {
  query = { "album_id": albumId };
  updateSet = { "status": albumStatus }
  try {
    const db = getDb();
    const album = await db.collection(COLLECTION_NAME).updateOne(query, { $set: updateSet });
    console.log("albums...", album)
    return album
  } catch (err) {
    console.error("DB error : ", err);
  }
}
//for react website
async function otpVerification(album_id, otp) {

  const db = getDb();
  const query = {
    album_id: album_id,
    pin: otp
  };
  const match = await db.collection(COLLECTION_NAME).findOne(query);
  result = {}
  if (!!match) {
    result["loginstatus"] = "true";
    result["jwtToken"] = await generateToken(match["client_email"], result["album_id"], result["project_id"]);

  }
  else {
    result["loginstatus"] = "false"
  }
  return result
}



module.exports = { createClientAlbumInfo, findByProject, findAblbumInfoById, otpVerification, updateStatus }; 
