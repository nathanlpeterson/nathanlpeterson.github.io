

function player(playerNumber,playerName) {
    this.playerNum = playerNumber;
    this.playerName = playerName;
    this.w = Math.round(maxX / 20);
    this.h = Math.round(maxX / 20);
    this.x = (playerNumber === 1 ? 0 : maxX- this.w);
    this.y = maxY-this.h;
    this.v = Math.round(maxX / (playerName.toLowerCase() === "joshy" ? 170 : 200));
    this.playerImage = new Image();
    this.playerImage.src = 'images/'+ playerName + '.png';
    this.colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    this.colorNum = 0; //0 = red, 1 = orange, 2 = yellow, 3 = green, 4 = blue, 5 = purple, 6 = victory...-1 = purple, -2 = blue, etc.
};

player.prototype.draw = function (context) {
    if(this.colorNum < 0) context.globalAlpha = 0.6; //Make somewhat faded if more than a full rainbow away from winning
    context.fillStyle = this.colors[(this.colorNum + 96) % 6];
    context.fillRect(this.x, this.y, this.w, this.h);
    context.drawImage(this.playerImage, this.x, this.y, this.w, this.h);
    context.globalAlpha = 1;
};

player.prototype.update = function (context) {
    //    this.x = something;
    //    this.y = something;
    //alert(document.getElementById("out").html);
    //    player1: 65(L) 83 (U) 68 (R) 83 (D)
    //player2: 37(L) 38 (U) 39 (R) 40 (D)
    for (var i in keys) {
        if (this.playerNum === 1) {
            if (i == 65) { this.x = this.x - this.v;  break; }
            else if (i == 69 || i == 87) { this.y = this.y - this.v; break; }
            else if (i == 68) { this.x = this.x + this.v; break; }
            else if (i == 83) { this.y = this.y + this.v; break; }
        }
        else if (this.playerNum === 2) {
            if (i == 37) { this.x = this.x - this.v; break; }
            else if (i == 38) { this.y = this.y - this.v; break; }
            else if (i == 39) { this.x = this.x + this.v; break; }
            else if (i == 40) { this.y = this.y + this.v; break; }
        }
    }
    this.x = Math.max(Math.min(this.x,maxX - this.w),0);       
    this.y = Math.max(Math.min(this.y, maxY - this.h), 0);      
};
