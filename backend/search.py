import sys
from maze import *

def main():
    # Check whether the command-line argument is acceptable or not
    if len(sys.argv) != 3:
        print("The command should follow 'python search.py <file_name> method'!!")
        return

    # Read the text file to form the maze
    text_file = sys.argv[1]
    size, start, goals, walls = read_maze(text_file)

    # Initialize the maze with the size, start, goals and walls
    maze = Maze(size, start, goals, walls)

    # Solve the maze and return the result
    if sys.argv[2] == 'bfs' or sys.argv[2] == 'dfs':
        maze.solve_bfs_dfs(sys.argv[2])
    elif sys.argv[2] == 'gbfs' or sys.argv[2] == 'as':
        maze.solve_gbfs_as(sys.argv[2])
    elif sys.argv[2] == 'backtracking':
        maze.solve_backtracking()
    elif sys.argv[2] == 'depthlimited':
        maze.solve_depthlimited(limit=30)
    elif sys.argv[2] == 'ids':
        maze.solve_ids(limit=15)
    elif sys.argv[2] == 'idas':
        maze.solve_idas()

if __name__ == '__main__':
    main()