"use client";
import React, { useState, useEffect } from "react";
import Canvas from "../../Components/Canvas.js";
import FohButton from "../../Components/FohButton.js";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FoH({ onOrderFinished }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [blink, setBlink] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prevBlink) => !prevBlink);
    }, 1000);

    return () => clearInterval(blinkInterval);
  }, []);

  function fetchOrders() {
    console.log("Fetching latest images...");
    axios.post("/api/getLatestImages")
      .then((response) => {
        console.log("Response from /api/getLatestImages:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Data from /api/getLatestImages:", data);
        if (data.success && data.documents) {
          setOrders(data.documents);
        } else {
          console.log("No orders found");
        }
      })
      .catch((error) => {
        console.error("Error fetching latest images:", error);
      });
  }

  function handleOrderClick(order) {
    setSelectedOrder(order);
  }

  function getOrderStyle(state) {
    if (state === "Ready for Pickup") {
      return blink ? { backgroundColor: "red" } : { backgroundColor: "white" };
    } else if (state === "Order at table") {
      return blink ? { backgroundColor: "blue" } : { backgroundColor: "white" };
    }
    return {};
  }

  function updateOrderState(orderId, newState) {
    console.log(`Updating order state for order ${orderId} to ${newState}...`);
    axios.post("/api/updateImageState", {
      id: orderId,
      state: newState,
      source: "FoH",
    })
      .then((response) => {
        console.log("Response from /api/updateImageState:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Data from /api/updateImageState:", data);
        if (data.success) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, state: newState } : order
            )
          );
        } else {
          console.error("Failed to update order state");
        }
      })
      .catch((error) => {
        console.error("Error updating order state:", error);
      });
  }

  function finishOrder(orderId) {
    const orderToFinish = orders.find((order) => order._id === orderId);
    if (!orderToFinish) return;

    const lastChangeTime = new Date();

    const createdTime = new Date(orderToFinish.timestamp);
    // Calculate the time difference in milliseconds
    const timeDifference = lastChangeTime - createdTime;

    // Ensure timeDifference is non-negative
    if (timeDifference < 0) {
      console.error("Last change time is earlier than created time");
      return;
    }

    // Convert milliseconds to total seconds
    const totalSeconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format the timeTaken string
    const timeTakenString = `it took ${minutes} minutes and ${seconds} seconds for the order to be completed`;

    console.log(`Finishing order ${orderId}...`);
    axios.post("/api/finishOrder", {
      id: orderId,
      timeTaken: timeTakenString,
    })
      .then((response) => {
        console.log("Response from /api/finishOrder:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Data from /api/finishOrder:", data);
        if (data.success) {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== orderId)
          );
          onOrderFinished(); // Notify BoH to refresh
        } else {
          console.error("Failed to finish order");
        }
      })
      .catch((error) => {
        console.error("Error finishing order:", error);
      });
  }

  function handleCreateOrder() {
    setShowOrderForm(true);
  }

  function handleSendToKitchen() {
    setShowOrderForm(false);
  }

  return (
    <>
      <div>
        {!showOrderForm && (
          <button onClick={handleCreateOrder} className="large-button">
            Create Order
          </button>
        )}
        {showOrderForm && (
          <div>
            <Canvas width={400} height={700} />
            <FohButton
              width={200}
              height={200}
              onSendToKitchen={handleSendToKitchen}
            />
          </div>
        )}
      </div>
      <div>
        <h2>Current Orders</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order, index) => (
              <li
                key={order._id}
                style={{ ...getOrderStyle(order.state), listStyle: "none" }}
              >
                <details>
                  <summary
                    onClick={() => handleOrderClick(order)}
                    style={{ cursor: "pointer" }}
                  >
                    Order {index + 1}: State: {order.state}, Time:{" "}
                    {new Date(order.timestamp).toLocaleString()}
                  </summary>
                  {selectedOrder && selectedOrder._id === order._id && (
                    <div>
                      <img
                        src={order.imageData}
                        alt="Order"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                      {order.state !== "Order at table" && (
                        <button
                          onClick={() =>
                            updateOrderState(order._id, "Order at table")
                          }
                        >
                          Set to Order at Table
                        </button>
                      )}
                      {order.state === "Order at table" && (
                        <button onClick={() => finishOrder(order._id)}>
                          Finish Order
                        </button>
                      )}
                    </div>
                  )}
                </details>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </>
  );
}