"use client";
import React, { useState, useEffect } from "react";
import Canvas from "../../Components/Canvas.js";
import sendToKitchen from "./createOrder.js";
import getOrders from "../BoH/getOrders.js";
import updateOrderState from "../BoH/setOrders.js";




const FoH = () => {
  const [orders, setOrders] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);

    async function handleUpdateOrderState(id, newState) {
      try {
        await updateOrderState(id, newState);
        await fetchLatestImages(); // Refresh orders after updating state
      } catch (error) {
        console.error("Error updating order state:", error);
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
    <div>
      <h1>
        {lastCheckTime
          ? `Looked for new orders at ${lastCheckTime.toLocaleTimeString()}`
          : "Waiting for first check..."}
      </h1>
      <h2>Front of House</h2>
      <Canvas />
      <button onClick={() => clearCanvas()}>Clear</button>
      <button onClick={() => sendToKitchen()}>Send to Kitchen</button>
      {orders.length > 0 ? (
        <div>
          {orders.map((order, index) => (
            <div key={index}>
              <p>State: {order.state}</p>
              <button onClick={() => handleUpdateOrderState(order.id, "Completed")}>
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders available</p>
      )}
    </div>
  );
};

export default FoH;