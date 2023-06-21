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

// The game area is an object that can be initialized and cleared:
var myGameArea = {
    start : function() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.length = 500;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Now we need a function to render the falling asteroids:
function asteroid(context, radius, x, y) {
    context.beginPath();
    
}

function startGame() {
    myGameArea.start()
}