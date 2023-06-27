/* This function gets the terms and definitions inputted into the boxes when 
"Save" is clicked. */
function getTermsAndDefs() {
    var rawTerms = document.getElementById('terms').value;
    var rawDefs = document.getElementById('definitions').value;
    const termsList = rawTerms.split(/\n/);
    const defsList = rawDefs.split(/\n/);
    console.log(termsList);
    console.log(defsList);
}

function retrieveAnswer(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        console.log(document.getElementById("answerBox").value);
    }
}

// The game area is an object that can be initialized and cleared:
var myGameArea = {
    canvas: document.createElement('canvas'),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "#74877c";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Now we need a function to render the falling asteroids:
function drawAsteroid(context, radius, x, y, text, color) {
    // First, we get some variables sorted out:
    this.radius = radius;
    this.x = x;
    this.y = y;

    /* Next, we draw the circle according to the 
    center coordinates, fill color and text given:*/
    context.fillStyle = color;
    context.beginPath();
    context.arc(
        this.x,
        this.y,
        this.radius,
        0,
        2 * Math.PI
    );
    context.fill();

    // Finally, we draw the text in the asteroid.
    context.font = "30px Comic Sans MS";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText(text, this.x, this.y);
}

// This function starts the game by rendering the area:
function startGame() {
    myGameArea.start();

    theAsteroid = new drawAsteroid(
        myGameArea.context, 
        50, 
        250, 
        250, 
        "I like donuts", 
        "green"
    );
}