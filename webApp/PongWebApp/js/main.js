// Set canvas size to 4:3 adn resize the main elements
var c = document.getElementById("gameCanvas");

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height = width*0.75;

var headerHeight = height/3;
var footerHeight = height*2/3

var appStatus = "mainMenu";
//var gameMode = 0; Only 1 gamemode for now

c.width = width;
c.height = height;

function updateScreen() {
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

    // App menus
    switch (appStatus) {
        case "mainMenu":
            document.getElementById("mainMenu").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            document.getElementById("playButton").addEventListener("click", function(){
                console.log("test");
                socket.emit("switchStatus","chooseMode")
            }, false)
            break;

        case "chooseMode":
            document.getElementById("chooseMode").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            document.getElementById("footerContent").innerHTML = "classic";
            document.getElementById("playButton").addEventListener("click", function(){
                //gameMode = 0;
                console.log("test");
                socket.emit("switchStatus","game")
            }, false)
            break;

        case "game":
            document.getElementById("game").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            break;

        case "nameInput": //canceled
            document.getElementById("nameInput").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            break;

        case "scoreMenu": //canceled
            document.getElementById("scoreMenu").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            document.getElementById("playButton").addEventListener("click", function(){
                console.log("test");
                socket.emit("switchStatus","mainMenu")
            }, false)
            break;

        default:
            break;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    socket.on("switchStatus", function(status) {
        appStatus = status;
        updateScreen();
    });
});
updateScreen();