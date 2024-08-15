"use server"



export async function sendToKitchen(imageData) {
      const uri = process.env.MONGODB_URI;
      const client = new MongoClient(uri);
      await client.connect();
      const collection = client.db("DrawingApp").collection("test");
      const order = {
        imageData,
        state: "Sent to Kitchen",
        timestamp: new Date(),
      };
      await collection.insertOne(order);
      await client.close();
    console.log(imageData);
}


export default sendToKitchen;