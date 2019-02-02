function faller() {
    setLocationColorVelocity(this,"black");
};

faller.prototype.draw = function (context) {
    if (this.y >= 50) {
        if (this.rAccDec === 1) {
            this.r = this.r + this.rAccSpeed;
            if (this.r > this.rMax) {
                this.rAccDec = 0;
                this.r = this.r - this.rAccSpeed;
            }
        } else {
            this.r = this.r - this.rAccSpeed;
            if (this.r < this.rMin) {
                this.rAccDec = 1;
                this.r = this.r + this.rAccSpeed;
            }
        }
        if (this.color === "bomb") {
            var fallImage = new Image();
            fallImage.src = 'images/' + this.color + 'Circle.png';
            context.drawImage(fallImage, this.x, this.y, this.r, this.r);
        }
        else {

            if (this.y % 200 > this.blinkrate) { //Make it disappear more of the section if it has a higher blinkrate.
                context.fillStyle = this.color;

                if (this.show_circle) {
                    //Circle part of "raindrop
                    var startPoint = (Math.PI / 180) * 0;
                    var endPoint = (Math.PI / 180) * 360;
                    context.beginPath();
                    context.arc(this.x, this.y, this.r, startPoint, endPoint, true);
                    context.fill();
                    context.closePath();
                }
                if (this.show_triangle) {
                    //Triangle part of "raindrop"
                    context.beginPath();
                    context.moveTo(this.x + (this.r / 2) * Math.pow(3, .5), this.y - this.r / 2); //Math.pow(2, .5));
                    context.lineTo(this.x, this.y - this.r * 2);
                    context.lineTo(this.x - (this.r / 2) * Math.pow(3, .5), this.y - this.r / 2);
                    context.fill();
                }
            }
        }
    }
};

faller.prototype.update = function (context, color) {
    if (this.y >= maxY) {
        setLocationColorVelocity(this, color);
    }
    this.velocity = this.velocity + this.velocity * this.acceleration;
    this.y += Math.round(this.velocity);

    //Move the faller side-to-side, based on the rate in obj.sidetosiderate
    if (this.y % 20 == 0) {
        var randsidetoside = Math.random() * 2;
        if (randsidetoside <= 1) this.x = this.x - this.sidetosiderate;
        else this.x = this.x + this.sidetosiderate;
    }
}

function setLocationColorVelocity(obj, color) {
    obj.x = Math.round(Math.random() * maxX);
    obj.y = Math.round((Math.random() * -250));
    obj.velocity = Math.round((Math.random() * 2) * maxX / 640) + 1;
    obj.acceleration = .005;
    obj.r = Math.round((Math.random() * 25) * maxX / 640)  + 15;
    obj.rAccDec = Math.floor(Math.random() * 2);
    obj.rMax = Math.round((obj.r + Math.random() * 10) * maxX / 640);
    obj.rMin = Math.round((obj.r + Math.random() - 10) * maxX / 640);
    obj.rAccSpeed = Math.random() * .5 + .1;
    //Select a random color.
    setColor(obj, color);

    //Set blinking factor: random number between 0 and 5 for # of invisible occurrences.
    //Divide into equal sections.
    //For now, just make it blink within certain ranges.
    obj.blinkrate = Math.random() * 200;

    //Raindrops falling random sideways movements (like Space Invaders #40)
    obj.sidetosiderate = 5 * obj.velocity; //Math.random() * 20 * obj.velocity;

    //Just for fun, make circle or triangle part of the raindrop invisible:
    obj.show_circle = false; //true; //false;
    obj.show_triangle = false; //true; //false;
    var rand = Math.random() * 3000;
    if (rand <= 1001) { obj.show_circle = true; }
    else if (rand <= 2000) { obj.show_triangle = true; }
    else { obj.show_circle = true; obj.show_triangle = true; }
};

function setColor(obj, color) {
    //Select a random color.
    var colors = ["red", "orange", "yellow", "green", "blue", "purple", "black", color, color, color, color, color];
    var randomColor = colors[Math.floor((Math.random()) * colors.length)];
    obj.color = randomColor;
};
