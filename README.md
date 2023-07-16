# **Breadth-First Search (BFS) Visualization**

This project is a visualization tool for the Breadth-First Search (BFS) algorithm. BFS is a strategy used in computer science for exploring a graph, or in simpler terms, a network of interconnected points. BFS starts at one point and explores all the neighboring points before moving further. This ensures that the closest solution is always found first.

In the context of this interactive tool, we're using BFS to navigate a grid. The grid can be thought of as a simple maze, where each cell is a point that can be connected to its neighbors, blocked by walls that you place.

## **Features**

- Interactive grid to visualize BFS algorithm
- Ability to place start and end nodes
- Ability to place wall nodes to block the algorithm
- Controls to run and reset the algorithm

## **How to Use**

1. Use the Arrow-Left key to select the "End Node" mode. Click on a cell to place the end node.
2. Use the Arrow-Right key to select the "Start Node" mode. Click on a cell to place the start node.
3. Use the Arrow-Up key to select the "Wall Node" mode. Click on cells to place wall nodes.
4. Press the Spacebar to run the algorithm. The BFS algorithm will start from the start node and find the shortest path to the end node, avoiding wall nodes.
5. Press the Escape key to reset the grid and start over.

## **Code Structure**

- `Grid`: This class represents the grid. It contains methods for creating the grid, performing the BFS algorithm, and getting the neighbors of a node.
- `GridUI`: This class handles the user interface for the grid. It contains methods for creating grid cells, handling user interactions, and updating the grid display.
- Event listeners: These handle key presses and mouse events to control the grid and run the algorithm.

## **Technologies Used**

- JavaScript for the main application logic
- HTML for the webpage structure
- CSS for styling the webpage

## **Future Improvements**

- Add more algorithms for pathfinding, such as Dijkstra's algorithm or A* search.
- Allow the user to adjust the size of the grid.
- Allow the user to adjust the speed of the algorithm animation

