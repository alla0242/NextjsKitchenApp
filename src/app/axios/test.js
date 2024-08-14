"use server"
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
  const databasesList = await client.db().admin().listDatabases();
  return databasesList; // Return the list of databases
}

export default run;