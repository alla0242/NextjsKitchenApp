"use server"
import { MongoClient } from "mongodb";

async function run() {
  const uri =
    "mongodb+srv://vercel-admin-user-66bcc8cb83ebb83e446851bb:hvBi8PHQ6sVd4Eeq@drawingapp.so9q8oz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const databases = await listDatabases(client);
    console.log("Databases fetched successfully:");
    console.log(databases);
    return databases; // Return the result of listDatabases
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error; // Ensure errors are propagated
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
}

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  return databasesList; // Return the list of databases
}

export default run;