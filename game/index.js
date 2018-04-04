const socket = require("socket.io-client")("http://localhost:4200")
const fs = require("fs")


function refreshTracking() {
	left = parseInt(fs.readFileSync("../tracking/vars/left_y", "utf8"))
	right = parseInt(fs.readFileSync("../tracking/vars/right_y", "utf8"))
}

function startIdleLoop() {
	idlePassLoop = setInterval(function () {
		refreshTracking()

		socket.emit("positionUpdate", {
			l: left,
			r: right,
			b: {
				x: ball.x,
				y: ball.y
			},
			p: {
				l: points.l,
				r: points.r
			}
		})
	}, 17)
}

function respawnBall() {
	ball.x = 200
	ball.y = 150

	ball.d.x = Math.floor(Math.random() * 1.2) + 2
	ball.d.y = Math.floor(Math.random() * 1.5) + 1

	if (Math.random() < 0.5) {
		ball.d.x *= -1
	}
	if (Math.random() < 0.5) {
		ball.d.y *= -1
	}
}

function doDownCount() {
	startIdleLoop()

	setTimeout(function () {
		respawnBall()
		socket.emit("setCountdown", 3)
	}, 500)
	setTimeout(function () {
		socket.emit("setCountdown", 2)
	}, 1500)
	setTimeout(function () {
		socket.emit("setCountdown", 1)
	}, 2500)
	setTimeout(function () {
		socket.emit("setCountdown", 0)
	}, 3500)
	setTimeout(function () {
		if (forceShutdown) {
			forceShutdown = false
		}
		else {
			clearInterval(idlePassLoop)
			autoloop = true
			tick()
		}
	}, 4000)
}

let batHeight = 70
let ballHeight = 17
let left
let right
let countdown = 0
let ball = {x: 0, y: 0, d: {x: 0, y: 0}}
let points = {l: 0, r: 0}
let winner = 0;
let autoloop = true
let forceShutdown = false
let idlePassLoop

refreshTracking()
respawnBall()

console.log(left);

socket.on("connect", function() {
	console.log("Connected to socket")

	socket.emit("hello", "game")
})

socket.on("forceShutdown", function() {
	forceShutdown = true
})

// Start the game if screens are in game mode
socket.on("switchStatus", function(data) {
	console.log(data);
	if (data == "game") {
		doDownCount()
		forceShutdown = false
		autoloop = true
	}
	else {
		autoloop = false
		points.l = 0
		points.r = 0
	}
})

function tick() {
	clearInterval(idlePassLoop)
	refreshTracking()

	ball.x += ball.d.x
	ball.y += ball.d.y

	if (ball.y < 8) {
		ball.y = 8
		ball.d.y *= -1
	}
	if (ball.y > 292) {
		ball.y = 292
		ball.d.y *= -1
	}

	if (ball.x < -50) {
		points.r++
		autoloop = false
		doDownCount()
	}
	if (ball.x > 450) {
		points.l++
		autoloop = false
		doDownCount()
	}

	if (ball.x > 10 && ball.x < 15) {
		if (ball.y - ballHeight / 2 > left - batHeight / 2 &&
			ball.y + ballHeight / 2 < left + batHeight / 2) {
				ball.x = ballHeight + 15
				ball.d.x *= -1
			}
	}
	if (ball.x > 380 && ball.x < 385) {
		if (ball.y - ballHeight / 2 > right - batHeight / 2 &&
			ball.y + ballHeight / 2 < right + batHeight / 2) {
				ball.x = 400 - ballHeight - 15
				ball.d.x *= -1
			}
	}

	socket.emit("positionUpdate", {
		l: left,
		r: right,
		b: {
			x: ball.x,
			y: ball.y
		},
		p: {
			l: points.l,
			r: points.r
		}
	})

	if (!autoloop) return

	setTimeout(function () {
		tick()
	}, 17)
}

startIdleLoop()
