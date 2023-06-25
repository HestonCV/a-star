# breadth-first-search
This tool allows you to interactively set up and run a Breadth-First Search (BFS) algorithm on a grid. You can place a Start node, an End node, and Wall nodes that the algorithm cannot pass through. Once your nodes are placed, you can run the algorithm and observe the shortest path found.

Here are the controls:

  Left and Right Arrows: Use these to toggle between placing the Start node and the End node. You can only place one of each.

  Up Arrow: Switch to Wall node placement mode. In this mode, you can place as many Wall nodes as you like. These nodes represent barriers that the algorithm cannot pass through.

  Spacebar: This key has two functions:
      Run the Algorithm: If the algorithm has not yet been run, pressing the Spacebar will start it. The algorithm will calculate the shortest path from the Start node to the End node, avoiding any Wall nodes.
      Reset the Algorithm: If the algorithm has already been run, pressing the Spacebar will reset it. This allows you to run the algorithm again without removing the nodes you've placed.

Escape: This will clear all the nodes you've placed on the grid, allowing you to start fresh.

Remember to place both the Start and End nodes before running the algorithm.
