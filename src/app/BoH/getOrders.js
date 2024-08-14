
"use server";
import { MongoClient } from "mongodb";


async function getOrders() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  await client.connect();
  const orders = await client
    .db("DrawingApp")
    .collection("images")
    .find()
    .toArray();
  return orders;
}

export default getOrders;