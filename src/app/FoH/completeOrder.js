"use server";
import { MongoClient, ObjectId } from "mongodb";

async function completeOrder(orderId, newState) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  console.log("updateOrderState called with:", orderId, newState);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const timeTaken = await timeBetweenCreationAndCompletion(orderId);

    const updateStateToCompleted = await client
      .db("DrawingApp")
      .collection("images")
      .updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            state: newState,
            lastChangeTime: new Date(),
            lastChangeSource: "FoH",
            timeTaken: timeTaken,
          },
        }
      );

    const getCompletedOrder = await client
      .db("DrawingApp")
      .collection("images")
      .findOne({ _id: new ObjectId(orderId) });

    await client
      .db("DrawingApp")
      .collection("pastOrders")
      .insertOne(getCompletedOrder);

    await client
      .db("DrawingApp")
      .collection("images")
      .deleteOne({ _id: new ObjectId(orderId) });

    return updateStateToCompleted;
  } catch (error) {
    console.error("Error updating order state:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

async function timeBetweenCreationAndCompletion(orderId) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const order = await client
      .db("DrawingApp")
      .collection("images")
      .findOne({ _id: new ObjectId(orderId) });
    return new Date().getTime() - order.timestamp.getTime();
  } finally {
    await client.close();
  }
}

export default completeOrder;