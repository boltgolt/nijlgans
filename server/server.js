const fs = require("fs")
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
	res.send([{"id":2488,"name":"Danssalons &#8211; elke zondag","start":{"year":"2017","month":"05","day":"28","hour":"14","minutes":"00","seconds":"00"}},{"id":2497,"name":"Foto-expositie ‘Leven in de Schaduw’ van Sacha de Boer","start":{"year":"2017","month":"06","day":"25","hour":"13","minutes":"00","seconds":"00"}},{"id":2504,"name":"Stadsmeditatie // Elke vrijdag bezinnen in het nieuwe Stadspark","start":{"year":"2017","month":"07","day":"07","hour":"12","minutes":"00","seconds":"00"}},{"id":2502,"name":"Kids Kick It!","start":{"year":"2017","month":"08","day":"02","hour":"13","minutes":"00","seconds":"00"}},{"id":2520,"name":"Verhalenfontein voor kinderen","start":{"year":"2017","month":"08","day":"05","hour":"00","minutes":"00","seconds":"00"}},{"id":2523,"name":"Fit in het nieuwe Stadspark / elke zaterdag","start":{"year":"2017","month":"08","day":"05","hour":"10","minutes":"00","seconds":"00"}},{"id":2517,"name":"Rotterdamse Roze Picknick","start":{"year":"2017","month":"08","day":"20","hour":"12","minutes":"30","seconds":"00"}},{"id":2514,"name":"Brunchconcert","start":{"year":"2017","month":"09","day":"24","hour":"12","minutes":"30","seconds":"00"}}])


	// http.get("http://stadspodium-rotterdam.nl/wp-json/tribe/events/v1/events?start_date=2017-03-13%2000:59:00", sRes => {
	// 	sRes.setEncoding("utf8")
	// 	let body = ""
    //
	// 	sRes.on("data", data => {
	// 		body += data
	// 	})
    //
	// 	sRes.on("end", () => {
	// 		let json = JSON.parse(body)
	// 		let output = []
    //
	// 		console.log("Parsing API data")
    //
	// 		for (let event of json["events"]) {
	// 			if (event.id == 2481) continue
    //
	// 			output.push({
	// 				"id": event.id,
	// 				"name": event.title,
	// 				"start": event.start_date_details
	// 			})
	// 		}
    //
	// 		res.send(output)
    //
	// 		try {
	// 			let string = ""
    //
	// 			for (event of output) {
	// 				if (event.id == 2488) continue
    //
	// 				string += event.name.split("/")[0].trim() + " - " + event.start.day + "/" + event.start.month + "/2018          "
	// 			}
    //
	// 			fs.writeFileSync("../tracking/vars/marq", string, {encoding: 'utf8', flag: 'w'})
	// 		} catch (e) {}
	// 	})
	// })
})


var l_points = 0;
var r_points = 0;


function declareWinner(){
	if (l_points > r_points) {
		gameString = "P1 WINS!";
	}
	else if (l_points < r_points) {
		gameString = "P2 WINS!";
	}
	else {
		gameString = "DRAW!";
	}

	io.sockets.emit("gameString", gameString)
}

var interval

function startTimer() {
	var minutes = 1;
	var seconds = 30;
	interval = setInterval(function () {
		if (seconds == 0) {
			seconds = 59
			minutes--
		}
		else {
			seconds--
		}

		if (minutes == 0 && seconds < 1) {
			clearInterval(interval);
			declareWinner();
			io.sockets.emit("forceShutdown")

			setTimeout(function () {
				io.sockets.emit("switchStatus", "mainMenu")
			}, 3000)

			return
		}

		format_minutes = minutes < 10 ? "0" + minutes : minutes;
		format_seconds = seconds < 10 ? "0" + seconds : seconds;

		gameString = format_minutes + ":" + format_seconds;

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
		// console.log(data);
		l_points = data.p.l;
		r_pointa = data.p.r;
		io.sockets.emit("positionUpdate", data)
	})

	socket.on("setCountdown", (data) => {
		io.sockets.emit("setCountdown", data)
	})

	socket.on("switchStatus", (data) => {
		console.log(data);
		io.sockets.emit("switchStatus", data)

		if (data == "game") {
			startTimer()
		} else {
			io.sockets.emit("forceShutdown")
			clearInterval(interval);
		}
	})

	socket.on("disconnect", () => {
		console.log("Socket from ", clientType, " type lost")
	})

})

server.listen(80)

console.log("Server running on http://localhost:4200")
