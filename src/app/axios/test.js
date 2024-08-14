"use server";
import { MongoClient } from "mongodb";

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const databases = await listDatabases(client);
    return databases; // Return the result of listDatabases
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

export default run;