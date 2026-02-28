# 🧩 Introduction to AI: Maze Solver

A powerful web-based visualization tool and command-line engine for solving complex mazes using classic Artificial Intelligence search algorithms. This project was developed for the **COS30019 Introduction to AI** course.

---

## 🚀 Key Features

* **Real-time Visualization:** An interactive **React + Vite** dashboard allows you to watch algorithms explore search spaces and find paths cell-by-cell.
* **Diverse Algorithm Suite:**
    * **Uninformed Search:** Breadth-First (BFS), Depth-First (DFS), Depth Limited Search, and Iterative Deepening (IDS).
    * **Informed Search:** Greedy Best-First Search (GBFS) and A* Search (AS).
    * **Optimization/Other:** Iterative Deepening A* (IDAS) and Backtracking.
* **Flexible Maze Logic:** Supports grid-based mazes with custom starting coordinates and multiple potential goal locations.

---

## 📂 Project Structure

```text
├── backend/                # Python search engine & Flask API
│   ├── maze.py             # Core maze logic and state management
│   ├── search.py           # CLI entry point for algorithms
│   ├── server.py           # Flask server for frontend communication
│   ├── node.py             # Search tree node structures
│   ├── frontier.py         # Queue/Stack/Priority Queue implementations
│   └── test/               # Maze configuration files (.txt)
├── frontend/               # React visualization dashboard
│   └── src/                # UI components and logic
└── Assignment1_Report.pdf  # Technical analysis and performance reports
```

---

## 🛠️ Setup and Installation

### 1. Backend Setup (Python)
Navigate to the backend directory and install the required dependencies:

```bash
cd backend
pip install flask flask-cors
# Run the API server
python server.py
```

### 2. Frontend Setup (React)
Open a new terminal, navigate to the frontend directory, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

---

## 💻 Usage

### Web Interface
Once both servers are running, visit [http://localhost:5173](http://localhost:5173).
1. **Select** a maze configuration from the dropdown.
2. **Choose** a search algorithm.
3. **Watch** the "Search" (explored) and "Path" (solution) cells update in real-time.

### Command Line Interface
Run the search engine directly for raw performance data and path coordinates:

```bash
python search.py <maze_file_path> <method>
```

| Method | Algorithm |
| :--- | :--- |
| `BFS` | Breadth-First Search |
| `DFS` | Depth-First Search |
| `GBFS` | Greedy Best-First Search |
| `AS` | A* Search |
| `IDS` | Iterative Deepening Search |
| `CUS1` | Depth Limited Search |
| `CUS2` | Backtracking |

**Example:**

```bash
python search.py test/maze_0.txt BFS
```

---

## 📝 Technical Report
For a deep dive into algorithm complexity, time/space performance comparisons, and heuristic evaluations, please refer to the included **[Assignment1_Report.pdf](./Assignment1_Report.pdf)**.