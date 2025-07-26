require('dotenv').config();
const { getDb } = require('../config/databaseConnection.js');

const pipeline = require('./aggregateConstants.js');


const COLLECTION_NAME = process.env.PROJECT_COLLECTIONS;

async function findAllProjects() {

  try {
    const db = getDb();
    const projects = await db.collection(COLLECTION_NAME).find({}).toArray();
    return projects;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function updateStatus(projectId, projectStatus) {
  query = { "project_id": projectId };
  updateSet = { "status": projectStatus }
  try {
    const db = getDb();
    //console.log(query)
    const project = await db.collection(COLLECTION_NAME).updateOne(query, { $set: updateSet });
    console.log("projects... ", project)

    return project;
  } catch (err) {
    console.error('DB error:', err);
  }
}

// origin 
// async function projectDetails(projectId) {
//   query = { project_id: projectId };
//   try {
//     const db = getDb();

//     const projectDet = { $match: { project_id: projectId } };
//     console.log(pipeline);
//     var pipeline_projDetails = pipeline.projectDetails;
//     pipeline_projDetails.push(projectDet);
//     console.log(JSON.stringify(pipeline_projDetails))

//     const projects = await db.collection(COLLECTION_NAME).aggregate(pipeline_projDetails).toArray();

//     return projects;
//   } catch (err) {
//     console.error('DB error:', err);
//   }
// }

// new
async function projectDetails(projectId) {
  try {
    const db = getDb();
    const project = await db.collection(COLLECTION_NAME).findOne({ project_id: projectId });
    return project;
  } catch (err) {
    console.error('DB error:', err);
    return null;
  }
}



async function findByStudio(studioId) {
  query = { studio_id: studioId };
  try {
    const db = getDb();
    const projects = await db.collection(COLLECTION_NAME).find(query).toArray();
    return projects;
  } catch (err) {
    console.error('DB error:', err);
  }
}


async function insertProject(projectRecord) {
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(projectRecord);
    if (result.acknowledged) {
      console.log("Inserted record with ID: ${result.insertedId}");
    } else {
      console.log('Failed to insert record.');
    }
    // Attach the custom project_id 
    return {
      ...result,
      project_id: projectRecord.project_id,
    };
  } catch (err) {
    console.error('DB error:', err);
    //res.status(500).send('Server Error');
  }
}
module.exports = {
  findAllProjects, insertProject, findByStudio, projectDetails, updateStatus
};
