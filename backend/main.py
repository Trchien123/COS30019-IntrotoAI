import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Tuple, Dict
from maze import Maze
import io
from contextlib import redirect_stdout

app = FastAPI(title="Maze Solver API", version="1.0.0")

# CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class MazeRequest(BaseModel):
    maze: List[List[int]]  # maze với giá trị là [[],[]] dạng rows và columns
    start: List[int]  # start sẽ ở dạng [x,y] với x là cột và y là hàng
    goals: List[List[int]]  # goals sẽ ở dạng [[x,y]] với x là cột và y là hàng
    algorithm: str = "bfs"
    limit: Optional[int] = None  # For depth-limited and IDS algorithms

class MazeSolution(BaseModel):
    success: bool
    algorithm: str
    time_taken: float
    
    # Single goal search results
    solution_single: List[List[List[int]]]  # List of paths for each goal
    nodes_explored_single: List[List[List[int]]]  # Nodes explored for each goal
    num_explored_single: List[int]  # Number of nodes explored for each goal
    path_length_single: List[int]  # Path length for each goal
    
    # Multiple goal search results (combined)
    solution_multiple: List[List[int]]  # Combined path to all goals
    nodes_explored_multiple: List[List[int]]  # All nodes explored combined
    num_explored_multiple: int  # Total nodes explored
    path_length_multiple: int  # Total path length
    
    # Optional data for depth-based algorithms
    visited_by_depth: Optional[Dict[int, List[List[int]]]] = None
    
    # Visualization and error handling
    error_message: Optional[str] = None
    maze_visualization: Optional[List[str]] = None

def convert_maze_format(maze_2d: List[List[int]]) -> Tuple[Tuple[int, int], set]:
    """Convert 2D list maze format to size tuple and walls set"""
    rows = len(maze_2d)
    cols = len(maze_2d[0]) if rows > 0 else 0

    # Validate uniform grid
    for i, row in enumerate(maze_2d):
        if len(row) != cols:
            raise HTTPException(status_code=400, detail=f"Inconsistent row length at row {i}")

    size = (rows, cols)
    walls = set()

    for y in range(rows):
        for x in range(cols):
            if maze_2d[y][x] == 1:
                walls.add((x, y))

    return size, walls

def visualize_maze(maze_obj: Maze, show_solution: bool = True) -> List[str]:
    """Create ASCII visualization of the maze"""
    visualization = []
    
    # Convert solution paths to a set of coordinates for easy lookup
    solution_coords = set()
    if show_solution and hasattr(maze_obj, 'solution_multiple'):
        for coord in maze_obj.solution_multiple:
            solution_coords.add(tuple(coord))
    
    for y in range(maze_obj.size[0]):  # loop through rows
        row = ""
        for x in range(maze_obj.size[1]):  # loop through columns
            if show_solution and (x, y) in solution_coords and (x, y) not in maze_obj.goals:
                row += "o"  # Solution path
            elif (x, y) in maze_obj.walls:
                row += "#"  # Wall
            elif (x, y) == maze_obj.start:
                row += "S"  # Start
            elif (x, y) in maze_obj.goals:
                row += "G"  # Goal
            else:
                row += "."  # Empty space
        visualization.append(row)
    return visualization

def parse_visited_by_depth_output(output: str) -> Optional[Dict[int, List[List[int]]]]:
    """Parse the visited_by_depth dictionary from maze output"""
    try:
        lines = output.strip().split('\n')
        for line in lines:
            if line.startswith('{') and '}' in line:
                # Try to safely evaluate the dictionary
                visited_dict = eval(line)
                if isinstance(visited_dict, dict):
                    # Convert to the expected format
                    result = {}
                    for depth, coords in visited_dict.items():
                        result[int(depth)] = [[x, y] for x, y in coords]
                    return result
    except:
        pass
    return None

@app.get("/")
async def root():
    return {"message": "Maze Solver API", "version": "1.0.0"}

@app.get("/algorithms")
async def get_algorithms():
    """Get list of available algorithms"""
    return {
        "algorithms": [
            {"name": "bfs", "description": "Breadth-First Search"},
            {"name": "dfs", "description": "Depth-First Search"},
            {"name": "gbfs", "description": "Greedy Best-First Search"},
            {"name": "as", "description": "A* Search"},
            {"name": "backtracking", "description": "Backtracking Search"},
            {"name": "depthlimited", "description": "Depth-Limited Search"},
            {"name": "ids", "description": "Iterative Deepening Depth-First Search"},
            {"name": "idas", "description": "Iterative Deepening A* Search"}
        ]
    }

