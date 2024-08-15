"use client";
import React, { useState, useEffect } from "react";
import Canvas from "../../Components/Canvas.js";
import sendToKitchen from "./createOrder.js";
import getOrders from "../BoH/getOrders.js";
import updateOrderState from "../BoH/setOrders.js";
import completeOrder from "./completeOrder.js";

const FoH = () => {
  const [orders, setOrders] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  function saveImage() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const blank = document.createElement("canvas");
    blank.width = canvas.width;
    blank.height = canvas.height;

    if (
      ctx.getImageData(0, 0, canvas.width, canvas.height).data.toString() ===
      blank
        .getContext("2d")
        .getImageData(0, 0, blank.width, blank.height)
        .data.toString()
    ) {
      alert("Canvas is blank. Please draw something before sending.");
      return;
    }

    const imageData = canvas.toDataURL("image/png");
    clearCanvas();
    sendToKitchen(imageData);
    return imageData;
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

  function clearCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

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
      <h2>Front of House</h2>
      <Canvas />
      <button onClick={() => clearCanvas()}>Clear</button>
      <button onClick={() => saveImage()}>Send to Kitchen</button>
      {orders.length > 0 ? (
        <ol className="list-decimal">
          {orders.map((order, index) => (
            <div key={index}>
              <details>
                <summary>
                  Order ID: {order._id}
                  <p>State: {order.state}</p>
                </summary>

                <button
                  onClick={() =>
                    handleUpdateOrderState(order._id, "Ready for Pickup")
                  }
                >
                  Ready for Pickup
                </button>
                <button
                  onClick={() =>
                    handleUpdateOrderState(order._id, "Order at Table")
                  }
                >
                  Order at Table
                </button>
                <button
                  onClick={() => handleCompleteOrder(order._id, "Completed")}
                >
                  Mark as Completed
                </button>
              </details>
            </div>
          ))}
        </ol>
      ) : (
        <p>No orders available</p>
      )}
    </div>
  );
};

export default FoH;