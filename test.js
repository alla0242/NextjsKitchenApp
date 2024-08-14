var axios = require("axios");
var data = JSON.stringify({
  collection: "pastOrders",
  database: "DrawingApp",
  dataSource: "DrawingApp",
  projection: {
    _id: 1,
  },
});
var config = {
  method: "post",
  url: "https://data.mongodb-api.com/app/data-jywkgzt/endpoint/data/v1/action/find",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key":
      "pGhXRQXyJuYVoVGCEKZ820en3nlE6h4NINZP1EfBGy8PMCLCNl9JYhTeYhbxilMj",
  },
  data: data,
};
axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
