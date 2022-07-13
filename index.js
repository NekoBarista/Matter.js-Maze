const {Engine, Render, Runner, Composite, Bodies} = Matter;

const engine = Engine.create()
const {world} = engine;

const width = 600;
const height = 600;
const cells = 3;


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
Bodies.rectangle(width / 2, 0, width, 40, {
    isStatic: true
}),
Bodies.rectangle(width / 2, height , width, 40, { isStatic: true

}),

Bodies.rectangle(0,height / 2, 40, height, { isStatic: true

}),

Bodies.rectangle(width,height / 2, 40, height, { isStatic: true

})
]; 
Composite.add(world, walls);

// maze generation

const grid = Array(cells).fill(null).map(()=> Array(cells).fill(false));


const verticals = Array(cells).fill(null).map(()=> Array(cells - 1).fill(false));

const horizontals = Array(cells - 1).fill(null).map(()=> Array(cells).fill(false));

const startRow =  Math.floor(Math.random()*cells)
const startColumn =  Math.floor(Math.random()*cells)

const cellMovement =  (row, startColumn) => {
// if I have visited cell at row, column, then return
// Mark this cell as visited
// Assemble randomly ordered list of neighbours
// For each neighbour....
// Check if in bounds
//Check if visited, continue to next
// Remove wall from horizontal or vertical
// Visit next cell

}

cellMovement(startRow, startColumn)