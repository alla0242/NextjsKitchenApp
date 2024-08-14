'use client';
import { useState } from "react";
import run from "./test";

function AxiosTest() {
  const [dbResults, setDbResults] = useState([]);

  const handleClick = async () => {
    try {
      const result = await run();
      setDbResults(result.databases); // Assuming result.databases contains the list of databases
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <button onClick={handleClick}>Fetch One</button>
      <ul>
        {dbResults.map((db, index) => (
          <li key={index}>{db.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AxiosTest;