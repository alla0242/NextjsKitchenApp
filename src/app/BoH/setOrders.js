"use server";
import { MongoClient } from "mongodb";

async function updateOrderState(orderId, newState) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  await client.connect();
  await client
    .db("DrawingApp")
    .collection("images")
    .updateOne({ _id: orderId }, { $set: { state: newState ,lastChangeTime: new Date(), lastChangeSource: "BoH"}});
}

export default updateOrderState;
