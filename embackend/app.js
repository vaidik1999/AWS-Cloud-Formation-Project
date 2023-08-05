require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const routes = require("./routes/index");
const port = 3000;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});
