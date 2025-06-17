import re

# Create a read_maze function(file) -> return the walls, start, and goals
def read_maze(file):
    # Open the file to read line by lines 
    with open(file, 'r') as file:
        if (file):
            lines = file.readlines()
        else:
            print(f'Cannot open the {file}')
            return
    
    # Define the list of goals, walls and start
    size = []
    walls = []
    start = []
    goals = []

    # Read line by lines and append the walls, start and stop
    for index, line in enumerate(lines):
        # if line == 0, then store the size of maze into list
        if index == 0:
            size = list(map(int, re.findall(r'\d+', line)))
        # if line == 1, then extract the value -> int and store in tuple -> start
        elif index == 1:
            start = tuple(map(int, re.findall(r'\d+', line)))
        # if line == 2, then extract the value -> int and store in tuple -> goals
        elif index == 2:
            parts = line.split('|')
            for part in parts:
                goals.append(tuple(map(int, re.findall(r'\d+', part))))
        # else extract all the values, then draw the walls
        else:
            block = list(map(int, re.findall(r'\d+', line)))
            x, y = block[0], block[1]
            for height in range(block[2]):
                for width in range(block[3]):
                    walls.append((x + height, y + width))
    return size, start, goals, walls


# defint eh manhattan_distance function to calculate the path cost
def manhattan_distance(current_node, goal_node):
    x_current, y_current = current_node
    x_goal, y_goal = goal_node
    distance = abs(x_goal - x_current) + abs(y_goal - y_current)
    return distance