const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const staticDir = path.join(__dirname, "public");
const SocketHandler = require("./socket");
require("./src/db/connect");

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

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;
SocketHandler(io);

app.get("/", (req, res) => {
	res.send("index", { roomName: req.query.roomName });
});
server.listen(port, () => {
	console.log("Server is up");
});
