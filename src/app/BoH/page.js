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
      await fetchLatestImages(); // Refresh orders after updating state
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  }

  return (
    <div className="flex-col min-h-screen flex-col">
      <h1>
        {lastCheckTime
          ? `Looked for new orders at ${lastCheckTime.toLocaleTimeString()}`
          : "Waiting for first check..."}
      </h1>
      {orders.length > 0 ? (
        <div className="flex flex-wrap">
          {orders.map((order, index) => (
            <div
              className="flex flex-col items-center max-w-fit"
              key={index}
              style={{
                margin: "20px 0",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <img
                src={order.imageData}
                alt={`Order ${index + 1}, ID : ${order._id}`}
                width={200}
                height={200}
                style={{ margin: "10px" }}
                className="bg-white"
              />
              <p>Sent at: {new Date(order.timestamp).toLocaleString()}</p>
              <p>Current State: {order.state}</p>
              {order.state !== "Ready for Pickup" && (
                <button
                  className="large-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() =>
                    handleUpdateOrderState(order._id, "Ready for Pickup")
                  }
                >
                  Mark as Ready for Pickup
                </button>
              )}
              {order.state !== "Order at table" && (
                <button
                  className="large-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                  onClick={() =>
                    handleUpdateOrderState(order._id, "Order at table")
                  }
                >
                  Mark as Order at Table
                </button>
              )}
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