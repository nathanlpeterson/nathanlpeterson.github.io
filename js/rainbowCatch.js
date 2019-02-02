var maxX = 640; //document.width is obsolete
var maxY = 480; //document.height is obsolete


var keys = {};
//var gameOver = false;


function init(player1, player2, canvasWidth, canvasHeight) {
 
    maxX = canvasWidth;
    maxY = canvasHeight;
    keys = [];

    $(document).keydown(function (e) {
        keys[e.which] = true;
    });

    $(document).keyup(function (e) {
        delete keys[e.which];
    });

    //var stats = new Stats();
    //stats.domElement.style.position = 'absolute';
    //stats.domElement.style.right = '0px';
    //stats.domElement.style.top = '0px';
    //document.body.appendChild(stats.domElement);

    GameRC.initialize(player1, player2);

    GameRC.run = function () {
        setInterval(function () {
            GameRC.draw();
            GameRC.update();
            //Need code here!!!
            //if(gameOver===true) {return;}
            // Update fps counter
            //stats.update();
        }, 1000 / GameRC.fps);
    };

    GameRC.run();
};


var GameRC = {};

GameRC.fps = 50;

GameRC.initialize = function (player1, player2) {
    this.fallers = [];
    this.players = [];
    this.context = document.getElementById("c").getContext("2d");
    // Add 2 Players
    this.addPlayer(1, player1);
    this.addPlayer(2, player2);

    //Add Falling objects
    var i = 10;
    while (i--) this.addFaller();

    keys = [];
};

GameRC.draw = function () {
    //this.context.fillStyle = "#00FF00";
    //this.context.fillRect(0, 0, 750, 750);
    //this.context.clearRect(50, 50, maxX, maxY);
    var background = new Image();
    background.src = 'images/Background1.png';
    this.context.drawImage(background, 0, 0, maxX, maxY);

    for (var i = 0; i < this.players.length; i++) {
        this.players[i].draw(this.context);
    }
    for (var i = 0; i < this.fallers.length; i++) {
        this.fallers[i].draw(this.context);
    }
};

GameRC.update = function () {
    v = Math.round((this.players[0].v + this.players[1].v) / 2)
    d = Math.round(30 * maxX / 640);
    if (this.players[0].x - this.players[1].x > 0 && this.players[0].x - this.players[1].x < d  && Math.abs(this.players[0].y - this.players[1].y) < d) {
        this.players[0].x = this.players[0].x + v;
        this.players[1].x = this.players[1].x - v; //this.players[0].x - 30; //
    }
    else if (this.players[0].x - this.players[1].x < 0 && this.players[0].x - this.players[1].x > -1 * d  && Math.abs(this.players[0].y - this.players[1].y) < d) {
        this.players[0].x = this.players[0].x - v; //this.players[1].x - 30;  //
        this.players[1].x = this.players[1].x + v;
    }
    else if (this.players[0].y - this.players[1].y > 0 && this.players[0].y - this.players[1].y < d && Math.abs(this.players[0].x - this.players[1].x) < d) {
        this.players[0].y = this.players[0].y + v;
        this.players[1].y = this.players[1].y - v; //this.players[0].y - 30; //
    }
    else if (this.players[0].y - this.players[1].y < 0 && this.players[0].y - this.players[1].y > -1 * d  && Math.abs(this.players[0].x - this.players[1].x) < d) {
        this.players[0].y = this.players[0].y - v; //this.players[1].y - 30; //
        this.players[1].y = this.players[1].y + v;
    }
    var gameOver = false;
    for (var i = 0; i < this.players.length; i++) {
        for (var j = 0; j < this.fallers.length; j++) {
            if (intersects(this.fallers[j], this.players[i])) {
                //if (Math.abs(this.players[i].x - this.fallers[j].x) < 30 && Math.abs(this.players[i].y - this.fallers[j].y) < 30) {
                //player touched a faller. Check what type of faller it was.
                if (this.players[i].colors[(this.players[i].colorNum + 96) % 6] === this.fallers[j].color) {
                    this.players[i].colorNum++;
                    if (this.players[i].colorNum === 6) {
                        //We have a winner! Game over...will start over after clicking "OK".
                        this.context.drawImage(this.players[i].playerImage, 0, 0, 500, 500);
                        alert("Player " + (i + 1) + " wins!!!");
                        this.players[i].colorNum = 0;
                        this.players[Math.abs(i - 1)].colorNum = 0;
                        this.context.drawImage(this.players[i].playerImage, 0, 0, 1, 1);
                        gameOver = true;
                        break;
                    }
                }
                else if (this.fallers[j].color === 'bomb' || this.fallers[j].color === 'black') {
                    //We have a loser! Game over...will start over after clicking "OK".
                    this.context.drawImage(this.players[i].playerImage, 0, 0, 500, 500);
                    alert("Player " + (i + 1) + " loses!!!");
                    this.context.drawImage(this.players[i].playerImage, 0, 0, 1, 1);
                    gameOver = true;
                    break;
                }
                else {
                    this.players[i].colorNum--;
                }

                //Player touched faller - push the faller to the bottom, so that it will reset to the top.
                this.fallers[j].y = maxY*2;
            }
            if (gameOver === true) break;
        }
    }
    if (gameOver === true) {

        this.initialize(this.players[0].playerName, this.players[1].playerName);

    }
    else {

        for (var i = 0; i < this.players.length; i++) {
            this.players[i].update(this.context);
        }

        var colorhandicap = "black";
        if (this.players[0].playerName.toLowerCase() == "joshy")
            colorhandicap = this.players[0].colors[(this.players[0].colorNum + 96) % 6];
        if (this.players[1].playerName.toLowerCase() == "joshy")
            colorhandicap = this.players[1].colors[(this.players[1].colorNum + 96) % 6];

        for (var i = 0; i < this.fallers.length; i++) {
            this.fallers[i].update(this.context, colorhandicap);
        }
    }

};



GameRC.addFaller = function () {
    GameRC.fallers.push(new faller());
};

GameRC.addPlayer = function (playerNumber, playerName) {
    GameRC.players.push(new player(playerNumber, playerName));
};

function clamp(value, min, max) {
    // limits value to the range min..max
    return Math.min(max, Math.max(value, min));
}

function intersects(circle, rect) {
    // Find the closest point to the circle within the rectangle
    var closestX = clamp(circle.x, rect.x, rect.x + rect.w);
    var closestY = clamp(circle.y, rect.y, rect.y + rect.h);

    // Calculate the distance between the circle's center and this closest point
    var distanceX = circle.x - closestX;
    var distanceY = circle.y - closestY;

    // If the distance is less than the circle's radius, an intersection occurs
    return (Math.pow(distanceX, 2) + Math.pow(distanceY, 2) < Math.pow(circle.r, 2));
s}
