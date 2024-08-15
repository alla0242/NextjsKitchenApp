"use server";
import { MongoClient, ObjectId } from "mongodb";

async function completeOrder(orderId, newState) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  console.log("updateOrderState called with:", orderId, newState);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const updateStateToCompleted = await client
      .db("DrawingApp")
      .collection("images")
      .updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { state: newState, lastChangeTime: new Date(), lastChangeSource: "FoH", timeTaken: timeBetweenCreationAndCompletion } }
        //Add time between creation time and completion time
      );
        const getCompletedOrder = await client
      .db("DrawingApp")
      .collection("images")
      .findOne(
        { _id: new ObjectId(orderId) })

    await client
      .db("DrawingApp")
      .collection("images")
      .insertOne(
        getCompletedOrder
      );
   
      
    return result;
  } catch (error) {
    console.error("Error updating order state:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export default completeOrder;