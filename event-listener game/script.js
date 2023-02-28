//page elements
const displayBox = document.getElementById('displayBox1');
const typedValueElement1 = document.getElementById('typed-value1');
const typedValueElement2 = document.getElementById('typed-value2');
const typedValueElement3 = document.getElementById('typed-value3');

  // a list of letters and their keys
const letterValues = {
  'a' : 10,
  'b' : 20,
  'c' : 30,
  'd' : 40,
  'e' : 50,
  'f' : 60,
  'g' : 70,
  'h' : 80,
  'i' : 90,
  'j' : 100,
  'k' : 110,
  'l' : 120,
  'm' : 130,
  'n' : 140,
  'o' : 150,
  'p' : 160,
  'q' : 170,
  'r' : 180,
  's' : 190,
  't' : 200,
  'u' : 210,
  'v' : 220,
  'w' : 230,
  'x' : 240,
  'y' : 250,
  'z' : 255,
};

//variables for the different text box values
let pairedLetter1, pairedLetter2, pairedLetter3;

//inserts the taken values of each text box and puts them into the rgb values
function updateDisplayBoxColor() {
  if (pairedLetter1 !== undefined && pairedLetter2 !== undefined && pairedLetter3 !== undefined) {
    displayBox.style.backgroundColor = 'rgb(' + pairedLetter1 + ',' + pairedLetter2 + ',' + pairedLetter3 + ')';
  }
}

//functions to get value from each text box, and update displayBox color
typedValueElement1.addEventListener('input', () => {
  const typedValue = typedValueElement1.value;
  pairedLetter1 = letterValues[typedValue];
  updateDisplayBoxColor();
});

typedValueElement2.addEventListener('input', () => {
  const typedValue = typedValueElement2.value;
  pairedLetter2 = letterValues[typedValue];
  updateDisplayBoxColor();
});

typedValueElement3.addEventListener('input', () => {
  const typedValue = typedValueElement3.value;
  pairedLetter3 = letterValues[typedValue];
  updateDisplayBoxColor();
});