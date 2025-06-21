'''
I set the goal for myself that i am gonna finish all these codes within this night.
I will do it myself, understand clearly what i am doing, and not copy paste.
'''

'''
--------------------------- STEP 1 ---------------------------
First to create a server that can handle requests using FastAPI.
We need to import some necessary modules, including: 
+ FastAPI for creating the server -> from fastapi
+ HTTPException for handing HTTP errors -> from fastapi
+ CORSMiddleware for handing CORS (Cross-Origin Resource Sharing) -> from fastapi.middleware.cors
+ BaseModel for data validation -> from pydantic
+ uvicorn for running the server -> import uvicorn
+ other necessary modules for handling requests and responses.
'''
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from maze import Maze
import uvicorn


'''
--------------------------- STEP 2 ---------------------------
Next, we need to create an instance of FastAPI and configure CORS middleware.
'''
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://maze-searching-visualizer.vercel.app', 'http://localhost:5173'], # this is the origin of the frontend app
    allow_credentials=True,
    allow_methods=['*'], # allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=['*'] # allow all headers
)

'''
--------------------------- STEP 3 ---------------------------
Now, we have to use the BaseModel to create the data model for the request and response.
'''
# In the request, we define the parameters that the users will send to the server.
# This should follows the structure of the solving maze algorithms
class MazeRequest(BaseModel):
    maze: list[list[int]] # this is the 2D array of the maze
    start: tuple[int, int] # this is the starting point of the maze (x, y)
    goals: list[tuple[int, int]] # this is the list of goals in the maze (x, y)
    algorithm: str # this is the algorithm that the users want to use
    depth_limit: int | None = None

# Then, we will define the structure of the response that the server will send back to the users.
# Because the backend will send back to the users so we want to make sure all the values in the response will be used in the frontend.
class MazeResponse(BaseModel):
    success: bool # this is the status of the maze, whether the maze is solved or not
    algorithm: str # this is the algorithm that the users used
    solution_single: list[list[tuple[int, int]]] # this is the list of the solution for the maze, each element is a list of tuples (x, y) representing the path
    solution_multiple: list[tuple[int, int]] # this is the list containing all the points in the maze that are part of the solution
    time_taken: float # this is the time needed to solve the maze in seconds
    nodes_explored_single: list[list[tuple[int, int]]] # this list contains the list of nodes for each single path
    nodes_explored_multiple: list[tuple[int, int]] # this is the list of nodes that were explored during the solving process
    num_explored_multiple: int # this is the number of nodes that were explored during the solving process
    num_explored_single: list[int] # this is the list of number of nodes explored for each single path
    path_length_single: list[int] # this is the list of path lengths for each single goal
    path_length_multiple: int # this is the length of the path that was found for all the goals

'''
--------------------------- STEP 4 ---------------------------
Now, we will create some endpoints to handle the requests from the users.
+ / - to get the welcome message - Mainly for debugging purposes - GET
+ /solve - to solve the maze with the given parameters - POST
+ def a function change the maze into size and walls to pass into the solving algorithm
'''
def convert_maze_to_size_and_walls(maze: list[list[int]]):
    rows = len(maze)
    cols = len(maze[0]) if rows > 0 else 0
    size = (rows, cols) # Get the size of the maze as (rows, cols)
    walls = set()
    
    for i in range(rows):
        for j in range(cols):
            if maze[i][j] == 1:
                walls.add((j, i))  # Store walls as (x, y) tuples
    
    return size, walls

@app.get('/')
async def welcome():
    return {'message': 'Welcome to the Maze Solver API! Please use the /solve endpoint to solve a maze.'}

@app.post('/solve', response_model=MazeResponse)
async def solve_maze(request: MazeRequest):
    # Here, we will handle the request and solve the maze using the given parameters.
    try:
        # First, we need to check whether the maze is valid or not.
        if not request.maze or not isinstance(request.maze, list) or not all(isinstance(row, list) for row in request.maze):
            raise HTTPException(status_code=400, detail='Invalid maze format. Maze should be a 2D array of integers.')
        
        # Second, we need to check whether the start point is valid or not.
        if not isinstance(request.start, tuple) or len(request.start) != 2 or not all(isinstance(coordinate, int) for coordinate in request.start):
            raise HTTPException(status_code=400, detail='Invalid start point format. Start point should be a tuple of two integers (x, y).')

        # Third, we need to check whether the end points are valid or not.
        if not isinstance(request.goals, list) or not all(isinstance(goal, tuple) and len(goal) == 2 and all(isinstance(coordinate, int) for coordinate in goal) for goal in request.goals):
            raise HTTPException(status_code=400, detail='Invalid goals format. Goals should be a list of tuples (x, y).')
        
        # If everything is valid, we will call the solving algorithm with the given parameters.
        # First, we need to convert the maze to size and walls to pass into the solving algorithm.
        size, walls = convert_maze_to_size_and_walls(request.maze)

        # Then, we need to set the start point with the correct format.
        start = tuple(request.start)

        # Then, we need to set the goals with the correct format.
        goals = [tuple(goal) for goal in request.goals]

        # Now, we can call the solving algorithm with the given parameters.
        # Now, we will create a maze instance with teh parameters.
        maze_instance = Maze(size, start, goals, walls)

        # Map frontend algorithm names to backend algorithm names
        algorithm_mapping = {
            'bfs': 'bfs',
            'dfs': 'dfs',
            'gbfs': 'gbfs',  # Changed from 'greedy' to 'gbfs'
            'as': 'as',      # Changed from 'astar' to 'as'
            'backtracking': 'backtracking',
            'depthlimited': 'depthlimited',
            'ids': 'ids',    # Changed from 'iddfs' to 'ids'
            'idas': 'idas'   # Changed from 'idastar' to 'idas'
        }

        # Get the correct algorithm name
        algorithm = algorithm_mapping.get(request.algorithm)
        if not algorithm:
            raise HTTPException(status_code=400, detail=f"Unknown algorithm: {request.algorithm}")

        # Now, we will call the solve method of the maze instance with the given algorithm and search strategy.
        if algorithm in ["bfs", "dfs"]:
            result = maze_instance.solve_bfs_dfs(algorithm=algorithm)
        elif algorithm in ["gbfs", "as"]:
            result = maze_instance.solve_gbfs_as(algorithm=algorithm)
        elif algorithm == "backtracking":
            result = maze_instance.solve_backtracking()
        elif algorithm == "depthlimited":
            result = maze_instance.solve_depthlimited(limit=request.depth_limit or 100)
        elif algorithm == "ids":
            result = maze_instance.solve_ids(limit=request.depth_limit or 100)
        elif algorithm == "idas":
            result = maze_instance.solve_idas()
        else:
            raise HTTPException(status_code=400, detail=f"Unknown algorithm: {algorithm}")

        return MazeResponse(
            success=result,
            algorithm=request.algorithm,
            solution_single=maze_instance.solution_single,
            solution_multiple=maze_instance.solution_multiple,
            time_taken=maze_instance.time_taken,
            nodes_explored_single=maze_instance.nodes_explored_single,
            nodes_explored_multiple=maze_instance.nodes_explored_multiple,
            num_explored_multiple=maze_instance.num_explored_multiple,
            num_explored_single=maze_instance.num_explored_single,
            path_length_single=maze_instance.path_length_single,
            path_length_multiple=maze_instance.path_length_multiple
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)