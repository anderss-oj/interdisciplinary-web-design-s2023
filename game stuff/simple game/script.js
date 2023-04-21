// create a constant gameObject
const gameObject = {
  x: 0,
  y: 0,
  type: ''
};

// ...and a constant movable
const movable = {
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

// then the constant movableObject is composed of the gameObject and movable constants
const movableObject = {...gameObject, ...movable};

// then create a function to create a new Hero who inherits the movableObject properties
function createHero(x, y) {
  return {
    ...movableObject,
    x,
    y,
    type: 'Hero'
  }
}

// ...and a static object that inherits only the gameObject properties
function createStatic(x, y, type) {
  return {
    ...gameObject,
    x,
    y,
    type
  }
}

// create the hero and move it
const hero = createHero(10, 10);
hero.moveTo(5, 5);

// and create a static tree which only stands around
//const tree = createStatic(0, 0, 'Tree'); 

const beans = createStatic(0,0, 'Beans');
const cheese = createStatic(15, 15, 'Cheese');
// get the object element
// select the HTML elements by their CSS selectors and assign them to the corresponding constant objects
const object = document.querySelector('.object');
const beansElement = document.querySelector('#beans');

// add a mousemove event listener to the document object
document.addEventListener('mousemove', (event) => {
// update the position of the object based on the current mouse position
object.style.left = `${event.clientX}px`;
object.style.top = `${event.clientY}px`;

// update the position of the beans element based on the current mouse position
beansElement.style.left = `${event.clientX - 150}px`;
beansElement.style.top = `${event.clientY - 100}px`;
});