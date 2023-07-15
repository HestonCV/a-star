class Grid {
  constructor(numColumns, numRows) {
    this.startNodeExists = false;
    this.endNodeExists = false;
    this.grid = new Array(numRows);
    this.gridElement = document.querySelector(".grid");
    this.numColumns = numColumns;
    this.numRows = numRows;
    this.createGrid(numColumns, numRows);
    this.activeMode = "start";
    this.currentHoveredElement = null;
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
    this.start = {
      x: null,
      y: null,
      node: null,
    };
    this.stop = {
      x: null,
      y: null,
      node: null,
    };
    this.locked = false;
  }

  async bfs() {
    this.locked = true;
    this.clearHoverColors(20, 12);
    if (this.start.node === null || this.stop.node === null) {
      console.log("Start or stop node is not defined");
      this.locked = false;
      return;
    }

    let queue = [];
    let visited = new Set();
    let previous = new Map();

    queue.push(this.start.node);
    visited.add(this.start.node);

    while (queue.length > 0) {
      let current = queue.shift();
      // Add neighbors to the queue
      const neighbors = this.getNeighbors(current);
      for (let neighbor of neighbors) {
        if (!this.locked) {
          return;
        }
        if (neighbor === this.stop.node) {
          console.log("Found the stop node");
          previous.set(neighbor, current);
          this.drawShortestPath(previous);
          this.clearHoverColors(20, 12);
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
    this.clearHoverColors(20, 12);
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
    let node = this.stop.node;
    while (node !== this.start.node) {
      node = previous.get(node);
      if (node !== this.start.node) {
        node.element.style.backgroundColor = "rgb(247, 43, 11)";
      }
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  createGrid(numColumns, numRows) {
    for (let i = 0; i < numRows; i += 1) {
      this.grid[i] = new Array(numColumns);
      for (let j = 0; j < numColumns; j += 1) {
        // create grid cell and add to grid parent
        const gridCellElement = document.createElement("div");
        this.gridElement.appendChild(gridCellElement);

        // initialize grid cell object
        this.grid[i][j] = {
          x: i,
          y: j,
          element: gridCellElement,
          isWall: false,
          neighbors: [],
        };
        this.initEventListeners(gridCellElement, i, j);
      }
    }
  }

  clearHoverColors(numColumns, numRows) {
    for (let i = 0; i < numRows; i += 1) {
      for (let j = 0; j < numColumns; j += 1) {
        if (
          this.grid[i][j].element.style.backgroundColor ===
            this.modes.start.hoverColor ||
          this.grid[i][j].element.style.backgroundColor ===
            this.modes.stop.hoverColor ||
          this.grid[i][j].element.style.backgroundColor ===
            this.modes.wall.hoverColor
        ) {
          this.grid[i][j].element.style.backgroundColor = "rgb(244, 244, 244)";
        }
      }
    }
  }

  clearVisitedColors() {
    for (let i = 0; i < this.numRows; i += 1) {
      for (let j = 0; j < this.numColumns; j += 1) {
        if (
          this.grid[i][j].element.style.backgroundColor ===
            "rgb(255, 165, 0)" ||
          this.grid[i][j].element.style.backgroundColor === "rgb(247, 43, 11)"
        ) {
          this.grid[i][j].element.style.backgroundColor = "rgb(244, 244, 244)";
        }
      }
    }
  }

  clearGrid() {
    this.startNodeExists = false;
    this.endNodeExists = false;
    this.stop.x = null;
    this.stop.y = null;
    this.stop.node = null;
    this.start.x = null;
    this.start.y = null;
    this.start.node = null;
    this.activeMode = "start";
    this.clearAllColors();
  }

  clearAllColors() {
    for (let i = 0; i < this.numRows; i += 1) {
      for (let j = 0; j < this.numColumns; j += 1) {
        this.grid[i][j].element.style.backgroundColor = "rgb(244, 244, 244)";
        this.grid[i][j].isWall = false;
      }
    }
  }

  initEventListeners(gridCellElement, i, j) {
    // if the grids cell element is clicked
    gridCellElement.addEventListener("click", () => {
      const instructionElement = document.getElementById("run");
      if (!this.locked) {
        switch (this.activeMode) {
          case "start":
            this.startNodeExists = true;
            if (!this.endNodeExists) {
              console.log("testend");
              instructionElement.textContent = "Place End Node";
            } else {
              instructionElement.textContent = "Press Spacebar To Run";
            }
            if (i !== this.stop.x || j !== this.stop.y) {
              if (this.start.x !== null) {
                this.grid[this.start.x][
                  this.start.y
                ].element.style.backgroundColor = "rgb(244, 244, 244)";
              }
              this.start.x = i;
              this.start.y = j;
              this.start.node = this.grid[i][j];
              gridCellElement.style.backgroundColor =
                this.modes["start"].clickColor;
              this.grid[i][j].isWall = false;
            }
            this.activeMode = "stop";
            break;
          case "stop":
            this.endNodeExists = true;
            if (!this.startNodeExists) {
              console.log("testend");
              instructionElement.textContent = "Place Start Node";
            } else {
              instructionElement.textContent = "Press Spacebar To Run";
            }
            if (i !== this.start.x || j !== this.start.y) {
              if (this.stop.x !== null) {
                this.grid[this.stop.x][
                  this.stop.y
                ].element.style.backgroundColor = "rgb(244, 244, 244)";
              }
              this.stop.x = i;
              this.stop.y = j;
              this.stop.node = this.grid[i][j];
              gridCellElement.style.backgroundColor =
                this.modes["stop"].clickColor;
              this.grid[i][j].isWall = false;
            }
            this.activeMode = "wall";
            break;
          default:
            // sets grid cell to a wall
            if (
              (i !== this.start.x || j !== this.start.y) &&
              (i !== this.stop.x || j !== this.stop.y)
            ) {
              this.grid[i][j].isWall = true;
              gridCellElement.style.backgroundColor =
                this.modes["wall"].clickColor;
            }
            console.log(this.grid[i][j].x, this.grid[i][j].y);
            console.log(this.grid[i][j].neighbors);
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
}

const grid = new Grid(20, 12);

window.addEventListener("keydown", function (event) {
  const instructionElement = document.getElementById("run");
  switch (event.key) {
    case "ArrowLeft":
      if (grid.currentHoveredElement && !grid.locked) {
        if (
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["start"].clickColor &&
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["stop"].clickColor &&
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["wall"].clickColor
        ) {
          grid.currentHoveredElement.style.backgroundColor =
            grid.modes.stop.hoverColor;
        }
      }
      grid.activeMode = "stop";
      break;
    case "ArrowRight":
      if (grid.currentHoveredElement && !grid.locked) {
        if (
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["start"].clickColor &&
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["stop"].clickColor &&
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["wall"].clickColor
        ) {
          grid.currentHoveredElement.style.backgroundColor =
            grid.modes.start.hoverColor;
        }
      }
      grid.activeMode = "start";
      break;
    case "ArrowUp":
      if (grid.currentHoveredElement) {
        if (
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["start"].clickColor &&
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["stop"].clickColor &&
          grid.currentHoveredElement.style.backgroundColor !==
            grid.modes["wall"].clickColor
        ) {
          grid.currentHoveredElement.style.backgroundColor =
            grid.modes.wall.hoverColor;
        }
      }
      grid.activeMode = "wall";
      break;
    case " ":
      if (!grid.startNodeExists && !grid.endNodeExists) {
        instructionElement.textContent = "Place Start Node";
      } else if (!grid.endNodeExists) {
        instructionElement.textContent = "Place End Node";
      } else if (!grid.startNodeExists) {
        instructionElement.textContent = "Place Start Node";
      } else {
        instructionElement.textContent = "Press Spacebar To Run";
      }
      if (grid.locked) {
        grid.clearVisitedColors();
        grid.locked = false;
      } else {
        grid.bfs();
      }
      break;
    case "Escape":
      instructionElement.textContent = "Place Start Node";
      grid.clearGrid();
      grid.locked = false;
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
