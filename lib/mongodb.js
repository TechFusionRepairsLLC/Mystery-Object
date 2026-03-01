import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'mystery-object';

if (!uri) {
  throw new Error('Missing MONGODB_URI in environment variables.');
}

let client;
let clientPromise;

// Reuse a single MongoDB connection in development and production.
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const mongoClient = await clientPromise;
  return mongoClient.db(dbName);
}
