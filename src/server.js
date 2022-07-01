/* eslint-disable import/prefer-default-export */
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./routes";
import DBConnect from "./config/db";
import connection from "./sockets";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: [
            process.env.CLIENT_URL,
            "http://localhost:3000",
            "http://localhost:4000",
            "https://metrack.tech",
            "https://www.metrack.tech",
        ],
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 5000;

const corsOption = {
    credentials: true,
    origin: [
        "https://metrack.tech",
        "https://www.metrack.tech",
        "https://www.admin.metrack.tech",
        "https://admin.metrack.tech",
        "https://www.api.metrack.tech",
        "https://api.metrack.tech",
        "http://localhost:3000",
        "http://localhost:4000",
        "https://metrack.tech",
        "https://www.metrack.tech",
        "https://admin.metrack.tech",
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
