"use server";
import { MongoClient, ObjectId } from "mongodb";

async function completeOrder(orderId, newState) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  console.log("completeOrder called with:", orderId, newState);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const timeTaken = await timeBetweenCreationAndCompletion(orderId);
    console.log("Time taken for order completion:", timeTaken);

    const minutes = Math.floor(timeTaken / 60000);
    const seconds = Math.floor((timeTaken % 60000) / 1000);

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
            timeTaken: `it took ${minutes} minutes and ${seconds} seconds to complete the order`,
          },
        }
      );
    console.log("Order state updated:", updateStateToCompleted);

    const getCompletedOrder = await client
      .db("DrawingApp")
      .collection("images")
      .findOne({ _id: new ObjectId(orderId) });
    console.log("Retrieved completed order:", getCompletedOrder);

    const insertResult = await client
      .db("DrawingApp")
      .collection("pastOrders")
      .insertOne(getCompletedOrder);
    console.log("Inserted order into pastOrders:", insertResult);

    const deleteResult = await client
      .db("DrawingApp")
      .collection("images")
      .deleteOne({ _id: new ObjectId(orderId) });
    console.log("Deleted order from images:", deleteResult);

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
  console.log("Calculating time between creation and completion for order:", orderId);

  try {
    await client.connect();
    const order = await client
      .db("DrawingApp")
      .collection("images")
      .findOne({ _id: new ObjectId(orderId) });
    console.log("Order retrieved for time calculation:", order);
    return new Date().getTime() - order.timestamp.getTime();
  } finally {
    await client.close();
    console.log("MongoDB connection closed after time calculation");
  }
}

export default completeOrder;