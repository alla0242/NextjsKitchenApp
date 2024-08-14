"use client";
import React, { useState, useEffect } from "react";
import getOrders from "./getOrders";

const BoH = () => {
  const [latestImages, setLatestImages] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  useEffect(() => {
    fetchLatestImages();
    const intervalId = setInterval(fetchLatestImages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  async function fetchLatestImages() {
    try {
      const orders = await getOrders();
      setLatestImages(orders);
      setLastCheckTime(new Date());
    } catch (error) {
      console.error("Error fetching latest images:", error);
    }
  }

  // async function updateImageState(id, newState) {
  //   const changeTime = new Date();
  //   const data = {
  //     collection: "images",
  //     database: "DrawingApp",
  //     dataSource: "DrawingApp",
  //     filter: { _id: new ObjectId(id) },
  //     update: {
  //       $set: {
  //         state: newState,
  //         lastChangeTime: changeTime,
  //         lastChangeSource: "BoH",
  //       },
  //     },
  //   };

  //   try {
  //     const response = await fetch("/api/updateImageState", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     const result = await response.json();
  //     if (result.success) {
  //       // Update the local state
  //       setLatestImages((prevImages) =>
  //         prevImages.map((image) =>
  //           image.id === id
  //             ? {
  //                 ...image,
  //                 state: newState,
  //                 lastChangeTime: changeTime,
  //                 lastChangeSource: "BoH",
  //               }
  //             : image
  //         )
  //       );
  //       console.log(`Image ${id} state updated to ${newState}`);
  //     } else {
  //       console.error("Failed to update image state");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  return (
    <div>
      <h1>
        {lastCheckTime
          ? `Looked for new orders at ${lastCheckTime.toLocaleTimeString()}`
          : "Waiting for first check..."}
      </h1>
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
              {/* <button
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
              </button> */}
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