"use client";
import React, { useState, useEffect } from "react";
// import Canvas from "../../Components/Canvas.js";
import WingButton from "../../Components/wingButton.js";
import sendToKitchen from "./createOrder.js";
import getOrders from "../BoH/getOrders.js";
import updateOrderState from "../BoH/setOrders.js";
import completeOrder from "./completeOrder.js";

const FoH = () => {
  const [orders, setOrders] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

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

  useEffect(() => {
    const detailsElements = document.querySelectorAll("details");
    detailsElements.forEach((details) => {
      details.addEventListener("toggle", (event) => {
        if (details.open) {
          detailsElements.forEach((el) => {
            if (el !== details) {
              el.removeAttribute("open");
            }
          });
        }
      });
    });
  }, [orders]);

  return (
    <div className="h-screen w-screen">
      <h1>
        {lastCheckTime
          ? `Looked for new orders at ${lastCheckTime.toLocaleTimeString()}`
          : "Waiting for first check..."}
      </h1>
      <details open={isNewOrderOpen} onToggle={() => setIsNewOrderOpen(!isNewOrderOpen)}>
        <summary className="text-2xl font-bold justify-center">{isNewOrderOpen ? "Hide Notepad" : "New Order"}</summary>
        {/* <Canvas width={370} height={650} /> */}
        <WingButton />
        <button
          className="large-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => clearCanvas()}
        >
          Clear
        </button>
        <button
          className="large-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
          onClick={() => saveImage()}
        >
          Send to Kitchen
        </button>
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
                padding: "10px",
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