const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", require("./Routes/auth"));
app.use("/user", require("./Routes/User"));
app.use("/post", require("./Routes/Post"));
const URL = process.env.DATA_BASE_URL;

mongoose
  .connect(URL)
  .then(() => console.log("connected data base"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("successfully server "));
