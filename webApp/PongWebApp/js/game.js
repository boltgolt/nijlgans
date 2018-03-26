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

var countdown = 0;

// Draw game elements
var ctx = c.getContext("2d");

ctx.fillStyle="#FFFFFF"
ctx.strokeStyle="#000000"

for (var i = 0; i < height/10; i++) {
    ctx.fillRect(xWall,i*sizeWall*1.5-sizeWall*0.5,sizeWall,sizeWall);
    ctx.stroke();
}

// Animation frame
var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps = 60;
var fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

function animate() {

    // request another frame

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        ctx.font = "30px FFFForward"

        ctx.fillRect(xP1,yP1,widthP,heightP);
        ctx.stroke();

        ctx.fillRect(xP2,yP2,widthP,heightP);
        ctx.stroke();

        ctx.fillRect(xBall,yBall,sizeBall,sizeBall);
        ctx.stroke();

        ctx.fillText(scoreP1,width/2-52,50);
        ctx.fillText(scoreP2,width/2+30,50);

        // Countdown
        if (countdown > 0) {
            ctx.font = "100px FFFForward"
            ctx.fillText(countdown,width/2-30,height/2+50);
            ctx.strokeText(countdown,width/2-30,height/2+50);
        }
    }
}