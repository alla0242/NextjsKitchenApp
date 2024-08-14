'use client';
import { useState } from "react";
import getImages from "./test";

function AxiosTest() {
  const [dbResults, setDbResults] = useState([]);

  const handleClick = async () => {
    try {
      const result = await getImages();
      console.log(`results`,result);
      setDbResults(result); // Assuming result.images contains the list of images
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <button onClick={handleClick}>Fetch One</button>
      <ul>
        {console.log(`dbResults`, dbResults)}
        {dbResults.map((image, index) => (
          <li key={index}>
            {image.state}
            <img
              key={index}
              src={image.imageData}
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