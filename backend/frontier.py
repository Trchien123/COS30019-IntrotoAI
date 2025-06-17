import heapq

"""
We have to define three main frontiers, including the Stack() ->
dealing with depth first search (DFS), Queue() -> dealing with 
breadth first search (BFS) and PriorityQueue() -> dealing with 
heuristic search (informed search)
"""

#---------------------------FRONTIER Class----------------------------#
"""
The frontier class will have some built-in function, including:
+ isEmpty(): to check whether the frontier is empty or not -> later be
used to get the result of the search.
+ add(): to add node into frontier
+ contain_state(): to check whether the frontier contain the goal or not
+ remove(): this will be an abstract function, depending on the type of 
search.
"""
class Frontier:
    def __init__(self):
        self.frontier = []

    def isEmpty(self):
        return len(self.frontier) == 0
    
    def add(self, node):
        self.frontier.append(node)

    def contain_state(self, state):
        return any(node.state == state for node in self.frontier)
    
    def remove(self):
        pass

#-----------------------------STACK (DFS)-----------------------------#
"""
Depth First Search (DFS) will try to go as deep as possible into a branch 
of a tree, there for the lastest node being explore, will be next to be 
explored (Last In First Out - LIFO)
"""

class Stack(Frontier):
    def remove(self):
        if (self.isEmpty()):
            raise Exception('The Stack Frontier is empty!!')
        else:
            node = self.frontier.pop()
            return node

#-----------------------------QUEUE (BFS)-----------------------------#
"""
Breadth First Search (BFS) will try to explore all the shallowest nodes, 
so the nodes that go into the frontier will be removed by order. Therefore,
we are gonna use the Queue Frontier (First In First Out - FIFO)
"""

class Queue(Frontier):
    def remove(self):
        if self.isEmpty():
            raise Exception('The Queue Frontier is empty!!!')
        else:
            node = self.frontier.pop(0)
            return node

#---------------------------HEURISTIC SEARCH---------------------------#
"""
We will create the PriorityQueue for both Greedy Best First Search (GBFS)
and A Star (A*). Those two search algorithms will rely on the heuristic
function to decide the nodes to remove:
+ Greedy Best First Search: This will use the cost function which calculate
the estimated path cost to the destination.
+ A Star: This will use the number of explored steps plus the estimated path
cost to choose the nodes to remove.
"""
class PriorityQueue(Frontier):
    def add(self, node):
        heapq.heappush(self.frontier, node)

    def remove(self):
        if self.isEmpty():
            raise Exception('The Priority Queue is currently empty!!!')
        else:
            node = heapq.heappop(self.frontier)
            return node
    
