"use client";
import React, { useState, useEffect } from "react";
import Canvas from "../../Components/Canvas.js";
import FohButton from "../../Components/FohButton.js";

  const uri = process.env.MONGODB_URI;


const FoH = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch(`${uri}/api/getOrders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  async function updateOrderState(id, newState) {
    const changeTime = new Date();
    const data = {
      collection: "orders",
      database: "DrawingApp",
      dataSource: "DrawingApp",
      filter: { _id: new ObjectId(id) },
      update: {
        $set: {
          state: newState,
          lastChangeTime: changeTime,
          lastChangeSource: "FoH",
        },
      },
    };

    try {
      const response = await fetch(`${uri}/api/updateOrderState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        // Update the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  state: newState,
                  lastChangeTime: changeTime,
                  lastChangeSource: "FoH",
                }
              : order
          )
        );
        console.log(`Order ${id} state updated to ${newState}`);
      } else {
        console.error("Failed to update order state");
      }
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  }

  return (
    <div>
      <h1>Front of House</h1>
      <Canvas />
      <FohButton />
      {orders.length > 0 ? (
        <div>
          {orders.map((order, index) => (
            <div key={index}>
              <p>Order ID: {order.id}</p>
              <p>State: {order.state}</p>
              <button onClick={() => updateOrderState(order.id, "Completed")}>
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