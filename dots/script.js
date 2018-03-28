var socket = io();

socket.on("positionUpdate", function(data) {
	console.log(data);
	let batHeight = window.innerHeight * 0.10
	let ballSize = window.innerHeight * 0.10

	document.getElementById("left").style.top = ((data.l / 300) * batHeight) + "px"
	document.getElementById("right").style.top = ((data.l / 300) * batHeight) + "px"

	document.getElementById("ball").style.top = ((data.b.x / 300) * ballSize) + "px"
	document.getElementById("ball").style.left = ((data.b.y / 400) * ballSize) + "px"
})
