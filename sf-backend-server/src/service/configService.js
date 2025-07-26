require('dotenv').config();
const {  getDb } = require('../config/databaseConnection.js');



async function bucketInfo(){
  //query = { studio_id: studioId};
  try {
    const db = getDb();
    const events = await db.collection(COLLECTION_NAME).find({}).toArray();
   return events;
  } catch (err) {
    console.error('DB error:', err);
  }
}


module.exports = { bucketInfo };