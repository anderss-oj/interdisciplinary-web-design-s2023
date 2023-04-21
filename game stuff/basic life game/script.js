// main display elements
const mainDisplay = document.getElementById('mainDisplay');
const resetDisplay = document.getElementById('resetDisplay');
const winDisplay = document.getElementById('winDisplay');
// button variables
const buttonDiv = document.getElementById('buttonDiv');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const middleButton = document.getElementById('middle');
const resetButton = document.getElementById('resetButton');
const winRestartButton = document.getElementById('winRestart');
// taco elements
const taco1 = document.getElementById('life1');
const taco2 = document.getElementById('life2');
const taco3 = document.getElementById('life3');
// instructions divs
const level1Inst = document.getElementById('level1Inst');
const nextLevelText = document.getElementById('nextLevelText');
// dorito div
const doritoDiv = document.getElementById('doritos');
// life + dorito counts
let life = 3;
let number = Math.random();
let numDoritos = 0;

// function to add doritos to score
function addDoritos(num) {
  for (var i = 0; i < num; i++) {
    const dorito = document.createElement("img");
    dorito.src = "https://freepngimg.com/save/112162-chips-doritos-hq-image-free/840x859";
    dorito.className = "doritoImg";
    doritoDiv.appendChild(dorito);
  }
}

// life checker
function lifeCheck() {
    if (life >= 3){
        taco1.style.display = 'none';
        life--;
    }
    else if (life == 2){
        taco2.style.display = 'none';
        life--;
    }        
    else if (life == 1){
        taco3.style.display = 'none';
        life--;
        mainDisplay.style.display = 'none';
        resetDisplay.style.display = 'block';
    }
    console.log(life + ' life(s) left');
}

// dorito checker
function level2Check() {
    if (numDoritos === 3) {
        middleButton.style.display = 'inline-block';
        nextLevelText.innerHTML = 'Get 3 more doritos and you win the whole game!';
        nextLevelText.style.backgroundColor = 'rgb(255, 214, 0)';
        number = Math.random();
    }
    else if (numDoritos === 6) {
        mainDisplay.style.display = 'none';
        winDisplay.style.display = 'block';
    }
}

// reset button function

function resetGame() {
    middleButton.style.display = 'none';
    resetDisplay.style.display = 'none';
    mainDisplay.style.display = 'block';
    nextLevelText.innerHTML = 'If you get 3 doritos you will unlock the next level!';
    nextLevelText.style.backgroundColor = 'aquamarine';
    document.querySelectorAll('.tacoImg').forEach(taco => {
        taco.style.display = 'inline-block';
    });
    doritoDiv.innerHTML = "";
    life = 3;
    numDoritos = 0;
    number = Math.random();
    console.log(numDoritos + ' Dorito(s)');
    console.log(life + ' life(s) left');
}

// LEVEL 1

// left button lvl 1 functionality (greater or equal to 0.5)
function numCheckLeft1() {
    console.log('numCheckLeft1');
    if (number <= 0.5) {
        numDoritos++;
        console.log(numDoritos + ' Dorito(s)');
        doritoDiv.innerHTML = ""; // clear the doritoDiv before adding new images
        addDoritos(numDoritos); // add new dorito images based on numDoritos
    }
    else {
        lifeCheck();
    }
    
}

// right button lvl 1 functionality (less than 0.5)
function numCheckRight1() {
    console.log('numCheckRight1');
    if (number > 0.5) {
        numDoritos++;
        console.log(numDoritos + ' Dorito(s)');
        doritoDiv.innerHTML = ""; // Clear the doritoDiv before adding new images
        addDoritos(numDoritos); // Add new dorito images based on numDoritos
    }
    else {
        lifeCheck();
    }
}

// LEVEL 2

function numCheckLeft2() {
    console.log('numCheckLeft2');
    if (number < 0.3) {
        numDoritos++;
        console.log(numDoritos + ' Dorito(s)');
        doritoDiv.innerHTML = ""; // Clear the doritoDiv before adding new images
        addDoritos(numDoritos); // Add new dorito images based on numDoritos
    }
    else {
        lifeCheck();
    }
}

function numCheckRight2() {
    console.log('numCheckRight2');
    if (number > 0.6) {
        numDoritos++;
        console.log(numDoritos + ' Dorito(s)');
        doritoDiv.innerHTML = ""; // Clear the doritoDiv before adding new images
        addDoritos(numDoritos); // Add new dorito images based on numDoritos
    }
    else {
        lifeCheck();
    }
}

// middle button

function numCheckMiddle() {
    console.log('numCheckMiddle');
    if (0.3 <= number <= 0.6 ) {
        numDoritos++;
        console.log(numDoritos + ' Dorito(s)');
        doritoDiv.innerHTML = ""; // Clear the doritoDiv before adding new images
        addDoritos(numDoritos); // Add new dorito images based on numDoritos
    }
    else {
        lifeCheck();
    }
    //level1Inst.style.display = 'none';
    number = Math.random();
    level2Check();
    console.log(numDoritos + 'DORITOS');
}

// consolidated left / right functionalities

function numCheckLeft() {
    if (middleButton.style.display === 'inline-block') {
        numCheckLeft2();
    }
    else {
        numCheckLeft1();
    }
    number = Math.random();
    level2Check();
    console.log(numDoritos + 'DORITOS');
}

function numCheckRight() {
    if (middleButton.style.display === 'inline-block') {
        numCheckRight2();
    }
    else {
        numCheckRight1();
    }
    number = Math.random();
    level2Check();
    console.log(numDoritos + 'DORITOS');
}

window.onload = function() {
    leftButton.onclick = function() {
        numCheckLeft();
        console.log(number);
    }
    rightButton.onclick = function() {
        numCheckRight();
        console.log(number);
    }
    middleButton.onclick = function() {
        numCheckMiddle();
        console.log(number);
    }
    resetButton.onclick = function() {
        resetGame();
        console.log(numDoritos + 'DORITOS');
    }
    winRestartButton.onclick = function() {
        resetGame();
    }
}