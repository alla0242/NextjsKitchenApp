require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://kitchen-red.vercel.app'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

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

    app.post("/api/saveImage", async (req, res) => {
      const { imageData } = req.body;
      const timestamp = new Date();
      try {
        const result = await collection.insertOne({
          imageData,
          timestamp,
          state: "Sent To Kitchen",
        });
        res.json({ success: true, id: result.insertedId });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Failed to save image" });
      }
    });

    app.put("/api/updateImageState", async (req, res) => {
      const { id, state, source } = req.body;
      const changeTime = new Date();
      try {
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              state,
              lastChangeTime: changeTime,
              lastChangeSource: source,
            },
          }
        );
        if (result.modifiedCount === 1) {
          res.json({ success: true });
        } else {
          res.status(404).json({ success: false, message: "Image not found" });
        }
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Failed to update image state" });
      }
    });

    app.get("/api/getLatestImages", async (req, res) => {
      try {
        const results = await collection
          .find()
          .sort({ timestamp: -1 })
          .toArray();
        if (results.length > 0) {
          res.json({
            success: true,
            images: results.map((result) => ({
              id: result._id,
              imageData: result.imageData,
              timestamp: result.timestamp,
              state: result.state,
            })),
          });
        } else {
          res.json({ success: false, message: "No new images found" });
        }
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Failed to retrieve images" });
      }
    });

    app.post("/api/finishOrder", async (req, res) => {
      const { id, timeTaken } = req.body; // Get timeTaken from the request
      try {
        const order = await collection.findOne({ _id: new ObjectId(id) });
        if (!order) {
          return res
            .status(404)
            .json({ success: false, message: "Order not found" });
        }

        // Add the timeTaken to the order before moving it
        const orderToMove = {
          ...order,
          timeTaken, // Store the time taken as a number (milliseconds)
        };

        const pastOrdersCollection = db.collection("pastOrders");
        await pastOrdersCollection.insertOne(orderToMove);
        await collection.deleteOne({ _id: new ObjectId(id) });

        res.json({ success: true });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Failed to finish order" });
      }
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);