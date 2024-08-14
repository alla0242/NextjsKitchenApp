'use client';
import { useState } from "react";
import run from "./test";

function AxiosTest() {
  const [dbResults, setDbResults] = useState([]);

  const handleClick = async () => {
    try {
      const result = await run();
      console.log(result);
      console.log(result.images);
      setDbResults(result.images); // Assuming result.images contains the list of images
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <button onClick={handleClick}>Fetch One</button>
      <ul>
        {dbResults.map((image, index) => (
          <li key={index}>{image.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AxiosTest;