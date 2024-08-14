'use client';
import run from "./test";

function AxiosTest() {
  return (
    <div>
      <h1>Test</h1>
      <button onClick={async () => {
        try {
          console.log("Fetching data...");
          const result = await run();
          console.log("Data fetched successfully:", result); // Log the result of run
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }}>Fetch One</button>
      FUUUUCK
    </div>
  );
}

export default AxiosTest;