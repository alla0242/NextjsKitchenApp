"use server";
import { MongoClient } from "mongodb";

async function getImages() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
  const images = await client.db("DrawingApp").collection("images").find().toArray();
  console.log(images);
  console.log(images.length);
  images.forEach((image) => {
    console.log(image.state);
    console.log(image.imageData);
  });
  return images;

  } catch (error) {
    throw error; // Ensure errors are propagated
  } finally {
    await client.close();
  }
}



export default getImages;