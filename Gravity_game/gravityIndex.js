/*
===========================================================================
=============================INTRO PAGE CODE===============================
===========================================================================
*/

/* This function gets the terms and definitions inputted into the table when 
"Save" is clicked. */
function getTermsAndDefs() {
    sessionStorage.clear();

    /*First, we have to get all the textareas labeled for terms
    and definitions. Then, we push their contents into list of 
    terms and their respective definitions.*/
    var termNodes = document.getElementsByClassName("term");
    var termsList = [];
    for (var j = 0; j < termNodes.length; j++) {
        termsList.push(termNodes[j].value);
    }

    var defNodes = document.getElementsByClassName("definition");
    var defsList = [];
    for (var i = 0; i < defNodes.length; i++) {
        defsList.push(defNodes[i].value);
    }

    /* Then we console.log the lists to make sure they 
    exist, then store them in sessionStorage. */
    console.log(termsList);
    console.log(defsList);
    sessionStorage.setItem("terms", termsList);
    sessionStorage.setItem("definitions", defsList);
}

function addRow() {
    var pairsTableBody = document.getElementById("pairsTable")
    .getElementsByTagName('tbody')[0];
    var newRow = document.createElement('tr');
    pairsTableBody.appendChild(newRow);

    var termCell = document.createElement('td');
    var defCell = document.createElement('td');
    newRow.appendChild(termCell);
    newRow.appendChild(defCell);
    
    var termTextArea = document.createElement('textarea');
    var defTextArea = document.createElement('textarea');
    termCell.appendChild(termTextArea);
    defCell.appendChild(defTextArea);
    termTextArea.className = "term";
    defTextArea.className = "definition";
}

function subtractRow() {
    var pairsTableBody = document.getElementById("pairsTable")
    .getElementsByTagName('tbody')[0];
    var children = pairsTableBody.getElementsByTagName("tr");
    var child = children[children.length-1];
    pairsTableBody.removeChild(child);
}

/*
================================================================================
==================================GAME CODE=====================================
================================================================================
*/

/*
=========================
=====RETRIEVE ANSWER=====
=========================
*/

function retrieveAnswer(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        console.log(document.getElementById("answerBox").value);
        myGameArea.currentAnswer = document.getElementById("answerBox").value;
        document.getElementById("answerBox").value = "";
        console.log(myGameArea.currentAnswer);
    }
}

/*
===================
=====GAME AREA=====
===================
*/

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

/*
===================
=====ASTEROIDS=====
===================
*/

// Now we need a function to render the falling asteroids:
function drawAsteroid(context, radius, x, y, text, color) {
    // First, we get some variables sorted out:
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.text = text;
    this.termIndex = Math.floor(Math.random() * myGameArea.pairKeys.length);

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
        this.termIndex = Math.floor(Math.random() * myGameArea.pairKeys.length);
        this.text = myGameArea.pairs[myGameArea.pairKeys[this.termIndex]];
    }
}

/*
====================
=====START GAME=====
====================
*/

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
    
    asteroid1 = new drawAsteroid(
        myGameArea.context, 
        50, 
        Math.floor(Math.random() * (481)) + 60, 
        -50, 
        myGameArea.defsList[0], 
        "green"
    );
}

/*
===================
=====GAME LOOP=====
===================
*/

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

    if (myGameArea.currentAnswer == myGameArea.pairKeys[asteroid1.termIndex]) {
        asteroid1.reset();
        myGameArea.addScore();
        myGameArea.currentAnswer = "";
    }

    asteroid1.update();
    homeAsteroid.update();
}