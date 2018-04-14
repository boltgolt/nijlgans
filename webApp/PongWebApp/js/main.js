// Set canvas size to 4:3 and resize the main elements based on viewport width
var c = document.getElementById("gameCanvas");

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height = width*0.75;

c.width = width;
c.height = height;

var headerHeight = height/3;
var footerHeight = height*2/3 - 80 // -80 for bottom offset, adjust until footer is visible

// appStatus will define what screen is showing
var appStatus = "mainMenu";

// This function handles the different screens that can show
function updateScreen() {
    // Give all the elements the right size and set display to none
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
        // Show the right elements for the screen in each case
        case "mainMenu":
            document.getElementById("mainMenu").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            document.getElementById("footerContent").innerHTML = "play";
            document.getElementById("playButton").onclick = function(){
                var i = document.body

                if (i.requestFullscreen) {
                    i.requestFullscreen();
                } else if (i.webkitRequestFullscreen) {
                    i.webkitRequestFullscreen();
                } else if (i.mozRequestFullScreen) {
                    i.mozRequestFullScreen();
                } else if (i.msRequestFullscreen) {
                    i.msRequestFullscreen();
                }

                scoreP1 = 0;
                scoreP2 = 0
                console.log("menu");
                socket.emit("switchStatus","chooseMode")
            }
            break;

        case "chooseMode":
            document.getElementById("chooseMode").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            document.getElementById("footerContent").innerHTML = "classic";
            document.getElementById("playButton").onclick = function(){
                console.log("choose");
                socket.emit("switchStatus","game")
            }
            break;

        case "game":
            document.getElementById("game").style.display = "flex";
            document.getElementById("playButton").style.display = "flex";
            document.getElementById("playButton").onclick = function(){
                console.log("game");
                socket.emit("switchStatus","mainMenu")
            }
            break;
    }
}

// Updates the screen when loaded
document.addEventListener("DOMContentLoaded", function(event) {
    socket.on("switchStatus", function(status) {
        appStatus = status;
        updateScreen();
    });
});
updateScreen();

fetch('/events')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
        myJson.length = 5;
        var arrayLength = myJson.length;
        for (var i = 0; i < arrayLength; i++) {
            var p = document.createElement("p");
            var apiName = myJson[i].name;
            var smallerName = apiName.substr(0, 15);
            p.className = "apiData"
            p.innerHTML = smallerName + "..."+ " //datum: " + myJson[i].start.day + "-" + myJson[i].start.month + "-2018" + " //tijd: " + myJson[i].start.hour + ":00"
            document.getElementById("holder").appendChild(p);
    }
  });

/*fetch('/events')
.then(function(response) {
  return response.json();
})
.then(function(myJson) {
  console.log(myJson);
      var arrayLength = myJson.length;
      for (var i = 0; i < arrayLength; i++) {
          var p = document.createElement("p");
          p.className = "center-align light apiName"
          p.innerHTML = myJson[i].name
          document.getElementById("agenda").appendChild(p);
          var p = document.createElement("p");
          p.className = "center-align light apiDate"
          p.innerHTML =  myJson[i].start.day + '-' + myJson[i].start.month + '-2018'
          document.getElementById("agenda").appendChild(p);
          var p = document.createElement("p");
          p.className = "center-align light apiTime"
          p.innerHTML =  myJson[i].start.hour + ':00'
          document.getElementById("agenda").appendChild(p);
  }
});*/
