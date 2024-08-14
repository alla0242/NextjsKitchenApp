// import { MongoClient } from "mongodb";


// async function run() {

// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     console.log("Connected successfully to MongoDB");
//   } catch (error) {
//     console.error("Failed to connect to MongoDB", error);
//   }
// }
// const AxiosTest = () => {
//   return (
//     <div>
//       <h1>Test</h1>
//       <button onClick={_____}>Fetch One</button>
//       FUUUUCK
//     </div>
//   );
// };

// export default AxiosTest;
'use client';
const { MongoClient } = require("mongodb");
import run from "./test";


function AxiosTest() {
 
  return (
    <div>
      <h1>Test</h1>
      <button onClick={run}>Fetch One</button>
      FUUUUCK
    </div>
  );
}


export default AxiosTest;
