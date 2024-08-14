'use client';
import { useState } from "react";
import getOrders from "./test";

function AxiosTest() {
  const [liveOrders, setLiveOrders] = useState([]);

  const handleClick = async () => {
    try {
      const orders = await getOrders();
      setLiveOrders(orders); // Assuming result.images contains the list of images
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <button onClick={handleClick}>Fetch One</button>
      <ul>
        {console.log(`liveOrders`, liveOrders)}
        {liveOrders.map((order, index) => (
          <li key={index}>
            {order.state}
            {order.timestamp.toString()}
            {order.lastChangeTime.toString()}
            {order.lastChangeSource}
            <img
              key={index}
              src={order.imageData}
              width={200}
              height={200}
            ></img>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AxiosTest;