const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const staticDir = path.join(__dirname, "public");
const SocketHandler = require("./socket");
const userRouter = require("./src/routers/user");
const dotenv = require("dotenv");
dotenv.config();
require("./src/db/connect");
const SocketHandler2 = require("./src/classes/gameListeners");
const botTest = require("./src/tests/gameplay");

const app = express();
app.use(express.static(staticDir));
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(userRouter);

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;
//SocketHandler(io);

new SocketHandler2(io);

botTest();

app.get("/", (req, res) => {
  res.send("index", { roomName: req.query.roomName });
});

server.listen(port, () => {
  console.log("Server is up");
});
