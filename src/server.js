import path from "path";
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
import router from "./routes";
import DBConnect from "./config/db";
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 5001;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(router);
DBConnect();

// base
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello there" });
});

// listen
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
