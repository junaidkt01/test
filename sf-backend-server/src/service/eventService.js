require('dotenv').config();
const { getDb } = require('../config/databaseConnection.js');

const COLLECTION_NAME = process.env.EVENTS_COLLECTIONS;
const FOLDERS_COLLECTION = process.env.FOLDERS_COLLECTIONS;

async function findAllEvents() {
  //query = { studio_id: studioId};
  try {
    const db = getDb();
    const events = await db.collection(COLLECTION_NAME).find({}).toArray();
    return events;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function findAnEvent(event_id) {
  try {
    const db = getDb();
    const events = await db.collection(COLLECTION_NAME).find({ "event_id": event_id }).toArray();
    return events;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function updateStatus(eventId, eventStatus) {
  query = { "event_id": eventId };
  updateSet = { "status": eventStatus }
  try {
    const db = getDb();
    //console.log(query)
    const folders = await db.collection(COLLECTION_NAME).updateOne(query, { $set: updateSet });
    console.log("folders... ", folders)

    return folders;
  } catch (err) {
    console.error('DB error:', err);
  }
}


async function findByProject(projectId) {
  const db = getDb();
  const query = { project_id: projectId };

  try {
    console.log("Query:", query);

    // Get events by project_id
    const events = await db.collection(COLLECTION_NAME).find(query).toArray();

    // For each event, find folders with matching event_id
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const folders = await db
          .collection(FOLDERS_COLLECTION)
          .find({ event_id: event.event_id })
          .toArray();

        return {
          ...event,
          event_folders: folders,
        };
      })
    );

    return enrichedEvents;

  } catch (err) {
    console.error('DB error:', err);
    return [];
  }
}

// async function findByProject(projectId) {
//   query = { "project_id": projectId };
//   try {
//     const db = getDb();
//     console.log("QUery ", query)
//     const events = await db.collection(COLLECTION_NAME).find(query).toArray();
//     return events;
//   } catch (err) {
//     console.error('DB error:', err);
//   }
// }

async function insertEvent(eventRecord) {
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(eventRecord);
    if (result.acknowledged) {
      console.log(`Inserted record with ID: ${result.insertedId}`);
    } else {
      console.log('Failed to insert record.');
    }
    // Attach the custom event_id 
    return {
      ...result,
      event_id: eventRecord.event_id,
    };
  } catch (err) {
    console.error('DB error:', err);
    //res.status(500).send('Server Error');
  }
}


module.exports = {
  findAllEvents, findByProject, insertEvent, updateStatus, findAnEvent
};
