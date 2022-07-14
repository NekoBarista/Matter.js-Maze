const {Engine, Render, Runner, Composite, Bodies, Body, Events} = Matter;


const playGame= () => {



const engine = Engine.create()
engine.world.gravity.y = 0;

const {world} = engine;

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 3
const cellsVertical = 2
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }

});



Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
Bodies.rectangle(width / 2, 0, width, 2, {
    isStatic: true,

}),

Bodies.rectangle(width / 2, height , width, 2, { isStatic: true, 

}),

Bodies.rectangle(0,height / 2, 2, height, { isStatic: true, 

}),

Bodies.rectangle(width,height / 2, 2, height, { isStatic: true,

})
]; 
Composite.add(world, walls);

// maze generation

const shuffle = arr => {
    let counter = arr.length;
  
    while (counter > 0) {
      const index = Math.floor(Math.random() * counter);
  
      counter--;
  
      const temp = arr[counter];
      arr[counter] = arr[index];
      arr[index] = temp;
    }
  
    return arr;
  };
  
  const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));
  
  const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false));
  
  const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));
  
  const startRow = Math.floor(Math.random() * cellsVertical);
  const startColumn = Math.floor(Math.random() * cellsHorizontal);
  
  const drawMaze = (row, column) => {
    // If i have visted the cell then return
    if (grid[row][column]) {
      return;
    }
  
    // Mark this cell as  visited
    grid[row][column] = true;
  
    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
      [row - 1, column, 'up'],
      [row, column + 1, 'right'],
      [row + 1, column, 'down'],
      [row, column - 1, 'left']
    ]);
    // For each neighbor....
    for (let neighbor of neighbors) {
      const [nextRow, nextColumn, direction] = neighbor;
  
      // See if out of bounds
      if (
        nextRow < 0 ||
        nextRow >= cellsVertical ||
        nextColumn < 0 ||
        nextColumn >= cellsHorizontal
      ) {
        continue;
      }
  
      // If we have visited that neighbor, continue to next neighbor
      if (grid[nextRow][nextColumn]) {
        continue;
      }
  
      // Remove a wall from either horizontals or verticals
      if (direction === 'left') {
        verticals[row][column - 1] = true;
      } else if (direction === 'right') {
        verticals[row][column] = true;
      } else if (direction === 'up') {
        horizontals[row - 1][column] = true;
      } else if (direction === 'down') {
        horizontals[row][column] = true;
      }
  
      drawMaze(nextRow, nextColumn);
    }
  
    // Go to next cell
  };
  
  drawMaze(startRow, startColumn);

  horizontals.forEach((row, rowIndex) => { 
  row.forEach((open, columnIndex) => {
    if (open) {
        return;
    }
    
    const wall = Bodies.rectangle(
        columnIndex * unitLengthX + unitLengthX / 2,
        rowIndex * unitLengthY + unitLengthY, unitLengthX, 5, {
        isStatic: true,    label: "wall", render: {
            fillStyle: 'red'
        } }
    );
    
    Composite.add(world, wall)
    
      });

    });

    verticals.forEach((row, rowIndex) => {
row.forEach((open, columnIndex) => {
if (open) {
    return
}

const wall = Bodies.rectangle(
columnIndex * unitLengthX + unitLengthX,
rowIndex * unitLengthY + unitLengthY/2,
5,
unitLengthY, {
    isStatic: true,
    label: "wall",
    render: {
        fillStyle: 'red'
    }
}


);
Composite.add(world, wall);

    });
   
})


// goal drawing

const goal = Bodies.rectangle(
width - unitLengthX / 2, 
height - unitLengthY / 2, 
unitLengthX *.7,
unitLengthY *.7, {
    isStatic: true,
    label: 'goal',
    render: {fillStyle: 'green'}
}
);


Composite.add(world, goal)

// ball drawing
ballRadius = Math.min(unitLengthX, unitLengthY) / 4
const ball = Bodies.circle(
unitLengthX / 2,
unitLengthY / 2, 
ballRadius,
{label: 'ball',
render: {fillStyle: 'blue'}}

)

Composite.add(world, ball)



// add keypress
document.addEventListener('keydown', event => {

    const {x, y} = ball.velocity
    document.querySelector(".instructions").classList.add('hidden')

    if(event.code === "KeyW") {
        Body.setVelocity(ball, {x, y: y-5})

        }

    if(event.code === "KeyS") {
        Body.setVelocity(ball, {x, y: y+5})
    }

    if(event.code === "KeyD") {
        Body.setVelocity(ball, {x: x+5, y})

    }

    if(event.code === "KeyA") {
        Body.setVelocity(ball, {x: x-5, y})

    }
    
})

// win state
Events.on(engine,'collisionStart', event => {
  
event.pairs.forEach(collision => {
const labels = ['ball', 'goal'];

if (
labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label))
{
    world.gravity.y = 1;
    world.bodies.forEach(body => {
        if (body.label === 'wall') {
            Body.setStatic(body, false)
            document.querySelector('.winner').classList.remove('hidden')
            document.querySelector('.button').classList.remove('hidden')
        }
    })

}


})

})
}


playGame()

const playBtn = document.querySelector('.button');
playBtn.addEventListener('click', (event) => {
  event.preventDefault();
  Composite.clear(world);
  Engine.clear(engine);
  Render.stop(render);
  render.canvas.remove();
  render.canvas = null;
  render.context = null;
  render.textures = {};
  console.log('reset clicked');
  document.querySelector('.winner').classList.add('hidden');
  playGame()
})