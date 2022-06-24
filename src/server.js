import path from "path";
const express = require("express");
import { createServer } from "http";
import { Server } from "socket.io";
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
import router from "./routes";
import DBConnect from "./config/db";
import connection from "./sockets";
require("dotenv").config();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;
const corsOption = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:3001",
  ],
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors(corsOption));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(router);
DBConnect();

io.on("connection", (socket) => connection(socket, io));

// base
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello there" });
});

// listen
httpServer.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
