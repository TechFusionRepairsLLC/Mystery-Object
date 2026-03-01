/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'mystery-object';

const starterPuzzles = [
  {
    date: '2026-03-01',
    objectName: 'Rubiks Cube',
    clue1Image:
      'https://images.unsplash.com/photo-1591991564021-0662d7013ea7?auto=format&fit=crop&w=1200&q=80',
    clue2Image:
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1200&q=80',
    clue3Image:
      'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=80',
    fullImage:
      'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1600&q=80'
  },
  {
    date: '2026-03-02',
    objectName: 'Guitar',
    clue1Image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    clue2Image:
      'https://images.unsplash.com/photo-1543062094-d22540a33890?auto=format&fit=crop&w=1200&q=80',
    clue3Image:
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80',
    fullImage:
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1600&q=80'
  }
];

async function run() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection('puzzles');

  for (const puzzle of starterPuzzles) {
    await collection.updateOne(
      { date: puzzle.date },
      {
        $set: { ...puzzle, updatedAt: new Date().toISOString() },
        $setOnInsert: { createdAt: new Date().toISOString() }
      },
      { upsert: true }
    );
  }

  await collection.createIndex({ date: 1 }, { unique: true });
  console.log(`Seeded ${starterPuzzles.length} starter puzzles into ${dbName}.`);

  await client.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
