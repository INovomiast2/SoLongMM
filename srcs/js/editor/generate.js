// Generate creates a grid of cells with the given dimensions. (With buttons that change with the tile image).

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tile = 0;
    }
}

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.generateGrid();
    }

    generateGrid() {
        for (let i = 0; i < this.width; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.grid[i][j] = new Cell(i, j);
            }
        }
    }
}

const grid = (width, height) => {
    return new Grid(width, height);
}

// Generate the grid with a div with buttons

const generate = (width, height) => {
    const grid = document.createElement('div');
    grid.id = 'grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const cell = document.createElement('button');
            cell.id = `cell-${i}-${j}`;
            cell.style.width = '50px';
            cell.style.height = '50px';
            cell.style.border = '1px solid black';
            cell.style.backgroundImage = '#fff';
            cell.style.backgroundSize = 'cover';
            cell.style.backgroundRepeat = 'no-repeat';
            cell.style.backgroundPosition = 'center';
            cell.style.cursor = 'pointer';
            cell.addEventListener('click', () => {
                const tile = grid.grid[i][j].tile;
                grid.grid[i][j].tile = (tile + 1) % 5;
                cell.style.backgroundImage = `url('images/tile_${grid.grid[i][j].tile}.png')`;
            });
            grid.appendChild(cell);
        }
    }

    document.body.appendChild(grid);
}

// Append the grid to the editor
document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const height = 10;
    generate(width, height);
});