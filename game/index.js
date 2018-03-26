var socket = require("socket.io-client")("http://localhost:4200")

socket.on("connect", function() {
	console.log("Connected to socket")

	socket.emit("hello", "game")
})
