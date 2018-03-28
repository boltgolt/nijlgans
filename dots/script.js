var socket = io();

socket.on("positionUpdate", function(data) {
	let screenHeight = window.innerHeight * 0.7
	let screenWidth = window.innerHeight * 1

	let batHeight = window.innerHeight * 0.2
	let ballSize = window.innerHeight * 0.05

	if (data.l == -60) data.l = -200
	if (data.r == -60) data.r = -200

	document.getElementById("left").style.top = ((data.l / 300) * screenHeight) - (batHeight / 2) + "px"
	document.getElementById("right").style.top = ((data.r / 300) * screenHeight) - (batHeight / 2) + "px"

	document.getElementById("ball").style.top = ((data.b.y / 300) * screenHeight) - (ballSize / 2) + "px"
	document.getElementById("ball").style.left = ((data.b.x / 400) * screenWidth) - (ballSize / 2) + "px"

	console.log(data.l);
	console.log(data.r / 300);
})
