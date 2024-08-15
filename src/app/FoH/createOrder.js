"use server"
import { MongoClient } from "mongodb";



export async function sendToKitchen(imageData) {
      const uri = process.env.MONGODB_URI;
      const client = new MongoClient(uri);
      await client.connect();
      const collection = client.db("DrawingApp").collection("images");
      const order = {
        imageData,
        state: "Sent to Kitchen",
        timestamp: new Date(),
      };
      await collection.insertOne(order);
      await client.close();
}


export default sendToKitchen;