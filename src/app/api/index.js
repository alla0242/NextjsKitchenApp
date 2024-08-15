"use server";
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri);



    const db = client.db("DrawingApp");
    const collection = db.collection("images");


  async function getLatestImages() {
    const sort = { timestamp: -1 };

    try {
      const result = await collection.find().sort(sort).toArray();
      return result;
    } catch (error) {
      console.error("Error in getLatestImages:", error);
      throw new Error("Failed to retrieve images");
    }
  }

    // Save Image
    async function saveImage(imageData) {
      const timestamp = new Date();
      const document = {
        imageData,
        timestamp,
        state: "Sent To Kitchen",
      };

      try {
        const result = await collection.insertOne(document);
        return result;
      } catch (error) {
        console.error("Error in saveImage:", error);
        throw new Error("Failed to save image");
      }
    }

    // Update Image Stat
    // Finish Order
    async function finishOrder(id, timeTaken) {
      try {
        const order = await collection.findOne({ _id: new ObjectId(id) });
        if (!order) {
          throw new Error("Order not found");
        }

        const orderToMove = {
          ...order,
          timeTaken,
        };

        const pastOrdersCollection = db.collection("pastOrders");
        await pastOrdersCollection.insertOne(orderToMove);
        await collection.deleteOne({ _id: new ObjectId(id) });

        return { success: true };
      } catch (error) {
        console.error("Error in finishOrder:", error);
        throw new Error("Failed to finish order");
      }
    }

    // Export functions
    module.exports = {
      saveImage,
      getLatestImages,
      finishOrder,
    };


run().catch(console.dir);