"use client";
import React, { useState, useEffect } from "react";
import BoHButtons from "../../Components/BoHButtons";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const BoH = ({ width, height }) => {
  const [latestImages, setLatestImages] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  useEffect(() => {
    fetchLatestImages();
    const intervalId = setInterval(fetchLatestImages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  function fetchLatestImages() {
    const data = JSON.stringify({
      collection: "pastOrders",
      database: "DrawingApp",
      dataSource: "DrawingApp",
      projection: {
        _id: 1,
        imageData: 1,
        timestamp: 1,
        state: 1,
        lastChangeSource: 1,
        lastChangeTime: 1,
      },
    });

    const config = {
      method: "post",
      url: "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": process.env.MONGODB_API_KEY,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.documents) {
          const newImages = response.data.documents.map((image) => ({
            ...image,
            id: image._id.toString(),
            timestamp: new Date(image.timestamp),
            lastChangeTime: new Date(image.lastChangeTime),
          }));

          // Sort the images to put "Ready for Pickup" at the end
          newImages.sort((a, b) => {
            if (a.state === "Ready for Pickup" && b.state !== "Ready for Pickup") {
              return 1;
            }
            if (a.state !== "Ready for Pickup" && b.state === "Ready for Pickup") {
              return -1;
            }
            return 0;
          });

          setLatestImages(newImages);
        } else {
          setLatestImages([]); // Clear images if no new images found
          console.log("No new images found");
        }
        setLastCheckTime(new Date());
      })
      .catch(function (error) {
        console.log(error);
        setLastCheckTime(new Date());
      });
  }

  function updateImageState(id, newState) {
    const changeTime = new Date();
    const data = JSON.stringify({
      collection: "images",
      database: "DrawingApp",
      dataSource: "DrawingApp",
      filter: { _id: new ObjectId(id) },
      update: {
        $set: {
          state: newState,
          lastChangeTime: changeTime,
          lastChangeSource: "BoH",
        },
      },
    });

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": process.env.MONGODB_API_KEY,
      },
    };

    axios
      .post(
        "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/updateOne",
        data,
        axiosConfig
      )
      .then((response) => {
        if (response.data.success) {
          // Update the local state
          setLatestImages((prevImages) =>
            prevImages.map((image) =>
              image.id === id
                ? {
                    ...image,
                    state: newState,
                    lastChangeTime: changeTime,
                    lastChangeSource: "BoH",
                  }
                : image
            )
          );
          console.log(`Image ${id} state updated to ${newState}`);
        } else {
          console.error("Failed to update image state");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      <h1>
        {lastCheckTime
          ? `Looked for new orders at ${lastCheckTime.toLocaleTimeString()}`
          : "Waiting for first check..."}
      </h1>
      <BoHButtons width={200} height={200} />
      {latestImages.length > 0 ? (
        <div>
          {latestImages.map((image, index) => (
            <div
              key={index}
              style={{
                margin: "20px 0",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <img
                src={image.imageData}
                alt={`Kitchen layout ${index + 1}`}
                width={width}
                height={height}
                style={{ margin: "10px" }}
              />
              <p>Sent at: {new Date(image.timestamp).toLocaleString()}</p>
              <p>Current State: {image.state}</p>
              <p>Last Change Source: {image.lastChangeSource}</p>
              <p>Last Change Time: {new Date(image.lastChangeTime).toLocaleString()}</p>
              <button
                onClick={() =>
                  updateImageState(image.id.toString(), "Ready for Pickup")
                }
                disabled={image.state === "Ready for Pickup"}
              >
                Mark as Ready for Pickup
              </button>
              <button
                onClick={() =>
                  updateImageState(image.id.toString(), "Order at table")
                }
                disabled={image.state === "Order at table"}
              >
                Mark as Order at Table
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders up</p>
      )}
      <button onClick={fetchLatestImages}>Refresh Images</button>
    </div>
  );
};

export default BoH;