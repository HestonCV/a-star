class Grid {
  constructor(gridUI, numColumns, numRows) {
    this.gridUI = gridUI;
    this.grid = new Array(numRows);
    this.numColumns = numColumns;
    this.numRows = numRows;
    this.start = null;
    this.stop = null;
    this.createGrid();
  }

  async bfs() {
    this.gridUI.locked = true;
    this.gridUI.clearHoverColors();
    if (!this.start || !this.stop) {
      console.log("Start or stop node is not defined");
      this.gridUI.locked = false;
      return;
    }

    let queue = [];
    let visited = new Set();
    let previous = new Map();

    queue.push(this.start);
    visited.add(this.start);

    while (queue.length > 0) {
      let current = queue.shift();
      // Add neighbors to the queue
      const neighbors = this.getNeighbors(current);
      for (let neighbor of neighbors) {
        if (!this.gridUI.locked) {
          return;
        }
        if (neighbor === this.stop) {
          console.log("Found the stop node");
          previous.set(neighbor, current);
          this.drawShortestPath(previous);
          this.gridUI.clearHoverColors();
          return;
        }
        if (!visited.has(neighbor) && !neighbor.isWall) {
          queue.push(neighbor);
          visited.add(neighbor);
          previous.set(neighbor, current);
          neighbor.element.style.backgroundColor = "rgb(255, 165, 0)"; // Change the color of visited nodes
          await this.sleep(15); // Add delay to visualize the process
        }
      }
    }

    console.log("Did not find the stop node");
    this.gridUI.clearHoverColors();
  }

  getNeighbors(node) {
    let neighbors = [];
    let i = node.x;
    let j = node.y;
    // add top neighbor
    if (i - 1 >= 0 && !this.grid[i - 1][j].isWall)
      neighbors.push(this.grid[i - 1][j]);
    // add bottom neighbor
    if (i + 1 < this.numRows && !this.grid[i + 1][j].isWall)
      neighbors.push(this.grid[i + 1][j]);
    // add left neighbor
    if (j - 1 >= 0 && !this.grid[i][j - 1].isWall)
      neighbors.push(this.grid[i][j - 1]);
    // add right neighbor
    if (j + 1 < this.numColumns && !this.grid[i][j + 1].isWall)
      neighbors.push(this.grid[i][j + 1]);
    // add top right neighbor
    if (
      j + 1 < this.numColumns &&
      i - 1 >= 0 &&
      !this.grid[i - 1][j + 1].isWall &&
      !this.grid[i - 1][j].isWall &&
      !this.grid[i][j + 1].isWall
    )
      neighbors.push(this.grid[i - 1][j + 1]);
    // add top left neighbor
    if (
      j - 1 >= 0 &&
      i - 1 >= 0 &&
      !this.grid[i - 1][j - 1].isWall &&
      !this.grid[i - 1][j].isWall &&
      !this.grid[i][j - 1].isWall
    )
      neighbors.push(this.grid[i - 1][j - 1]);
    // add bottom right neighbor
    if (
      j + 1 < this.numColumns &&
      i + 1 < this.numRows &&
      !this.grid[i + 1][j + 1].isWall &&
      !this.grid[i + 1][j].isWall &&
      !this.grid[i][j + 1].isWall
    )
      neighbors.push(this.grid[i + 1][j + 1]);
    // add bottom left neighbor
    if (
      j - 1 >= 0 &&
      i + 1 < this.numRows &&
      !this.grid[i + 1][j - 1].isWall &&
      !this.grid[i + 1][j].isWall &&
      !this.grid[i][j - 1].isWall
    )
      neighbors.push(this.grid[i + 1][j - 1]);

    return neighbors;
  }

  drawShortestPath(previous) {
    let node = this.stop;
    while (node !== this.start) {
      node = previous.get(node);
      if (node !== this.start) {
        node.element.style.backgroundColor = "rgb(247, 43, 11)";
      }
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  createGrid() {
    for (let i = 0; i < this.numRows; i += 1) {
      this.grid[i] = new Array(this.numColumns);
      for (let j = 0; j < this.numColumns; j += 1) {
        // initialize grid cell object
        this.grid[i][j] = {
          x: i,
          y: j,
          element: this.gridUI.createGridCell(i, j),
          isWall: false,
          neighbors: [],
        };
      }
    }
  }

  clearGrid() {
    this.stop = null;
    this.start = null;
    this.grid.forEach((row) => row.forEach((cell) => (cell.isWall = false)));
  }
}

class GridUI {
  constructor() {
    this.modes = {
      start: {
        clickColor: "rgb(72, 208, 72)",
        hoverColor: "rgb(150, 224, 150)",
      },
      stop: {
        clickColor: "rgb(0, 191, 255)",
        hoverColor: "rgb(166, 233, 255)",
      },
      wall: {
        clickColor: "rgb(88, 88, 88)",
        hoverColor: "rgb(183, 183, 183)",
      },
    };
    this.activeMode = "start";
    this.currentHoveredElement = null;
    this.locked = false;
    this.gridElement = document.querySelector(".grid");
  }

  setGrid(grid) {
    this.grid = grid;
  }

  createGridCell(i, j) {
    const gridCellElement = document.createElement("div");
    this.gridElement.appendChild(gridCellElement);
    this.initCellEventListeners(gridCellElement, i, j);
    return gridCellElement;
  }

  clearGrid() {
    this.activeMode = "start";
    this.clearAllColors();
  }

  initCellEventListeners(gridCellElement, i, j) {
    // if the grids cell element is clicked
    gridCellElement.addEventListener("click", () => {
      const instructionElement = document.getElementById("run");
      if (!this.locked) {
        switch (this.activeMode) {
          case "start":
            if (this.grid.grid[i][j] !== this.grid.stop) {
              // update instructions
              if (!this.grid.stop) {
                instructionElement.textContent = "Place End Node";
              } else {
                instructionElement.textContent = "Press Spacebar To Run";
              }

              // if another start node exists, reset background color
              if (this.grid.start) {
                this.grid.start.element.style.backgroundColor =
                  "rgb(244, 244, 244)";
              }

              // set new start node, update color
              this.grid.grid[i][j].isWall = false;
              this.grid.start = this.grid.grid[i][j];
              gridCellElement.style.backgroundColor =
                this.modes["start"].clickColor;
              this.activeMode = "stop";
            }
            break;
          case "stop":
            // update instructions
            if (this.grid.grid[i][j] !== this.grid.start) {
              if (!this.grid.start) {
                instructionElement.textContent = "Place Start Node";
              } else {
                instructionElement.textContent = "Press Spacebar To Run";
              }

              // if another stop node exists, reset background color
              if (this.grid.stop) {
                this.grid.stop.element.style.backgroundColor =
                  "rgb(244, 244, 244)";
              }

              // set new start node, update color
              this.grid.grid[i][j].isWall = false;
              this.grid.stop = this.grid.grid[i][j];
              gridCellElement.style.backgroundColor =
                this.modes["stop"].clickColor;
              this.activeMode = "wall";
            }
            break;
          default:
            // sets grid cell to a wall if not start or stop node
            if (
              this.grid.grid[i][j] !== this.grid.start &&
              this.grid.grid[i][j] !== this.grid.stop
            ) {
              this.grid.grid[i][j].isWall = true;
              gridCellElement.style.backgroundColor =
                this.modes["wall"].clickColor;
            }
        }
      }
    });

    // event listeners for hover color based on activeMode
    gridCellElement.addEventListener("mouseover", () => {
      if (!this.locked) {
        this.currentHoveredElement = gridCellElement;
        // check if the background color is any clickColor before updating
        if (
          gridCellElement.style.backgroundColor !==
            this.modes["start"].clickColor &&
          gridCellElement.style.backgroundColor !==
            this.modes["stop"].clickColor &&
          gridCellElement.style.backgroundColor !==
            this.modes["wall"].clickColor
        ) {
          gridCellElement.style.backgroundColor =
            this.modes[this.activeMode].hoverColor;
        }
      } else {
        this.currentHoveredElement = null;
      }
    });
    gridCellElement.addEventListener("mouseout", () => {
      if (!this.locked) {
        if (
          gridCellElement.style.backgroundColor ===
            this.modes["start"].hoverColor ||
          gridCellElement.style.backgroundColor ===
            this.modes["stop"].hoverColor ||
          gridCellElement.style.backgroundColor ===
            this.modes["wall"].hoverColor
        ) {
          gridCellElement.style.backgroundColor = "rgb(244, 244, 244)";
        }
      } else {
        this.currentHoveredElement = null;
      }
    });
  }

  clearHoverColors() {
    for (let i = 0; i < this.grid.numRows; i += 1) {
      for (let j = 0; j < this.grid.numColumns; j += 1) {
        if (
          this.grid.grid[i][j].element.style.backgroundColor ===
            this.modes.start.hoverColor ||
          this.grid.grid[i][j].element.style.backgroundColor ===
            this.modes.stop.hoverColor ||
          this.grid.grid[i][j].element.style.backgroundColor ===
            this.modes.wall.hoverColor
        ) {
          this.grid.grid[i][j].element.style.backgroundColor =
            "rgb(244, 244, 244)";
        }
      }
    }
  }

  clearVisitedColors() {
    for (let i = 0; i < this.grid.numRows; i += 1) {
      for (let j = 0; j < this.grid.numColumns; j += 1) {
        if (
          this.grid.grid[i][j].element.style.backgroundColor ===
            "rgb(255, 165, 0)" ||
          this.grid.grid[i][j].element.style.backgroundColor ===
            "rgb(247, 43, 11)"
        ) {
          this.grid.grid[i][j].element.style.backgroundColor =
            "rgb(244, 244, 244)";
        }
      }
    }
  }

  clearAllColors() {
    for (let i = 0; i < this.grid.numRows; i += 1) {
      for (let j = 0; j < this.grid.numColumns; j += 1) {
        this.grid.grid[i][j].element.style.backgroundColor =
          "rgb(244, 244, 244)";
      }
    }
  }
}

const gridUI = new GridUI();
const grid = new Grid(gridUI, 20, 12);
gridUI.setGrid(grid);

window.addEventListener("keydown", function (event) {
  const instructionElement = document.getElementById("run");
  switch (event.key) {
    case "ArrowLeft":
      if (gridUI.currentHoveredElement && !gridUI.locked) {
        if (
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["start"].clickColor &&
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["stop"].clickColor &&
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["wall"].clickColor
        ) {
          gridUI.currentHoveredElement.style.backgroundColor =
            gridUI.modes.stop.hoverColor;
        }
      }
      gridUI.activeMode = "stop";
      break;
    case "ArrowRight":
      if (gridUI.currentHoveredElement && !gridUI.locked) {
        if (
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["start"].clickColor &&
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["stop"].clickColor &&
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["wall"].clickColor
        ) {
          gridUI.currentHoveredElement.style.backgroundColor =
            gridUI.modes.start.hoverColor;
        }
      }
      gridUI.activeMode = "start";
      break;
    case "ArrowUp":
      if (gridUI.currentHoveredElement) {
        if (
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["start"].clickColor &&
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["stop"].clickColor &&
          gridUI.currentHoveredElement.style.backgroundColor !==
            gridUI.modes["wall"].clickColor
        ) {
          gridUI.currentHoveredElement.style.backgroundColor =
            gridUI.modes.wall.hoverColor;
        }
      }
      gridUI.activeMode = "wall";
      break;
    case " ":
      if (!grid.start && !grid.stop) {
        instructionElement.textContent = "Place Start Node";
      } else if (!grid.stop) {
        instructionElement.textContent = "Place End Node";
      } else if (!grid.start) {
        instructionElement.textContent = "Place Start Node";
      } else {
        instructionElement.textContent = "Press Spacebar To Run";
      }
      if (gridUI.locked) {
        gridUI.clearVisitedColors();
        gridUI.locked = false;
      } else {
        grid.bfs();
      }
      break;
    case "Escape":
      instructionElement.textContent = "Place Start Node";
      grid.clearGrid();
      gridUI.clearGrid();
      gridUI.locked = false;
      break;
  }
});

const infoButton = document.getElementById("info");
infoButton.addEventListener("mouseenter", () => {
  isMouseOver = true;
  setTimeout(() => {
    if (isMouseOver) {
      const modalBackground = document.getElementById("modalBackground");
      const modalContent = document.getElementById("modalContent");
      modalBackground.style.display = "block";
      modalContent.style.display = "block";
    }
  }, 750);
});

infoButton.addEventListener("mouseleave", () => {
  isMouseOver = false;
  const modalBackground = document.getElementById("modalBackground");
  const modalContent = document.getElementById("modalContent");
  modalBackground.style.display = "none";
  modalContent.style.display = "none";
});
