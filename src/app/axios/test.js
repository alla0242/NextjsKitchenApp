"use server";
import { MongoClient } from "mongodb";

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
  const images = await client.db("DrawingApp").collection("images").find().toArray();
  return images;

  } catch (error) {
    throw error; // Ensure errors are propagated
  } finally {
    await client.close();
  }
}

async function listDatabases(client) {
  try {
    const databasesList = await client.db().admin().listDatabases();
    // Convert each database object to a plain object
    const plainDatabasesList = databasesList.databases.map(db => ({
      name: db.name,
      sizeOnDisk: db.sizeOnDisk,
      empty: db.empty
    }));
    return { databases: plainDatabasesList }; // Return the list of plain objects
  } catch (error) {
    throw error; // Ensure errors are propagated
  }
}

async function getImages(client) {
  const images = await client.db("DrawingApp").collection("images").find().toArray();
  return images;
}

export default run;