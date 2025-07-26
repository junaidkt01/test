require('dotenv').config();
const {  getDb } = require('../config/databaseConnection.js');

const pipeline  = require('./aggregateConstants.js');

const COLLECTION_NAME = process.env.IMAGES_COLLECTIONS;

async function findAllImages(studioId){
  query = { studio_id: studioId};
  try {
    const db = getDb();
    const clients = await db.collection(COLLECTION_NAME).find(query).toArray();
   return clients;
  } catch (err) {
    console.error('DB error:', err);
  }
}


async function updateClientFavouriteImages(imageList) {
  console.log("from updateClientFavouriteImages", imageList)
  const favoriteimages = imageList.filter(item => item.favourite);       

  console.log("updateClientFavouriteImages called :" + imageList + " images to update");

  // First we need to clean all the selected images for the album
  imageList.forEach(async(item) => {
      console.log(item.imageId);
      console.log(item.favourite);

    try {
        const db = getDb();
        const clients = await db.collection(COLLECTION_NAME).updateOne( { image_id: item.imageId },  { $pull: { favourite: item.albumId } });
      return clients;
      } catch (err) {
        console.error('DB error:', err);
      }

    });
  // Only update the other images that are favourite
  console.log("------------------------------------------------")
  favoriteimages.forEach(async(item) => {
      console.log(item.imageId);
      console.log(item.favourite);

    try {
        const db = getDb();
        const clients = await db.collection(COLLECTION_NAME).updateOne( { image_id: item.imageId },
    { $push: { favourite: item.albumId } });
      return clients;
      } catch (err) {
        console.error('DB error:', err);
      }

   });
}


async function updateClientSelectedImages(imageList) {
  console.log("from updateClientSelectedImages", imageList)
  const selectedImages = imageList.filter(item => item.selected);      
  //const unSelectedImages = imageList.filter(item => item.selected == false);  null;

console.log("updateClientSelectedImages called :" + imageList + " images to update");

// First we need to clean all the selected images for the album
  
imageList.forEach(async(item) => {

     console.log(item.imageId);
     console.log(item.selected);

  try {
      const db = getDb();
      const clients = await db.collection(COLLECTION_NAME).updateOne( { image_id: item.imageId },
   { $pull: { selected: item.albumId } });
    return clients;
    } catch (err) {
      console.error('DB error:', err);
    }

   });
// Only update the other images that are selected
console.log("---------------------------------------------------")
selectedImages.forEach(async(item) => {
  
     console.log(item.imageId);
     console.log(item.selected);

  try {
      const db = getDb();
      const clients = await db.collection(COLLECTION_NAME).updateOne( { image_id: item.imageId },
   { $push: { selected: item.albumId } });
    return clients;
    } catch (err) {
      console.error('DB error:', err);
    }

   });
}
async function findByFolderAndAlbumId(folderId, albumId){
  try {
    const imageList = await findByFolder(folderId);

    imageList.forEach(image => {
      if (image.selected.includes(albumId)) {
        image.imageSelected = true;
      }else{
        image.imageSelected = false;
      }
      if (image.favourite.includes(albumId)) {
        image.imageFavourite = true;
      }else{
        image.imageFavourite = false;
      }
    } );
   return imageList;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function findByFolder(folderId){
  query = { folder_id: folderId};
  try {
    const db = getDb();
    const events = await db.collection(COLLECTION_NAME).find({"folder_id": folderId}).toArray();
   return events;
  } catch (err) {
    console.error('DB error:', err);
  }
}

async function findByProject(projectId){
  query = { project_id: projectId};
  try {
    const db = getDb();
    const images = await db.collection(COLLECTION_NAME).find({"project_id": projectId}).toArray();
    console.log(images.length)
   return images.length;
  } catch (err) {
    console.error('DB error:', err);
  }
}


async function clientSelectedImages(imgAlbum){ 
  try {
    const db = getDb();
 
    const imageDet =   {
    $match: { project_id: imgAlbum.projectId,
      $or: [ { selected:   imgAlbum.albumId},  
             { favourite: imgAlbum.albumId   }
          ]   } };
    //console.log(pipeline);
    var pipeline_imageDetails = pipeline.clientSelctedFavImg;
    pipeline_imageDetails.push(imageDet); 
    // console.log(JSON.stringify(pipeline_imageDetails))

    const imageDetails = await db.collection(COLLECTION_NAME).aggregate(pipeline_imageDetails).toArray();
    console.log("imageDetails : ",imageDetails)
   return imageDetails;
  } catch (err) {
    console.error('DB error:', err);
  }
}


async function insertImage(imageRecord) {
  try {

    imageRecord.selected = imageRecord.selected || [];
    imageRecord.favourite = imageRecord.favourite || [];

    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(imageRecord);
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


async function getFavouriteCount(albumInfo) {
  const db = getDb(); 
  try {

    const pipeline = [{ $match: 
      { project_id: albumInfo["project_id"], favourite: albumInfo["album_id"] 
      }  },  {   $count: "favourite" }
      ]  ;


    const favouriteCount = await db.collection(COLLECTION_NAME).aggregate(pipeline).toArray();;
    
    return favouriteCount

  } catch (err) {
    console.error('DB error:', err); 
  } 
}

async function getSelectedCount(albumInfo) {
  const db = getDb(); 
  try {

    const pipeline = [{ $match: 
      { project_id: albumInfo["project_id"], selected: albumInfo["album_id"] 
      }  },  {   $count: "selected" }
      ]  ;


    const selectedCount = await db.collection(COLLECTION_NAME).aggregate(pipeline).toArray();;
  
    return selectedCount

  } catch (err) {
    console.error('DB error:', err); 
  }
}

module.exports = {
        findAllImages, insertImage,findByFolderAndAlbumId, findByFolder, updateClientSelectedImages, updateClientFavouriteImages,
        getFavouriteCount, getSelectedCount, clientSelectedImages,findByProject
    };
