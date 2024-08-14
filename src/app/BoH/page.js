"use client";
import React, { useState, useEffect } from "react";
import getOrders from "./getOrders";
import updateOrderState from "./setOrders";

const BoH = () => {
  const [orders, setOrders] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  useEffect(() => {
    fetchLatestImages();
    const intervalId = setInterval(fetchLatestImages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
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

  async function handleUpdateOrderState(id, newState) {
    try {
      await updateOrderState(id, newState);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                state: newState,
                lastChangeTime: new Date(),
                lastChangeSource: "BoH",
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  }

  return (
    <div>
      <h1>
        {lastCheckTime
          ? `Looked for new orders at ${lastCheckTime.toLocaleTimeString()}`
          : "Waiting for first check..."}
      </h1>
      {orders.length > 0 ? (
        <div>
          {orders.map((order, index) => (
            <div
              key={index}
              style={{
                margin: "20px 0",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <img
                src={order.imageData}
                alt={`Order ${index + 1}`}
                width={200}
                height={200}
                style={{ margin: "10px" }}
              />
              <p>Sent at: {new Date(order.timestamp).toLocaleString()}</p>
              <p>Current State: {order.state}</p>
              <p>Last Change Source: {order.lastChangeSource}</p>
              <p>Last Change Time: {new Date(order.lastChangeTime).toLocaleString()}</p>
              <button
                onClick={() => handleUpdateOrderState(order._id, "Ready for Pickup")}
                disabled={order.state === "Ready for Pickup"}
              >
                Mark as Ready for Pickup
              </button>
              <button
                onClick={() => handleUpdateOrderState(order._id, "Order at table")}
                disabled={order.state === "Order at table"}
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