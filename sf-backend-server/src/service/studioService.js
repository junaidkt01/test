require('dotenv').config();
const { getDb } = require('../config/databaseConnection.js');
const { sendOtpEmail } = require('../mailService.js');

const { encryptString, checkEcryptString } = require("../utils/encrypt.js")
const { generateToken, verifyToken } = require("../utils/jwtToken.js")
const pipeline = require('./aggregateConstants.js');

const COLLECTION_NAME = process.env.STUDIO_COLLECTIONS;

async function findAllStudios() {

  try {
    const db = getDb();
    const studios = await db.collection(COLLECTION_NAME).find().toArray();
    return studios;
  } catch (err) {
    console.error('DB error:', err);
    //res.status(500).send('Server Error');
  }
}


async function checkForFolderStatus(studioRecord) {

  try {
    const db = getDb();
    studioId = studioRecord["studio_id"];
    folderStatus = studioRecord["folder_status"];
    var studioProjectStatus = pipeline.checkForInProgressStatus;
    //console.log("studioProjectStatus :"+JSON.stringify(studioProjectStatus));

    // const projectMatch =  [ { $match: { studio_id: studioId } } , { $match: { Folders: folderStatus } }  ]

    //studioProjectStatus = studioProjectStatus + projectMatch;

    studioProjectStatus.push({ $match: { studio_id: studioId } })

    studioProjectStatus.push({ $match: { Folder_status: folderStatus } })

    console.log("studioProjectStatus After update.... :" + JSON.stringify(studioProjectStatus));
    const projects = await db.collection(COLLECTION_NAME).aggregate(studioProjectStatus).toArray();

    return projects;
  } catch (err) {
    console.error('DB error:', err);

  }


}

async function validateLogin(studioRecord) {
  try {


    const db = getDb();
    query = { "businessEmail": studioRecord["businessEmail"] };

    password = studioRecord["password"];

    const result = await db.collection(COLLECTION_NAME).findOne(query);


    if (result == undefined || result == null) {
      returnJson = {
        loginProcess: false,
        status: "Failure",
        statusMessage: "Invalid Username or password. Or Create a New Account"
      }
      return returnJson;
    }

    //console.log("JSON "+JSON.stringify(result));

    //console.log("JSON "+result["password"]);
    //console.log("JSON "+ await encryptString(studioRecord["password"]));

    isValidLogin = await checkEcryptString(password, result["password"]);

    returnJson = { loginProcess: isValidLogin }

    if (isValidLogin) {
      returnJson["status"] = "Success";
      returnJson["studio_id"] = result["studio_id"];
      returnJson["jwtToken"] = await generateToken(result["companyName"], result["businessEmail"], result["studio_id"]);
    } else {
      returnJson["status"] = "Failure";
      returnJson["statusMessage"] = "Invalid Username or password"
    }

    return returnJson;
  } catch (err) {
    console.error('DB error:', err);
    //res.status(500).send('Server Error');
  }
}

async function insertStudio(studioRecord) {
  try {
    const db = getDb();

    password = studioRecord["password"];
    hashPassword = await encryptString(password);
    studioRecord["password"] = hashPassword;

    const result = await db.collection(COLLECTION_NAME).insertOne(studioRecord);
    if (result.acknowledged) {
      console.log(`Inserted record with ID: ${result.insertedId}`);
    } else {
      console.log('Failed to insert record.');
    }
    return result;
  } catch (err) {
    console.error('DB error:', err);
    //res.status(500).send('Server Error');
  }
}


/////////////////////////
async function updateStatus(id, status) {
  const query = { studio_id: id };
  const updateSet = { status: status };

  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).updateOne(query, { $set: updateSet });
    return result;
  } catch (err) {
    console.error('DB error (updateStatus):', err);
    throw err;
  }
}

async function validateOtp({ studio_id, otp }) {
  const db = getDb();
  const studio = await db.collection(COLLECTION_NAME).findOne({ studio_id });

  if (!studio) {
    throw new Error("Studio not found.");
  }

  if (studio.otp === otp) {
    await updateStatus(studio_id, "Active");
    return { message: "OTP verified successfully. Studio is now Active." };
  } else {
    throw new Error("Invalid OTP.");
  }
}
/////////////////////////////
/////////////////////////////

async function updateOtp(studio_id, newOtp) {
  const query = { studio_id };
  const updateSet = { otp: newOtp };

  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).updateOne(query, { $set: updateSet });

    console.log(`OTP updated for studio_id: ${studio_id}`);
    return result;
  } catch (err) {
    console.error(`DB error in updateOtp for studio_id ${studio_id}:`, err);
    throw err;
  }
}

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function resendOtp(studio_id, businessEmail) {
  const db = getDb();
  const studio = await db.collection(COLLECTION_NAME).findOne({ studio_id });

  if (!studio) {
    throw new Error("Studio not found.");
  }

  const newOtp = generateOtp();

  await updateOtp(studio_id, newOtp);   // ✅ update OTP in DB

  await sendOtpEmail(businessEmail, newOtp, studio_id); // ✅ send the OTP to user's email

  return {
    message: "OTP resent successfully and emailed.",
    otp: newOtp,
    studio_id: studio_id,
  };
}

// async function resendOtp(studio_id) {
//   const db = getDb();
//   const studio = await db.collection(COLLECTION_NAME).findOne({ studio_id });

//   if (!studio) {
//     throw new Error("Studio not found.");
//   }

//   const newOtp = generateOtp();         // ✅ generate a new OTP
//   await updateOtp(studio_id, newOtp);   // ✅ call the update function

//   return { message: "OTP resent successfully.", otp: newOtp };
// }
//////////////////////////////////////

async function findStudioById(studioId) {

  query = { id: studioId };
  try {
    const db = getDb();
    const studio = await db.collection(COLLECTION_NAME).findOne(query);
    return studio;
  } catch (err) {
    console.error('DB error:', err);
  }
}

//insertStudio(uri, dbName, collectionName, newRecord);

module.exports = {
  insertStudio, findStudioById, findAllStudios, validateLogin, resendOtp, checkForFolderStatus, validateOtp
};
