"use client";
import React, { useState, useEffect, useRef } from "react";
import sendToKitchen from "./createOrder.js";
import getOrders from "../BoH/getOrders.js";
import updateOrderState from "../BoH/setOrders.js";
import completeOrder from "./completeOrder.js";
import { Camera } from 'react-camera-pro';

const FoH = () => {
  const [orders, setOrders] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [lastImage, setLastImage] = useState(null);
  const cameraRef = useRef(null);

  function takePhoto() {
    if (cameraRef.current) {
      const imageData = cameraRef.current.takePhoto();
      setLastImage(imageData);
    } else {
      alert("Camera is not available. Please try again.");
    }
  }

  function saveImage() {
    if (lastImage) {
      sendToKitchen(lastImage);
      setLastImage(null);
    } else {
      alert("No image to send. Please take a photo first.");
    }
  }

  async function handleUpdateOrderState(id, newState) {
    try {
      await updateOrderState(id, newState);
      await fetchLatestImages(); // Refresh orders after updating state
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  }

  async function handleCompleteOrder(id, newState) {
    try {
      await completeOrder(id, newState);
      await fetchLatestImages(); // Refresh orders after completing order
    } catch (error) {
      console.error("Error completing order:", error);
    }
  }

  useEffect(() => {
    fetchLatestImages();
    const intervalId = setInterval(fetchLatestImages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchLatestImages() {
    try {
      const orders = await getOrders();
      setOrders(orders);
      setLastCheckTime(new Date());
    } catch (error) {
      console.error("Error fetching latest images:", error);
    }
  }

  async function fetchOrders() {
    try {
      const orders = await getOrders();
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  return (
    <div className="h-screen w-screen">
      <h1>
        {lastCheckTime
          ? `Looked for new orders at ${lastCheckTime.toLocaleTimeString()}`
          : "Waiting for first check..."}
      </h1>
      <details open={isNewOrderOpen} onToggle={() => setIsNewOrderOpen(!isNewOrderOpen)}>
        <summary className="text-2xl font-bold justify-center">{isNewOrderOpen ? "Hide Camera" : "New Order"}</summary>
        <div className="flex flex-col items-center">
          {lastImage ? (
            <div className="relative w-full" >
              <img src={lastImage} alt="Last Taken" className="absolute top-0 left-0 w-full h-full" />
            </div>
          ) : (
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <Camera
                ref={cameraRef}
                aspectRatio={9 / 16}
                facingMode="environment"
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          )}
          <button
            className="large-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
            onClick={takePhoto}
          >
            Take Photo
          </button>
          <button
            className="large-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 mt-4"
            onClick={saveImage}
          >
            Send to Kitchen
          </button>
        </div>
      </details>
      {orders.length > 0 ? (
        <ol className="list-decimal">
          {orders.map((order, index) => (
            <div
              key={index}
              className={
                order.state === "Sent to Kitchen"
                  ? "flash-sent-to-kitchen"
                  : order.state === "Order at Table"
                  ? "flash-order-at-table"
                  : order.state === "Completed"
                  ? "flash-completed"
                  : order.state === "Ready for Pickup"
                  ? "flash-ready-for-pickup"
                  : ""
              }
              style={{
                border: "1px solid #ccc",
              }}
            >
              <details>
                <summary>
                  Order #{index + 1}
                  State: {order.state}
                </summary>
                <img src={order.imageData} alt="Order Image" />
                {order.state !== "Order at Table" && (
                  <button
                    className="large-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={() =>
                      handleUpdateOrderState(order._id, "Order at Table")
                    }
                  >
                    Order at Table
                  </button>
                )}
                {order.state === "Order at Table" && (
                  <button
                    className="large-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                    onClick={() => handleCompleteOrder(order._id, "Completed")}
                  >
                    Mark as Completed
                  </button>
                )}
              </details>
            </div>
          ))}
        </ol>
      ) : (
        <p>No orders up</p>
      )}
    </div>
  );
};

export default FoH;