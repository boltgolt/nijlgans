let socket = io()

let screenHeight = window.innerHeight * 0.7
let screenWidth = window.innerHeight * 1

let batHeight = window.innerHeight * 0.2
let ballSize = window.innerHeight * 0.05

socket.on("positionUpdate", function(data) {
	console.log(data);
	if (data.l == -60) data.l = -200
	if (data.r == -60) data.r = -200

	document.getElementById("left").style.top = ((data.l / 300) * screenHeight) - (batHeight / 2) + "px"
	document.getElementById("right").style.top = ((data.r / 300) * screenHeight) - (batHeight / 2) + "px"

	document.getElementById("ball").style.top = ((data.b.y / 300) * screenHeight) - (ballSize / 2) + "px"
	document.getElementById("ball").style.left = ((data.b.x / 400) * screenWidth) - (ballSize / 2) + "px"

	console.log(data.l);
	console.log(data.r / 300);
})

socket.on("setCountdown", function(num) {
	document.getElementById("ball").style.top = ((150 / 300) * screenHeight) - (ballSize / 2) + "px"
	document.getElementById("ball").style.left = ((200 / 400) * screenWidth) - (ballSize / 2) + "px"

	document.getElementById("ball").style.opacity = .4

	setTimeout(function () {
		document.getElementById("ball").style.opacity = 1
	}, 500)
})

socket.on("connect", function() {
	document.body.style.background = "#117101"
})

socket.on("disconnect", function() {
	document.body.style.background = "#000"
})
