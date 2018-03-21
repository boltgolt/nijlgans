/////**
//// * Created by Martijn on 19-3-2018.
//// */


//app.js

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/../website'));

server.listen(4200);

