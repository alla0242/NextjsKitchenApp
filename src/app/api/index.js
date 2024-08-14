require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const axios = require("axios");

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

    // Axios configuration
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": process.env.MONGODB_API_KEY,
      },
    };

    // Save Image
    async function saveImage(imageData) {
      const timestamp = new Date();
      const data = JSON.stringify({
        collection: "images",
        database: "DrawingApp",
        dataSource: "DrawingApp",
        document: {
          imageData,
          timestamp,
          state: "Sent To Kitchen",
        },
      });

      try {
        const response = await axios.post(
          "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/insertOne",
          data,
          axiosConfig
        );
        return response.data;
      } catch (error) {
        console.error("Error in saveImage:", error);
        throw new Error("Failed to save image");
      }
    }

    // Update Image State
    async function updateImageState(id, state, source) {
      const changeTime = new Date();
      const data = JSON.stringify({
        collection: "images",
        database: "DrawingApp",
        dataSource: "DrawingApp",
        filter: { _id: new ObjectId(id) },
        update: {
          $set: {
            state,
            lastChangeTime: changeTime,
            lastChangeSource: source,
          },
        },
      });

      try {
        const response = await axios.post(
          "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/updateOne",
          data,
          axiosConfig
        );
        return response.data;
      } catch (error) {
        console.error("Error in updateImageState:", error);
        throw new Error("Failed to update image state");
      }
    }

    // Get Latest Images
    async function getLatestImages() {
      const data = JSON.stringify({
        collection: "images",
        database: "DrawingApp",
        dataSource: "DrawingApp",
        sort: { timestamp: -1 },
      });

      try {
        const response = await axios.post(
          "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/find",
          data,
          axiosConfig
        );
        return response.data;
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

    // Handle API requests
    const express = require("express");
    const app = express();

    app.post("/api/getLatestImages", async (req, res) => {
      console.log("Received request to /api/getLatestImages");
      try {
        const data = JSON.stringify({
          collection: "images",
          database: "DrawingApp",
          dataSource: "DrawingApp",
          sort: { timestamp: -1 },
        });

        const axiosConfig = {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "api-key": process.env.MONGODB_API_KEY,
          },
        };

        const response = await axios.post(
          "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/find",
          data,
          axiosConfig
        );

        if (response.data.success && response.data.documents) {
          res.json({
            success: true,
            images: response.data.documents.map((image) => ({
              ...image,
              id: image._id.toString(),
              timestamp: new Date(image.timestamp),
            })),
          });
        } else {
          res.json({ success: false, message: "No new images found" });
        }
      } catch (error) {
        console.error("Error in /api/getLatestImages:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve images" });
      }
    });

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);