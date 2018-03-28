var socket = io();

socket.on("connect", function() {
    console.log("Connected to host");

    socket.emit("hello", "webApp")
})

socket.on("positionUpdate", function(data) {
    yP1 = data.l * (height / 300) - (heightP * 0.5)
    yP2 = data.r * (height / 300) - (heightP * 0.5)

    xBall = data.b.x * (height / 300) - (sizeBall * 0.5)
    yBall = data.b.y * (height / 300) - (sizeBall * 0.5)

    scoreP1 = data.p.l
    scoreP2 = data.p.r
})

socket.on("setCountdown", function(data) {
    console.log("re");
    countdown = data
})

socket.on("gameString", function(string) {
    document.getElementById("footerContent").innerHTML = string;
})