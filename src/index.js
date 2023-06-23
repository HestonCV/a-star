class Grid {
  constructor(numColumns, numRows) {
    this.grid = new Array(numRows);
    this.gridElement = document.querySelector(".grid");
    this.createGrid(numColumns, numRows);
    this.activeMode = "start";
    this.currentHoveredElement = null;
    this.modes = {
      start: {
        clickColor: "rgb(0, 191, 255)",
        hoverColor: "rgb(166, 233, 255)",
      },
      stop: {
        clickColor: "rgb(72, 208, 72)",
        hoverColor: "rgb(150, 224, 150)",
      },
      wall: {
        clickColor: "rgb(88, 88, 88)",
        hoverColor: "rgb(183, 183, 183)",
      },
    };
    this.start = {
      x: null,
      y: null,
    };
    this.stop = {
      x: null,
      y: null,
    };
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

        // if the grids cell element is clicked
        gridCellElement.addEventListener("click", () => {
          switch (this.activeMode) {
            case "start":
              if (i !== this.stop.x || j !== this.stop.y) {
                if (this.start.x !== null) {
                  this.grid[this.start.x][
                    this.start.y
                  ].element.style.backgroundColor = "rgb(244, 244, 244)";
                }
                this.start.x = i;
                this.start.y = j;
                gridCellElement.style.backgroundColor =
                  this.modes["start"].clickColor;
                this.grid[i][j].isWall = false;
              }
              this.activeMode = "stop";
              break;
            case "stop":
              if (i !== this.start.x || j !== this.start.y) {
                if (this.stop.x !== null) {
                  this.grid[this.stop.x][
                    this.stop.y
                  ].element.style.backgroundColor = "rgb(244, 244, 244)";
                }
                this.stop.x = i;
                this.stop.y = j;
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
          }
        });

        // event listeners for hover color based on activeMode
        gridCellElement.addEventListener("mouseover", () => {
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
        });
        gridCellElement.addEventListener("mouseout", () => {
          this.currentHoveredElement = null;
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
        });
      }
    }
  }
}

const grid = new Grid(20, 12);

window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowLeft":
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
            grid.modes.stop.hoverColor;
        }
      }
      grid.activeMode = "stop";
      break;
    case "ArrowRight":
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
  }
});
