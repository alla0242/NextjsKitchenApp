"use client";
import React, { useState, useEffect } from "react";
import Canvas from "../../Components/Canvas.js";
import { sendToKitchen, clearCanvas } from "./createOrder.js";
import getOrders from "../BoH/getOrders.js";
import updateOrderState from "../BoH/setOrders.js";

const uri = process.env.MONGODB_URI;

const FoH = () => {
  const [orders, setOrders] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);

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
    <div>
      <h1>Front of House</h1>
      <Canvas />
      {orders.length > 0 ? (
        <div>
          {orders.map((order, index) => (
            <div key={index}>
              <p>Order ID: {order.id}</p>
              <p>State: {order.state}</p>
              <button onClick={() => updateOrderState(order.id, "Completed")}>
                Mark as Completed
              </button>
              <button onClick={() => sendToKitchen(order.id)}>
                Send to Kitchen
              </button>
              <button onClick={() => clearCanvas()}>
                Clear Canvas
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