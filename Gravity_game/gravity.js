var termIndex = 0;

/* This function gets the terms and definitions inputted into the boxes when 
"Save" is clicked. */
function getTermsAndDefs() {

    sessionStorage.clear();
    /* We start off with the raw data that we get from 
    the user, then slice it wherever there's a new line:*/
    var rawTerms = document.getElementById('terms').value;
    var rawDefs = document.getElementById('definitions').value;
    var termsList = rawTerms.split(/\n/);
    var defsList = rawDefs.split(/\n/);

    /* Now we have 2 lists, but one is longer than the 
    other. So, we make the loger one equal in length to
    the shorter one by deleting extra elements: */
    if (termsList.length > defsList.length) {
        termsList = termsList.slice(0, defsList.length);
    } 
    if (termsList.length < defsList.length) {
        defsList = defsList.slice(0, termsList.length);
    }

    /* Then we console.log the lists to make sure they 
    exist, then store them in sessionStorage. */
    console.log(termsList);
    console.log(defsList);
    sessionStorage.setItem("terms", termsList);
    sessionStorage.setItem("definitions", defsList);
}

function retrieveAnswer(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        console.log(document.getElementById("answerBox").value);
        myGameArea.currentAnswer = document.getElementById("answerBox").value;
        document.getElementById("answerBox").value = "";
        console.log(myGameArea.currentAnswer);
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
        this.fails = 0;
        this.score = 0;
        this.interval = setInterval(updateGameArea, 20);
        this.fallSpeed = 0.5;
        this.gravity = 0.01;
        this.currentAnswer = "";
        this.pairs = {}; /* This is the object where terms and 
                            their definitions will be stored. */
        this.storeLists();
    },

    storeLists : function() {
        this.termsList = sessionStorage.getItem("terms").split(",");
        this.defsList = sessionStorage.getItem("definitions").split(",");
        for (var j = 0; j < this.termsList.length; j++) {
            this.pairs[this.termsList[j]] = this.defsList[j];
        }
        this.pairKeys = Object.keys(this.pairs);
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#74877c";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    addFail : function() {
        this.fails++;
        var counter = "Fails: ";
        document.getElementById('failsDisplay')
        .innerHTML = counter.concat(String(this.fails));
        if (this.fails == 5) {
            myGameArea.gameOver();
        }
    },

    gameOver : function() {
        clearInterval(this.interval);
        this.context.font = "90px Trebuchet MS";
        this.context.fillStyle = "#154360";
        this.context.textAlign = "center";
        this.context.fillText("GAME OVER", 500, 300);
    },

    addScore : function() {
        this.score++;
        var counter = "Score: "
        document.getElementById('scoreDisplay')
        .innerHTML = counter.concat(String(this.score));
    }
}

// Now we need a function to render the falling asteroids:
function drawAsteroid(context, radius, x, y, text, color) {
    // First, we get some variables sorted out:
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.text = text;

    /* Next, we draw the circle according to the 
    center coordinates, fill color and text given.
    This is called the update function:*/
    this.update = function() {
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
        context.font = "30px Trebuchet MS";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.fillText(this.text, this.x, this.y);
    }

    // This function alerts the asteroid if it crashed with another asteroid:
    this.crashedWith = function(obj) {
        var crash = false;
        /* If the distance between the asteroids' centers is less than their
        combined radii, they are touching and therefore crashing:*/
        if (Math.sqrt(Math.pow((this.x-obj.x), 
            2) + Math.pow((this.y-obj.y), 2)) < this.radius + obj.radius) {
            crash = true;
        }
        return crash;
    }

    this.reset = function() {
        this.y = 0;
        this.x = Math.floor(Math.random() * (481)) + 60;
        myGameArea.fallSpeed = 1;
        termIndex = Math.floor(Math.random() * myGameArea.pairKeys.length);
        this.text = myGameArea.pairs[myGameArea.pairKeys[termIndex]];
    }
}

// This function starts the game by rendering the area:
function startGame() {
    myGameArea.start();
    homeAsteroid = new drawAsteroid(
        myGameArea.context,
        900,
        500,
        1350,
        "",
        "black"
    );
    
    termIndex = Math.floor(Math.random() * myGameArea.pairKeys.length);
    asteroid1 = new drawAsteroid(
        myGameArea.context, 
        50, 
        Math.floor(Math.random() * (481)) + 60, 
        -50, 
        myGameArea.defsList[termIndex], 
        "green"
    );
}

// This function will be called by myGameArea to update the page 
// every 20 milliseconds:
function updateGameArea() {
    myGameArea.clear();
    asteroid1.y += myGameArea.fallSpeed;
    myGameArea.fallSpeed += myGameArea.gravity;

    if (asteroid1.crashedWith(homeAsteroid)) {
        asteroid1.reset();
        myGameArea.addFail();
    }

    if (myGameArea.currentAnswer == myGameArea.pairKeys[termIndex]) {
        asteroid1.reset();
        myGameArea.addScore();
        myGameArea.currentAnswer = "";
    }

    asteroid1.update();
    homeAsteroid.update();
}