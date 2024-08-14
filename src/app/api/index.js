"use server";
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db("DrawingApp");
    const collection = db.collection("images");

    // Test connection to the database and collection
    try {
      await db.command({ ping: 1 });
      console.log("Successfully connected to the DrawingApp database");

      const testDoc = await collection.findOne();
      if (testDoc) {
        console.log("Successfully connected to the images collection");
      } else {
        console.log("Connected to the images collection, but it is empty");
      }
    } catch (testError) {
      console.error("Failed to connect to the DrawingApp database or images collection", testError);
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

    // Update Image State
    async function updateImageState(id, state, source) {
      const changeTime = new Date();
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          state,
          lastChangeTime: changeTime,
          lastChangeSource: source,
        },
      };

      try {
        const result = await collection.updateOne(filter, update);
        return result;
      } catch (error) {
        console.error("Error in updateImageState:", error);
        throw new Error("Failed to update image state");
      }
    }

    // Get Latest Images
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

    // Check DB Connection
    async function checkDbConnection() {
      try {
        await client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB");
        return { success: true, message: "Successfully connected to MongoDB" };
      } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw new Error("Failed to connect to MongoDB");
      }
    }

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
      updateImageState,
      getLatestImages,
      checkDbConnection,
      finishOrder,
    };

  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);