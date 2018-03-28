const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const io = require("socket.io")(server)

app.use(express.static(__dirname + "/../website"))
app.use("/webapp", express.static(__dirname + "/../webApp/PongWebApp"))
app.use("/dots", express.static(__dirname + "/../dots"))

app.get("/events", function(req, res){
	console.log("Refreshing raw API data")
	http.get("http://stadspodium-rotterdam.nl/wp-json/tribe/events/v1/events?start_date=2017-03-13%2000:59:00", sRes => {
		sRes.setEncoding("utf8")
		let body = ""

		sRes.on("data", data => {
			body += data
		})

		sRes.on("end", () => {
			let json = JSON.parse(body)
			let output = []

			console.log("Parsing API data")

			for (let event of json["events"]) {
				if (event.id == 2481) continue

				output.push({
					"id": event.id,
					"name": event.title,
					"start": event.start_date_details
				})
			}

			res.send(output)
		})
	})
})


var l_points = 0;
var r_points = 0;

function declareWinner(){

	if(l_points > r_points)
	{
		gameString = "P1 WINS!";
	}
	else if(l_points == r_points)
	{
		gameString = "DRAW!";
	}
	else
	{
		gameString = "P2 WINS!";
	}
}

function startTimer(duration) {
	var minutes = 5;
	var seconds = 0;
	setInterval(function () {
		if (seconds == 0) {
			seconds = 59
			minutes--
		}
		else {
			seconds--
		}

		if (minutes == 0 && seconds < 1) {
			return declareWinner();
		}

		format_minutes = minutes < 10 ? "0" + minutes : minutes;
		format_seconds = seconds < 10 ? "0" + seconds : seconds;

		gameString = format_minutes + ":" + format_seconds;

		if (minutes < 0) {
			declareWinner();
		}
		io.sockets.emit("gameString", gameString)
	}, 1000);
}

io.on("connection", function(socket) {
	let clientType = false

	socket.on("hello", (type) => {
		clientType = type
		console.log("Socket from ", clientType, " type accepted")
	})

	socket.on("positionUpdate", (data) => {
		console.log(data);
		l_points = data.p.l;
		r_pointa = data.p.r;
		io.sockets.emit("positionUpdate", data)
	})

	socket.on("setCountdown", (data) => {
		io.sockets.emit("setCountdown", data)
	})

	socket.on("switchStatus", (data) => {
		io.sockets.emit("switchStatus", data)

	})

	socket.on("disconnect", () => {
		console.log("Socket from ", clientType, " type lost")
	})

})

server.listen(4200)

console.log("Server running on http://localhost:4200")
