require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_DB_URL;
 // replace with your URI
const dbName = process.env.DATABASE_NAME;

const options = {
  maxPoolSize: 10,         // maximum number of connections in the pool
  minPoolSize: 2,          // minimum number of connections
  waitQueueTimeoutMS: 5000 // time to wait before error if pool is exhausted
};

let client;
let db;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri, options);
    await client.connect();
    console.log('MongoDB connected and pool initialized');
    db = client.db(dbName);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Call connectToMongo() before calling getDb()');
  }
  return db;
}

function closeMongoConnection() {
  if (client) {
    return client.close();
  }
}

module.exports = {
  connectToMongo,
  getDb,
  closeMongoConnection
};
