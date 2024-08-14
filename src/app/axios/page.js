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
const { MongoClient } = require("mongodb");


function AxiosTest() {
  async function run() {
    const uri =
      "mongodb+srv://vercel-admin-user-66bcc8cb83ebb83e446851bb:hvBi8PHQ6sVd4Eeq@drawingapp.so9q8oz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
      await client.connect();
      console.log("Connected successfully to MongoDB");
      await listDatabases(client);
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    } finally {
      await client.close();
      console.log("Closed connection to MongoDB");
    }
  }


  async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  }

  return (
    <div>
      <h1>Test</h1>
      <button onClick={run}>Fetch One</button>
      FUUUUCK
    </div>
  );
}


export default AxiosTest;
