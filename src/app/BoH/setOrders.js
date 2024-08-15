"use server";
import { MongoClient } from "mongodb";

async function updateOrderState(orderId, newState) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  console.log("updateOrderState called with:", orderId, newState);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const result = await client
      .db("DrawingApp")
      .collection("images")
      .updateOne(
        { _id: orderId },
        { $set: { state: newState, lastChangeTime: new Date(), lastChangeSource: "BoH" } }
      );
    
    console.log("Order updated:", result);
  } catch (error) {
    console.error("Error updating order state:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export default updateOrderState;