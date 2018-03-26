var socket = io();
socket.on("connect", function() {
    console.log("Connected to host");

    socket.emit("hello", "webApp")
})