import subprocess
import os
import random

def generate_maze(index, method="random", size_range=(5, 10), max_goals=2):
    rows = random.randint(*size_range)
    cols = random.randint(*size_range)

    # Random start position: (x, y) = (col, row)
    start = (random.randint(0, cols - 1), random.randint(0, rows - 1))

    # Random goals (not overlapping with start)
    goals = set()
    while len(goals) < max_goals:
        g = (random.randint(0, cols - 1), random.randint(0, rows - 1))
        if g != start:
            goals.add(g)

    # Track occupied cells (start and goals)
    occupied = {start, *goals}

    # Generate non-overlapping walls in format (x, y, w, h)
    num_blocks = random.randint(1, 5)
    wall_blocks = []
    for _ in range(num_blocks):
        tries = 0
        while tries < 10:
            x = random.randint(0, cols - 2)
            y = random.randint(0, rows - 2)
            w = random.randint(1, min(3, cols - x))
            h = random.randint(1, min(3, rows - y))
            block_cells = {(x + dx, y + dy) for dx in range(w) for dy in range(h)}
            if occupied.isdisjoint(block_cells):
                wall_blocks.append((x, y, w, h))
                occupied.update(block_cells)
                break
            tries += 1

    # Write to file
    os.makedirs("test", exist_ok=True)
    path = f"test/maze_{index}.txt"
    with open(path, "w") as f:
        f.write(f"[{rows},{cols}]\n")  # rows, cols
        f.write(f"({start[0]},{start[1]})\n")  # x, y
        f.write("|".join(f"({g[0]},{g[1]})" for g in goals) + "\n")
        for block in wall_blocks:
            f.write(f"({block[0]},{block[1]},{block[2]},{block[3]})\n")

# Folder to store generated mazes
maze_folder = "test"
os.makedirs(maze_folder, exist_ok=True)

# Define the algorithms and how many mazes each will test
algorithms = ['bfs', 'dfs', 'gbfs', 'as', 'backtracking', 'depthlimited', 'ids', 'idas']
mazes_per_algorithm = 125

expected_total = len(algorithms) * mazes_per_algorithm
existing_mazes = {
    f for f in os.listdir(maze_folder)
    if f.startswith("maze_") and f.endswith(".txt")
}
generate_new = len(existing_mazes) < expected_total
if not generate_new:
    print(f"{len(existing_mazes)} maze files already exist. Skipping maze generation.\n")

print("Starting batch testing of algorithms...\n")

for algo_index, algo in enumerate(algorithms):
    print(f"=== Testing Algorithm: {algo.upper()} ===")
    success_count = 0
    solved_mazes = []
    unsolved_mazes = []

    for i in range(mazes_per_algorithm):
        maze_index = algo_index * mazes_per_algorithm + i
        maze_path = os.path.join(maze_folder, f"maze_{maze_index}.txt")

        # Generate only if it doesn't exist
        if generate_new and not os.path.exists(maze_path):
            generate_maze(index=maze_index, method="random")

        # Run the algorithm
        try:
            result = subprocess.run(
                ["python", "search.py", maze_path, algo],
                capture_output=True,
                text=True,
                timeout=100
            )

            output = result.stdout.lower()
            if 'true' in output:
                success_count += 1
                solved_mazes.append(f"maze_{maze_index}.txt")
            else:
                unsolved_mazes.append(f"maze_{maze_index}.txt")

        except subprocess.TimeoutExpired:
            print(f"Timeout on maze {maze_index} with {algo}")
            unsolved_mazes.append(f"maze_{maze_index}.txt")
    
    os.makedirs('results', exist_ok=True)
    summary_path = os.path.join("results", f"results_{algo}.txt")
    with open(summary_path, "w") as f:
        f.write(f"{algo.upper()} completed: {success_count}/{mazes_per_algorithm} solved\n\n")
        f.write(f"Mazes with solutions ({len(solved_mazes)}):\n")
        f.write("\n".join(solved_mazes) + "\n\n")
        f.write(f"Mazes without solutions ({len(unsolved_mazes)}):\n")
        f.write("\n".join(unsolved_mazes) + "\n")

    print(f"Results saved to {summary_path}\n")
