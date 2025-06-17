"""
Define the node which will hold:
+ State: its current position
+ Parent: which is its parents' node
+ Action: which is the current to move to it.
+ Cost: the cost of this node depending on the search algorithm that we use.
"""

class Node:
    def __init__(self, state, parent, action, cost=0, heuristic=0):
        self.state = state # State will be in form (i, j) (x and y coordinate)
        self.parent = parent # Parent here will be the Node() which originated from
        self.action = action # Action here will be right, left, up, down
        self.cost = cost # Cost will be a numeric value, using for tracking
        self.heuristic = heuristic # Heuristic depending on search algorithm
    
    def total_cost(self):
        return self.cost + self.heuristic

    def __lt__(self, other):
        return self.total_cost() < other.total_cost()