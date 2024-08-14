import axios from "axios";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const config = {
    method: "post",
    url: "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/find",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.MONGODB_API_KEY,
    },
    data: body,
  };

  try {
    const response = await axios(config);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in proxy:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
