'''
Maze solver where (0,0) is the top-left corner, (0,1) is down, (1,0) is right.
Receives input from frontend where maze is (rows, columns), goals is a list of tuples (x, y) with x as column and y as row,
start is a tuple (x, y) with x as column and y as row, and walls is a set of tuples (x, y) with x as column and y as row.
'''

'''
========= Step 1 =========
Import necessary libraries
'''
from frontier import Stack, Queue, PriorityQueue
from utils import *
from node import Node
import time
import sys

"""
========= Step 2 =========
Define the Maze class
"""
class Maze:
    def __init__(self, size, start, goals, walls):
        self.size = size # size is a tuple (rows, columns)
        self.start = start # start is a tuple with (x, y) where x is column and y is row
        self.goals = goals # goals is a list of tuples with (x, y) where x is column and y is row
        self.walls = walls # set of tuples with (x, y) where x is column and y is row
        self.solution = [] # the solution path


        # keep tract of the single and multiple goal search for representing in the frontend
        self.solution_single = [] # list of list of tuples (x, y) where x is column and y is row
        self.solution_multiple = [] # list of tuples (x, y) where x is column and y is row storing the path to all goals

        # keep track of the time taken for the search
        self.time_taken = 0

        # keep track of the nodes explored in order for both single and multiple goal search
        self.nodes_explored_single = [] # list of list of tuples (x, y) where x is column and y is row
        self.nodes_explored_multiple = [] # list of tuples (x, y) where x is column and y is row

        # keep track of the number of nodes explored in both single and multiple goal search
        self.num_explored_single = []
        self.num_explored_multiple = 0

        # keep track of the path length single and multiple
        self.path_length_single = []
        self.path_length_multiple = 0


    ''' Define a function to check all the possible moves'''
    def possible_actions(self, state):
        x, y = state 
        actions = [
            ('up', (x, y - 1)),
            ('left', (x - 1, y)),
            ('down', (x, y + 1)),
            ('right', (x + 1, y))
        ]
        possible_actions = []
        for action, (new_x, new_y) in actions:
            if 0 <= new_x < self.size[1] and 0 <= new_y < self.size[0] and (new_x, new_y) not in self.walls:
                possible_actions.append((action, (new_x, new_y)))
        return possible_actions
    
    ''' Define a function to reconstruct the path from the start to the goal'''
    def reconstruct_path(self, node):
        actions = []
        cells = []
        current_node = node
        while  current_node.parent is not None:
            actions.append(current_node.action)
            cells.append(current_node.state)
            current_node = current_node.parent
        actions.reverse()
        cells.reverse()
        return actions, cells

    ''' SOLVING BFS AND DFS '''
    def solve_bfs_dfs(self, algorithm='bfs'):
        start_time = time.time()
        self.explored = set()
        self.solution = []
        self.solution_single = []
        self.solution_multiple = []
        self.nodes_explored_single = []
        self.nodes_explored_multiple = []
        self.num_explored_single = []
        self.num_explored_multiple = 0
        self.path_length_single = []
        self.path_length_multiple = 0

        Frontier = Queue if algorithm == 'bfs' else Stack
        current_start = self.start
        remaining_goals = list(self.goals)
        found_goals = []

        while remaining_goals:
            frontier = Frontier()
            start_node = Node(state=current_start, parent=None, action=None)
            frontier.add(start_node)
            current_explored = []
            num_explored_single = 0
            self.explored = set()

            goal_found = False

            while not frontier.isEmpty():
                node = frontier.remove()
                self.num_explored_multiple += 1
                num_explored_single += 1
                self.explored.add(node.state)
                current_explored.append(node.state)
                self.nodes_explored_multiple.append(node.state)
                
                # Check if the current node state is any of the remaining goals
                if node.state in remaining_goals:
                    current_goal = node.state
                    found_goals.append(current_goal)
                    remaining_goals.remove(current_goal)  # Remove the found goal
                    current_start = current_goal
                    _, cells = self.reconstruct_path(node)
                    self.nodes_explored_single.append(current_explored)
                    self.num_explored_single.append(num_explored_single)
                    self.solution_single.append(cells)
                    self.solution_multiple.extend(cells)
                    self.path_length_multiple += len(cells)
                    self.path_length_single.append(len(cells))
                    num_explored_single = 0
                    current_explored = []
                    goal_found = True
                    break
            
                for action, state in self.possible_actions(node.state):
                    if not frontier.contain_state(state) and state not in self.explored:
                        child = Node(state=state, parent=node, action=action)
                        frontier.add(child)

            if not goal_found:
                self.time_taken = time.time() - start_time
                print('No Goals Found!!')
                return False
            
        self.time_taken = time.time() - start_time
        print(self.nodes_explored_multiple)
        print(self.num_explored_multiple)
        print(self.solution_multiple)
        print(self.path_length_multiple)
        print()
        print(self.nodes_explored_single)
        print(self.num_explored_single)
        print(self.solution_single)
        print(self.path_length_single)
        return True
    
    ''' SOlVING GREEDY BEST FIRST SEARCH AND ASTAR'''
    def solve_gbfs_as(self, algorithm="as"):
        start_time = time.time()
        self.explored = set()
        self.solution = []
        self.solution_single = []
        self.solution_multiple = []
        self.nodes_explored_single = []
        self.nodes_explored_multiple = []
        self.num_explored_single = []
        self.num_explored_multiple = 0
        self.path_length_single = []
        self.path_length_multiple = 0

        remaining_goals = list(self.goals)
        current_start = self.start
        found_goals = []

        while remaining_goals:
            self.explored = set()
            current_explored = []
            num_explored_single = 0
            frontier = PriorityQueue()

            # Find the closest goal using Manhattan distance
            closest_goal = min(remaining_goals, key=lambda goal: manhattan_distance(current_start, goal))
            
            # Start node setup
            start_node = Node(state=current_start, parent=None, action=None, cost=0)
            heuristic = manhattan_distance(current_start, closest_goal)
            start_node.heuristic = heuristic
            frontier.add(start_node)

            goal_found = False

            while not frontier.isEmpty():
                node = frontier.remove()
                if node.state in self.explored:
                    continue

                self.explored.add(node.state)
                current_explored.append(node.state)
                self.nodes_explored_multiple.append(node.state)
                num_explored_single += 1
                self.num_explored_multiple += 1

                # Check if we reached the closest goal
                if node.state == closest_goal:
                    current_goal = node.state
                    found_goals.append(current_goal)
                    remaining_goals.remove(closest_goal)  # Remove the specific goal we found
                    current_start = current_goal

                    _, cells = self.reconstruct_path(node)
                    self.solution_single.append(cells)
                    self.solution_multiple.extend(cells)
                    self.nodes_explored_single.append(current_explored)
                    self.num_explored_single.append(num_explored_single)
                    self.path_length_single.append(len(cells))
                    self.path_length_multiple += len(cells)

                    goal_found = True
                    break

                for action, state in self.possible_actions(node.state):
                    if not frontier.contain_state(state) and state not in self.explored:
                        # Use heuristic to the closest goal
                        heuristic = manhattan_distance(state, closest_goal)
                        cost = 0 if algorithm == "gbfs" else node.cost + 1
                        child = Node(state=state, parent=node, action=action, cost=cost, heuristic=heuristic)
                        frontier.add(child)

            if not goal_found:
                self.time_taken = time.time() - start_time
                print('No Goals Found!!')
                return False

        self.time_taken = time.time() - start_time
        print(self.nodes_explored_multiple)
        print(self.num_explored_multiple)
        print(self.solution_multiple)
        print(self.path_length_multiple)
        print()
        print(self.nodes_explored_single)
        print(self.num_explored_single)
        print(self.solution_single)
        print(self.path_length_single)
        return True

    ''' SOLVING BACKTRACKING '''
    def solve_backtracking(self):
        start_time = time.time()
        self.solution = []
        self.solution_single = []
        self.solution_multiple = []
        self.nodes_explored_single = []
        self.nodes_explored_multiple = []
        self.num_explored_single = []
        self.num_explored_multiple = 0
        self.path_length_single = []
        self.path_length_multiple = 0

        current_start = self.start
        remaining_goals = list(self.goals)

        while remaining_goals:
            path = []
            self._current_explored = []
            found_goal = None

            # Try to find any of the remaining goals using backtracking
            if self._backtrack_search(current_start, remaining_goals, path, visited=set()):
                # The found goal is stored in the last element of the path
                found_goal = path[-1]
                remaining_goals.remove(found_goal)
                
                complete_path = [current_start] + path
                self.solution_single.append(complete_path)
                self.solution_multiple.extend(complete_path)
                self.nodes_explored_single.append(self._current_explored.copy())
                self.nodes_explored_multiple.extend(self._current_explored)
                self.num_explored_single.append(len(self._current_explored))
                self.num_explored_multiple += len(self._current_explored)
                self.path_length_single.append(len(complete_path))
                self.path_length_multiple += len(complete_path)
                current_start = found_goal
            else:
                self.time_taken = time.time() - start_time
                print('No Goals Found!!')
                return False

        self.time_taken = time.time() - start_time
        print(self.nodes_explored_multiple)
        print(self.num_explored_multiple)
        print(self.solution_multiple)
        print(self.path_length_multiple)
        print()
        print(self.nodes_explored_single)
        print(self.num_explored_single)
        print(self.solution_single)
        print(self.path_length_single)
        return True

    def _backtrack_search(self, current, goals, path, visited):
        self._current_explored.append(current)
        visited.add(current)

        # Check if current position is any of the goals
        if current in goals:
            return True

        actions = self.possible_actions(current)

        for action, (nx, ny) in actions:
            next_state = (nx, ny)
            if (0 <= nx < self.size[1] and 0 <= ny < self.size[0] and 
                next_state not in self.walls and next_state not in visited):

                path.append(next_state)
                if self._backtrack_search(next_state, goals, path, visited):
                    return True
                path.pop()

        return False
    
    ''' SOLVING DEPTH LIMITED '''
    def solve_depthlimited(self, limit):
        start_time = time.time()

        # Reset all tracking data
        self.solution = []
        self.solution_single = []
        self.solution_multiple = []
        self.nodes_explored_single = []
        self.nodes_explored_multiple = []
        self.num_explored_single = []
        self.num_explored_multiple = 0
        self.path_length_single = []
        self.path_length_multiple = 0
        self.visited_by_depth_all = []

        current_start = self.start
        remaining_goals = list(self.goals)

        while remaining_goals:
            found = False  # flag to break after first reachable goal

            for goal in remaining_goals:
                path = []
                self._current_explored = []
                visited = set()
                visited_by_depth = {}

                result, found_goal = self._dls_recursive(
                    current=current_start,
                    goals=remaining_goals,
                    limit=limit,
                    path=path,
                    visited=visited,
                    visited_by_depth=visited_by_depth,
                    depth=0
                )

                if result == "found":
                    complete_path = [current_start] + path
                    self.solution_single.append(complete_path)
                    self.solution_multiple.extend(complete_path)
                    self.nodes_explored_single.append(self._current_explored.copy())
                    self.nodes_explored_multiple.extend(self._current_explored)
                    self.num_explored_single.append(len(self._current_explored))
                    self.num_explored_multiple += len(self._current_explored)
                    self.path_length_single.append(len(complete_path))
                    self.path_length_multiple += len(complete_path)
                    self.visited_by_depth_all.append(visited_by_depth)

                    current_start = found_goal
                    remaining_goals.remove(found_goal)
                    found = True
                    break

            if not found:
                self.time_taken = time.time() - start_time
                print("No reachable goal found within depth limit!")
                return False

        self.time_taken = time.time() - start_time

        # Debug print
        print("visited_by_depth_all:")
        print(self.visited_by_depth_all)
        print("nodes_explored_multiple:")
        print(self.nodes_explored_multiple)
        print("num_explored_multiple:")
        print(self.num_explored_multiple)
        print("solution_multiple:")
        print(self.solution_multiple)
        print("path_length_multiple:")
        print(self.path_length_multiple)
        print("nodes_explored_single:")
        print(self.nodes_explored_single)
        print("num_explored_single:")
        print(self.num_explored_single)
        print("solution_single:")
        print(self.solution_single)
        print("path_length_single:")
        print(self.path_length_single)

        return True

    def _dls_recursive(self, current, goals, limit, path, visited, visited_by_depth, depth):
        self._current_explored.append(current)
        visited.add(current)

        if depth not in visited_by_depth:
            visited_by_depth[depth] = []
        visited_by_depth[depth].append(current)

        if current in goals:
            return "found", current

        if limit <= 0:
            return "cutoff", None

        cutoff_occurred = False
        actions = self.possible_actions(current)

        for action, (nx, ny) in actions:
            next_state = (nx, ny)
            if (0 <= nx < self.size[1] and 0 <= ny < self.size[0] and
                next_state not in self.walls and next_state not in visited):

                path.append(next_state)
                result, found_goal = self._dls_recursive(
                    current=next_state,
                    goals=goals,
                    limit=limit - 1,
                    path=path,
                    visited=visited,
                    visited_by_depth=visited_by_depth,
                    depth=depth + 1
                )
                if result == "found":
                    return "found", found_goal
                elif result == "cutoff":
                    cutoff_occurred = True
                path.pop()

        return ("cutoff", None) if cutoff_occurred else ("failure", None)

    '''SOLVING ITERATIVE DEEPENING DEPTH FIRST SEARCH'''
    def solve_ids(self, limit):
        start_time = time.time()
        # Reset data
        self.solution = []
        self.solution_single = []
        self.solution_multiple = []
        self.nodes_explored_single = []
        self.nodes_explored_multiple = []
        self.num_explored_single = []
        self.num_explored_multiple = 0
        self.path_length_single = []
        self.path_length_multiple = 0
        self.visited_by_depth_all = []

        current_start = self.start
        remaining_goals = list(self.goals)

        while remaining_goals:
            found = False
            goal_explored = []
            visited_by_depth_combined = {}

            for depth in range(1, limit + 1):
                self._current_explored = []
                path = []
                visited = set()
                visited_by_depth = {}

                result, found_goal = self._dls_recursive(
                    current=current_start,
                    goals=remaining_goals,
                    limit=depth,
                    path=path,
                    visited=visited,
                    visited_by_depth=visited_by_depth,
                    depth=0
                )

                goal_explored.extend(self._current_explored)

                # Combine visited_by_depth
                for d, nodes in visited_by_depth.items():
                    if d not in visited_by_depth_combined:
                        visited_by_depth_combined[d] = []
                    visited_by_depth_combined[d].extend(nodes)

                if result == "found":
                    complete_path = [current_start] + path
                    self.solution_single.append(complete_path)
                    self.solution_multiple.extend(complete_path)
                    self.nodes_explored_single.append(goal_explored.copy())
                    self.nodes_explored_multiple.extend(goal_explored)
                    self.num_explored_single.append(len(goal_explored))
                    self.num_explored_multiple += len(goal_explored)
                    self.path_length_single.append(len(complete_path))
                    self.path_length_multiple += len(complete_path)
                    self.visited_by_depth_all.append(visited_by_depth_combined)

                    current_start = found_goal
                    remaining_goals.remove(found_goal)
                    found = True
                    break  # Stop further depth increases

            if not found:
                self.time_taken = time.time() - start_time
                print("Goal Not Found or Max Depth Reached!")
                return False

        self.time_taken = time.time() - start_time

        # Combine visited nodes by depth
        combined_visited_by_depth = {}
        max_depth_reached = 0
        for visited_dict in self.visited_by_depth_all:
            for depth, nodes in visited_dict.items():
                if depth not in combined_visited_by_depth:
                    combined_visited_by_depth[depth] = []
                combined_visited_by_depth[depth].extend(nodes)
                max_depth_reached = max(max_depth_reached, depth)

        # Remove duplicates per depth
        for depth in combined_visited_by_depth:
            seen = set()
            unique_nodes = []
            for node in combined_visited_by_depth[depth]:
                if node not in seen:
                    unique_nodes.append(node)
                    seen.add(node)
            combined_visited_by_depth[depth] = unique_nodes

        # Print visited info
        print(combined_visited_by_depth)
        print("nodes_explored_multiple:")
        print(self.nodes_explored_multiple)
        print("num_explored_multiple:")
        print(self.num_explored_multiple)
        print("solution_multiple:")
        print(self.solution_multiple)
        print("path_length_multiple:")
        print(self.path_length_multiple)
        print()
        print("nodes_explored_single:")
        print(self.nodes_explored_single)
        print("num_explored_single:")
        print(self.num_explored_single)
        print("solution_single:")
        print(self.solution_single)
        print("path_length_single:")
        print(self.path_length_single)

        return True


    ''' SOLVING IDAS'''
    def solve_idas(self, max_iterations=100):
        start_time = time.time()
        # Reset data
        self.solution = []
        self.solution_single = []
        self.solution_multiple = []
        self.nodes_explored_single = []
        self.nodes_explored_multiple = []
        self.num_explored_single = []
        self.num_explored_multiple = 0
        self.path_length_single = []
        self.path_length_multiple = 0
        self.visited_by_depth_all = []
        
        current_start = self.start
        remaining_goals = list(self.goals)
        
        while remaining_goals:
            current_goal = remaining_goals.pop(0)
            threshold = manhattan_distance(current_start, current_goal)
            found = False
            iterations = 0
            goal_explored = []
            visited_by_depth_combined = {}
            
            while iterations < max_iterations:
                self._current_explored = []
                path = []
                path.append(current_start)
                visited_by_depth = {}
                
                result = self._idas_search(
                    current=current_start, 
                    goal=current_goal, 
                    g_cost=0, 
                    threshold=threshold, 
                    path=path,
                    visited_by_depth=visited_by_depth,
                    depth=0
                )
                
                goal_explored.extend(self._current_explored)
                
                # Combine visited_by_depth for this goal
                for d, nodes in visited_by_depth.items():
                    if d not in visited_by_depth_combined:
                        visited_by_depth_combined[d] = []
                    visited_by_depth_combined[d].extend(nodes)
                
                if result == "found":
                    complete_path = [current_start] + path
                    self.solution_single.append(complete_path)
                    self.solution_multiple.extend(complete_path)
                    self.nodes_explored_single.append(goal_explored.copy())
                    self.nodes_explored_multiple.extend(goal_explored)
                    self.num_explored_single.append(len(goal_explored))
                    self.num_explored_multiple += len(goal_explored)
                    self.path_length_single.append(len(complete_path))
                    self.path_length_multiple += len(complete_path)
                    self.visited_by_depth_all.append(visited_by_depth_combined)
                    current_start = current_goal
                    found = True
                    break
                elif isinstance(result, (int, float)) and result != float('inf'):
                    threshold = result
                else:
                    break
                
                iterations += 1
            
            if not found:
                self.time_taken = time.time() - start_time
                print("Goal Not Found or Max Iterations Reached!")
                return False
        
        self.time_taken = time.time() - start_time
        
        # Combine visited nodes by depth
        combined_visited_by_depth = {}
        max_depth_reached = 0
        for visited_dict in self.visited_by_depth_all:
            for depth, nodes in visited_dict.items():
                if depth not in combined_visited_by_depth:
                    combined_visited_by_depth[depth] = []
                combined_visited_by_depth[depth].extend(nodes)
                max_depth_reached = max(max_depth_reached, depth)
        
        # Remove duplicates per depth
        for depth in combined_visited_by_depth:
            seen = set()
            unique_nodes = []
            for node in combined_visited_by_depth[depth]:
                if node not in seen:
                    unique_nodes.append(node)
                    seen.add(node)
            combined_visited_by_depth[depth] = unique_nodes
        
        # Print raw dictionary of visited nodes by depth
        print(combined_visited_by_depth)
        
        # Print all the data in raw format for frontend
        print("nodes_explored_multiple:")
        print(self.nodes_explored_multiple)
        print("num_explored_multiple:")
        print(self.num_explored_multiple)
        print("solution_multiple:")
        print(self.solution_multiple)
        print("path_length_multiple:")
        print(self.path_length_multiple)
        print()
        print("nodes_explored_single:")
        print(self.nodes_explored_single)
        print("num_explored_single:")
        print(self.num_explored_single)
        print("solution_single:")
        print(self.solution_single)
        print("path_length_single:")
        print(self.path_length_single)
        
        return True

    def _idas_search(self, current, goal, g_cost, threshold, path, visited_by_depth, depth):
        self._current_explored.append(current)
        
        # Track visited nodes by depth
        if depth not in visited_by_depth:
            visited_by_depth[depth] = []
        visited_by_depth[depth].append(current)
        
        f_cost = g_cost + manhattan_distance(current, goal)
        
        if f_cost > threshold:
            return f_cost
        
        if current == goal:
            return "found"
        
        minimum = float('inf')
        actions = self.possible_actions(current)
        
        for action, (nx, ny) in actions:
            if (0 <= nx < self.size[1] and 0 <= ny < self.size[0] and 
                (nx, ny) not in self.walls and (nx, ny) not in path and (nx, ny) != current):
                
                path.append((nx, ny))
                print('This is path:', path)
                print('Explore this goal:', (nx, ny))
                print('This is threshold:', threshold)
                result = self._idas_search((nx, ny), goal, g_cost + 1, threshold, path, visited_by_depth, depth + 1)
                if result == "found":
                    return "found"
                elif isinstance(result, (int, float)) and result < minimum:
                    minimum = result
                path.pop()
        
        return minimum