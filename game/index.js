const socket = require("socket.io-client")("http://localhost:4200")
const fs = require("fs")

function refreshTracking() {
	left = fs.readFileSync("../tracking/vars/left_y", "utf8")
	right = fs.readFileSync("../tracking/vars/right_y", "utf8")
}

let left
let right

refreshTracking()

console.log(left);

socket.on("connect", function() {
	console.log("Connected to socket")

	socket.emit("hello", "game")

	setInterval(function () {
		old_l = left
		old_r = right

		refreshTracking()

		console.log(old_l != left || old_r != right);

		if (old_l != left || old_r != right) {
			socket.emit("positionUpdate", {
				l: left,
				r: right
			})
		}
	}, 1000)


})
