// Set canvas size to 4:3 adn resize the main elements
var c = document.getElementById("gameCanvas");

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height = width*0.75;

var headerHeight = height/3;
var footerHeight = height*2/3

document.getElementById("wrapperHeader").style.height = headerHeight + "px";
var canvasCount = document.getElementsByClassName("wrapperCanvas");
for (i = 0; i < canvasCount.length; i++) {
    canvasCount[i].style.height = height + "px";
    canvasCount[i].style.display = "none";
} 
var footerCount = document.getElementsByClassName("wrapperFooter");
for (i = 0; i < footerCount.length; i++) {
    footerCount[i].style.height = footerHeight + "px";
    footerCount[i].style.display = "none";
} 

c.width = width;
c.height = height;

// App menus
var appStatus = mainMenu;
var gameMode = 0;

switch (appStatus) {
    case mainMenu:
        document.getElementById("mainMenu").style.display = "flex";
        document.getElementById("playButton").style.display = "flex";
        document.getElementById("playButton").addEventListener("click", function(){
            appStatus = chooseMode;
            console.log("test");
        }, false)
        break;

    case chooseMode:
        document.getElementById("chooseMode").style.display = "flex";
        document.getElementById("gamemodeButtons").style.display = "flex";
        document.getElementById("classic").addEventListener("click", function(){
            appStatus = game;
            gameMode = 0;
            console.log("test");
        }, false)
        document.getElementById("coop").addEventListener("click", function(){
            appStatus = game;
            gameMode = 1;
            console.log("test");
        }, false)
        break;

    case game:
        document.getElementById("game").style.display = "flex";
        document.getElementById("playButton").style.display = "flex";
        break;

    case nameInput:
        document.getElementById("nameInput").style.display = "flex";
        document.getElementById("playButton").style.display = "flex";
        break;

    case scoreMenu:
        document.getElementById("scoreMenu").style.display = "flex";
        document.getElementById("playButton").style.display = "flex";
        document.getElementById("playButton").addEventListener("click", function(){
            appStatus = chooseMode;
            console.log("test");
        }, false)
        break;

    default:
        break;
}

// Game variables
var xP1 = 0;
var yP1 = 50;

var xP2 = width-10;
var yP2 = 120;

var xBall = 150;
var yBall = 100;

var widthP = width/36;
var heightP = widthP*5;
var sizeBall = widthP*1.5;
var sizeWall = widthP;
var xWall = width/2-sizeWall/2

var gameTimer = 0;
var gameScore = 0;
var scoreP1 = 0;
var scoreP2 = 0;

// Draw game elements
var ctx = c.getContext("2d");

ctx.fillStyle="#FFFFFF"
ctx.strokeStyle="#000000"
ctx.font = "30px FFFForward"

ctx.fillRect(xP1,yP1,widthP,heightP);
ctx.stroke();

ctx.fillRect(xP2,yP2,widthP,heightP);
ctx.stroke();

ctx.fillRect(xBall,yBall,sizeBall,sizeBall);
ctx.stroke();

for (var i = 0; i < height/10; i++) {
    ctx.fillRect(xWall,i*sizeWall*1.5-sizeWall*0.5,sizeWall,sizeWall);
    ctx.stroke();
}

ctx.fillText(scoreP1,width/2-52,50);
ctx.fillText(scoreP2,width/2+30,50);

// Countdown
var countdown = 0;

if (countdown > 0) {
    ctx.font = "100px FFFForward"
    ctx.fillText(countdown,width/2-30,height/2+50);
    ctx.strokeText(countdown,width/2-30,height/2+50);
}