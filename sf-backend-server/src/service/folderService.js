require('dotenv').config();
const { getDb } = require('../config/databaseConnection.js');
const { ObjectId } = require('mongodb');


const COLLECTION_NAME = process.env.FOLDERS_COLLECTIONS;

async function findAllFolders(studioId) {
  query = { studio_id: studioId };
  try {
    const db = getDb();
    const folders = await db.collection(COLLECTION_NAME).find(query).toArray();
    return folders;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function updateStatus(folderId, folderStatus) {
  const query = { folder_id: folderId };
  const updateSet = { status: folderStatus };

  try {
    const db = getDb();
    const folders = await db
      .collection(COLLECTION_NAME)
      .updateOne(query, { $set: updateSet });

    console.log("folders... ", folders);
    return folders;
  } catch (err) {
    console.error("DB error:", err);
  }
}


// async function updateStatus(folderId, foldeStatus) {
//   query = { "folder_id": folderId };
//   updateSet = { "status": foldeStatus }
//   console.log("query... ", query)
//   updateSet = { "updateSet": updateSet }
//   try {
//     const db = getDb();
//     //console.log(query)
//     const folders = await db.collection(COLLECTION_NAME).updateOne(query, { $set: updateSet });
//     console.log("folders... ", folders)

//     return folders;
//   } catch (err) {
//     console.error('DB error:', err);
//   }
// }


async function updatebasePath(folderId, basePath) {
  query = { "folder_id": folderId };
  updateSet = { "base_path": basePath }
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

async function updateStudioSelectedCount(folderId, imageCount) {
  query = { "folder_id": folderId };
  updateSet = { "studio_selected_count": imageCount }
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

async function updatetotalNumber(folderId, total_number_of_images) {
  query = { "folder_id": folderId };
  updateSet = { "total_image_count": total_number_of_images }
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

async function findByEvent(eventId) {
  query = { "event_id": eventId };

  try {
    const db = getDb();
    console.log(query)
    const folders = await db.collection(COLLECTION_NAME).find({ "event_id": eventId }).toArray();
    console.log("folders... ", folders)

    return folders;
  } catch (err) {
    console.error('DB error:', err);
  }
}


async function getFolderById(folder_id) {
  query = { "folder_id": folder_id }
  try {
    const db = getDb();
    console.log(query)
    const folder = await db.collection(COLLECTION_NAME).find({ "folder_id": folder_id }).toArray();
    console.log("folder .. ", folder)
    return folder
  } catch (err) {
    console.err('DB error : ', err)
  }
}

// async function getFolderById(folder_id) {
//   query = { "folder_id": folder_id }
//   try {
//     const db = getDb();
//     console.log(query)
//     const folder = await db.collection(COLLECTION_NAME).find({ "folder_id": folder_id }).toArray();
//     console.log("folder .. ", folder)
//     return folder
//   } catch (err) {
//     console.err('DB error : ', err)
//   }
// }

async function insertFolder(folderRecord) {
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(folderRecord);
    if (result.acknowledged) {
      console.log(`Inserted record with ID: ${result.insertedId}`);
    } else {
      console.log('Failed to insert record.');
    }
    // Attach the custom folder_id 
    return {
      ...result,
      folder_id: folderRecord.folder_id,
    };
  } catch (err) {
    console.error('DB error:', err);
    //res.status(500).send('Server Error');
  }
}





module.exports = {
  findAllFolders, findByEvent, insertFolder, updateStatus, updatebasePath, updatetotalNumber, getFolderById,
  updateStudioSelectedCount
};