@app.post("/solve", response_model=MazeSolution)
async def solve_maze(request: MazeRequest):
    """Solve a maze using the specified algorithm"""
    try:
        # Validate request
        if not request.maze or not request.maze[0]:
            raise HTTPException(status_code=400, detail="Invalid maze format")
        
        if len(request.start) != 2:
            raise HTTPException(status_code=400, detail="Start position must be [x, y]")
        
        if not request.goals or any(len(goal) != 2 for goal in request.goals):
            raise HTTPException(status_code=400, detail="Goals must be list of [x, y] coordinates")
        
        # Convert maze format
        size, walls = convert_maze_format(request.maze)
        start = tuple(request.start)
        goals = [tuple(goal) for goal in request.goals]
        
        # Validate positions are within bounds
        rows, cols = size
        if not (0 <= start[0] < cols and 0 <= start[1] < rows):
            raise HTTPException(status_code=400, detail="Start position out of bounds")
        
        for i, goal in enumerate(goals):
            if not (0 <= goal[0] < cols and 0 <= goal[1] < rows):
                raise HTTPException(status_code=400, detail=f"Goal {i+1} position out of bounds")
        
        # Check if start and goals are walls
        if start in walls:
            raise HTTPException(status_code=400, detail="Start position is a wall")
        
        for i, goal in enumerate(goals):
            if goal in walls:
                raise HTTPException(status_code=400, detail=f"Goal {i+1} position is a wall")
        
        # Create maze instance
        maze = Maze(size=size, start=start, goals=goals, walls=walls)
        
        # Capture output and solve based on algorithm
        output_buffer = io.StringIO()
        success = False
        
        with redirect_stdout(output_buffer):
            try:
                if request.algorithm in ["bfs", "dfs"]:
                    success = maze.solve_bfs_dfs(algorithm=request.algorithm)
                elif request.algorithm in ["gbfs", "as"]:
                    success = maze.solve_gbfs_as(algorithm=request.algorithm)
                elif request.algorithm == "backtracking":
                    success = maze.solve_backtracking()
                elif request.algorithm == "depthlimited":
                    limit = request.limit if request.limit is not None else 10000000
                    success = maze.solve_depthlimited(limit=limit)
                elif request.algorithm == "ids":
                    limit = request.limit if request.limit is not None else 10000000
                    success = maze.solve_ids(limit=limit)
                elif request.algorithm == "idas":
                    max_iterations = request.limit if request.limit is not None else 10000000
                    success = maze.solve_idas(max_iterations=max_iterations)
                else:
                    raise HTTPException(status_code=400, detail=f"Unknown algorithm: {request.algorithm}")
            except Exception as e:
                success = False
                print(f"Algorithm execution failed: {str(e)}")
        
        # Parse output
        output = output_buffer.getvalue().strip()
        
        # Check if solution was found
        if not success:
            return MazeSolution(
                success=False,
                algorithm=request.algorithm,
                time_taken=getattr(maze, 'time_taken', 0.0),
                solution_single=[],
                nodes_explored_single=[],
                num_explored_single=[],
                path_length_single=[],
                solution_multiple=[],
                nodes_explored_multiple=[],
                num_explored_multiple=0,
                path_length_multiple=0,
                error_message="No solution found",
                maze_visualization=visualize_maze(maze, show_solution=False)
            )
        
        # Generate visualization
        visualization = visualize_maze(maze, show_solution=True)
        
        # Parse visited_by_depth if available (for depth-based algorithms)
        visited_by_depth = None
        if request.algorithm in ["depthlimited", "ids", "idas"]:
            visited_by_depth = parse_visited_by_depth_output(output)
        
        # Convert maze data to API format
        solution_single = []
        for path in maze.solution_single:
            solution_single.append([[x, y] for x, y in path])
        
        nodes_explored_single = []
        for nodes in maze.nodes_explored_single:
            nodes_explored_single.append([[x, y] for x, y in nodes])
        
        solution_multiple = [[x, y] for x, y in maze.solution_multiple]
        nodes_explored_multiple = [[x, y] for x, y in maze.nodes_explored_multiple]
        
        return MazeSolution(
            success=True,
            algorithm=request.algorithm,
            time_taken=maze.time_taken,
            solution_single=solution_single,
            nodes_explored_single=nodes_explored_single,
            num_explored_single=maze.num_explored_single,
            path_length_single=maze.path_length_single,
            solution_multiple=solution_multiple,
            nodes_explored_multiple=nodes_explored_multiple,
            num_explored_multiple=maze.num_explored_multiple,
            path_length_multiple=maze.path_length_multiple,
            visited_by_depth=visited_by_depth,
            maze_visualization=visualization
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/visualize")
async def visualize_maze_endpoint(request: MazeRequest):
    try:
        size, walls = convert_maze_format(request.maze)
        start = tuple(request.start)
        goals = [tuple(goal) for goal in request.goals]
        
        maze = Maze(size=size, start=start, goals=goals, walls=walls)
        visualization = visualize_maze(maze, show_solution=False)
        
        return {
            "visualization": visualization,
            "size": {"rows": size[0], "cols": size[1]},
            "start": request.start,
            "goals": request.goals
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating visualization: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)