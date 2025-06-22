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
        print(maze.solve_bfs_dfs(text_file, sys.argv[2]))
    elif sys.argv[2] == 'gbfs' or sys.argv[2] == 'as':
        print(maze.solve_gbfs_as(text_file, sys.argv[2]))
    elif sys.argv[2] == 'backtracking':
        print(maze.solve_backtracking(text_file))
    elif sys.argv[2] == 'depthlimited':
        print(maze.solve_depthlimited(text_file, limit=30))
    elif sys.argv[2] == 'ids':
        print(maze.solve_ids(text_file, limit=30))
    elif sys.argv[2] == 'idas':
        print(maze.solve_idas(text_file, limit=30))

if __name__ == '__main__':
    main()