
Introduction to AI: Maze Solver
This project is a web-based maze solver developed for the COS30019 course. It features a React-based frontend for maze visualization and a Python backend that implements various search algorithms to navigate mazes of different complexities.

Features
Interactive Frontend: A React + Vite dashboard that allows users to visualize maze solving in real-time.

Comprehensive Search Algorithms: Implements multiple search techniques including:

Breadth-First Search (BFS)

Depth-First Search (DFS)

Greedy Best-First Search (GBFS)

A* Search (AS)

Iterative Deepening A* (IDAS)

Depth Limited Search

Backtracking

Maze Support: Capable of handling various maze configurations with defined start points and multiple goal locations.

Project Structure
backend/: Contains the Python implementation of search algorithms and server logic.

maze.py: Core logic for maze representation and state management.

search.py: Command-line interface for running individual search methods.

server.py: Flask-based server to communicate with the frontend.

node.py & frontier.py: Data structures used by search algorithms.

frontend/: A modern web interface built with React.

Assignment1_Report.pdf: Detailed documentation and analysis of the search algorithms used.

Setup and Installation
Backend Setup
Navigate to the backend directory.

Install dependencies (if specified in a virtual environment):

Bash
pip install flask flask-cors
Run the server:

Bash
python server.py
Frontend Setup
Navigate to the frontend directory.

Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
Usage
Web Interface
Access the dashboard via the frontend URL (typically http://localhost:5173) to select search algorithms and visualize the solving process.

Command Line
You can also run search algorithms directly from the terminal:

Bash
python search.py <maze_file.txt> <method>
Example:

Bash
python search.py test/maze_0.txt BFS
