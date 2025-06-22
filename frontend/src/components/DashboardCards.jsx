import React, { useState, useEffect, useCallback, useRef } from 'react';

const MazeSolver = () => {
  // State management
  const [config, setConfig] = useState({
    rows: 20, cols: 30, numGoals: 3, algorithm: 'bfs', speed: 'normal', depthLimit: 10
  });
  const [maze, setMaze] = useState([]);
  const [startPos, setStartPos] = useState(null);
  const [goals, setGoals] = useState([]);
  const [isSettingStart, setIsSettingStart] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [visualization, setVisualization] = useState({
    explored: new Map(),
    path: [],
    selectedGoal: null,
    currentDepth: 0,
    maxDepth: 0,
    currentIteration: 0
  });
  const [backendStatus, setBackendStatus] = useState('checking');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [shouldRegenerate, setShouldRegenerate] = useState(true);
  const fileInputRef = useRef(null);

  const isLocalhost = window.location.hostname === 'localhost';
  const backendUrl_solve = isLocalhost
    ? 'http://localhost:5000/solve'  // Or your local backend port
    : 'https://maze-searching-visualizer-backend.onrender.com/solve';

  const backendUrl_health = isLocalhost
    ? 'http://localhost:5000/health'  // Or your local backend port
    : 'https://maze-searching-visualizer-backend.onrender.com/health';

  const algorithms = [
    { id: 'bfs', name: 'Breadth-First Search' },
    { id: 'dfs', name: 'Depth-First Search' },
    { id: 'gbfs', name: 'Greedy Best-First Search' },
    { id: 'as', name: 'A* Search' },
    { id: 'backtracking', name: 'Backtracking' },
    { id: 'depthlimited', name: 'Depth-Limited Search' },
    { id: 'ids', name: 'Iterative Deepening DFS' },
    { id: 'idas', name: 'Iterative Deepening A*' }
  ];

  const isIterativeAlgorithm = () => {
    return config.algorithm === 'ids' || config.algorithm === 'idas';
  };

  const isDepthLimitedAlgorithm = () => {
    return config.algorithm === 'depthlimited' || isIterativeAlgorithm();
  };

  // Backend health check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(backendUrl_health);
        setBackendStatus(response.ok ? 'connected' : 'error');
      } catch {
        setBackendStatus('disconnected');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Parse maze file according to utils.py format
  const parseMazeFile = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 4) {
      throw new Error('Invalid file format. Expected at least 4 lines.');
    }

    // Parse size [rows, cols]
    const sizeMatch = lines[0].match(/\[(\d+),(\d+)\]/);
    if (!sizeMatch) {
      throw new Error('Invalid size format. Expected [rows,cols]');
    }
    const [rows, cols] = [parseInt(sizeMatch[1]), parseInt(sizeMatch[2])];

    // Parse start position (x,y)
    const startMatch = lines[1].match(/\((\d+),(\d+)\)/);
    if (!startMatch) {
      throw new Error('Invalid start format. Expected (x,y)');
    }
    const start = [parseInt(startMatch[1]), parseInt(startMatch[2])];

    // Parse goals - can be multiple goals separated by |
    const goalsPart = lines[2];
    const goalMatches = goalsPart.match(/\((\d+),(\d+)\)/g);
    if (!goalMatches) {
      throw new Error('Invalid goals format. Expected (x,y) format');
    }
    const parsedGoals = goalMatches.map(match => {
      const coords = match.match(/\((\d+),(\d+)\)/);
      return [parseInt(coords[1]), parseInt(coords[2])];
    });

    // Parse walls - each line is (x,y,height,width)
    const walls = new Set();
    for (let i = 3; i < lines.length; i++) {
      const wallMatch = lines[i].match(/\((\d+),(\d+),(\d+),(\d+)\)/);
      if (wallMatch) {
        const [x, y, height, width] = wallMatch.slice(1).map(Number);
        for (let h = 0; h < height; h++) {
          for (let w = 0; w < width; w++) {
            walls.add(`${x + h},${y + w}`);
          }
        }
      }
    }

    return { rows, cols, start, goals: parsedGoals, walls };
  };

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    try {
      const text = await file.text();
      const { rows, cols, start, goals: parsedGoals, walls } = parseMazeFile(text);

      if (rows < 5 || cols < 5 || rows > 50 || cols > 50) {
        alert('Invalid dimensions. Rows and cols should be between 5-50');
        return;
      }

      // Create maze array
      const total = rows * cols;
      const mazeArray = Array(total).fill().map(() => ({ type: 'empty' }));

      // Set walls
      walls.forEach(wallKey => {
        const [x, y] = wallKey.split(',').map(Number);
        const index = y * cols + x;
        if (index >= 0 && index < total) {
          mazeArray[index] = { type: 'wall' };
        }
      });

      // Set goals
      parsedGoals.forEach(([x, y]) => {
        const index = y * cols + x;
        if (index >= 0 && index < total) {
          mazeArray[index] = { type: 'goal' };
        }
      });

      setConfig(prev => ({ ...prev, rows, cols, numGoals: parsedGoals.length }));
      setStartPos(start);
      setGoals(parsedGoals);
      setMaze(mazeArray);
      setUploadedFile(file.name);
      setShouldRegenerate(false);
      resetVisualization(true);

      alert(`Maze loaded successfully! ${parsedGoals.length} goals found, start position set`);

    } catch (error) {
      alert('Error reading file: ' + error.message);
    }
  };

  // Generate random maze
  const generateMaze = useCallback(() => {
    const { rows, cols, numGoals } = config;
    const total = rows * cols;
    const mazeArray = Array(total).fill().map(() => ({ type: 'empty' }));

    const wallCount = Math.floor(total * 0.15);
    const wallIndices = new Set();
    while (wallIndices.size < wallCount) {
      wallIndices.add(Math.floor(Math.random() * total));
    }
    wallIndices.forEach(i => mazeArray[i].type = 'wall');

    const available = Array.from({ length: total }, (_, i) => i).filter(i => !wallIndices.has(i));
    const goalIndices = new Set();
    while (goalIndices.size < Math.min(numGoals, available.length)) {
      const rand = available[Math.floor(Math.random() * available.length)];
      if (!goalIndices.has(rand)) goalIndices.add(rand);
    }

    const generatedGoals = [];
    goalIndices.forEach(i => {
      mazeArray[i].type = 'goal';
      generatedGoals.push(indexToCoord(i));
    });

    setMaze(mazeArray);
    setGoals(generatedGoals);
    setShouldRegenerate(false);
    resetVisualization();
  }, [config]);

  // Only regenerate when explicitly needed
  useEffect(() => {
    if (shouldRegenerate && !uploadedFile) {
      generateMaze();
    }
  }, [generateMaze, shouldRegenerate, uploadedFile]);

  const resetVisualization = (preserveStart = false) => {
    setResult(null);
    setVisualization({
      explored: new Map(),
      path: [],
      selectedGoal: null,
      currentDepth: 0,
      maxDepth: 0,
      currentIteration: 0
    });
    if (!preserveStart && !uploadedFile) {
      setStartPos(null);
    }
    setIsSettingStart(false);
  };

  const indexToCoord = (index) => [index % config.cols, Math.floor(index / config.cols)];
  const coordToIndex = ([x, y]) => y * config.cols + x;

  const convertMazeToGrid = () => {
    const grid = [];
    for (let y = 0; y < config.rows; y++) {
      const row = [];
      for (let x = 0; x < config.cols; x++) {
        const cell = maze[y * config.cols + x];
        row.push(cell?.type === 'wall' ? 1 : 0);
      }
      grid.push(row);
    }
    return grid;
  };

  const animateVisualization = async (exploredNodes, pathNodes, isIterative = false) => {
    const speedMap = { slow: 150, normal: 75, fast: 30, instant: 0 };
    const delay = speedMap[config.speed];

    if (isIterative) {
      // For iterative algorithms, group nodes by depth and animate depth by depth
      const nodesByDepth = new Map();
      exploredNodes.forEach((node, index) => {
        const depth = Math.floor(index / Math.max(1, Math.sqrt(exploredNodes.length)));
        if (!nodesByDepth.has(depth)) {
          nodesByDepth.set(depth, []);
        }
        nodesByDepth.get(depth).push(node);
      });

      const maxDepth = Math.max(...nodesByDepth.keys());

      for (let depth = 0; depth <= maxDepth; depth++) {
        setVisualization(prev => ({
          ...prev,
          currentDepth: depth,
          maxDepth: maxDepth,
          currentIteration: depth + 1
        }));

        // Clear and re-animate up to current depth
        const exploredAtDepth = new Map();
        let nodeIndex = 0;

        for (let d = 0; d <= depth; d++) {
          const nodesAtThisDepth = nodesByDepth.get(d) || [];
          for (const [x, y] of nodesAtThisDepth) {
            const index = coordToIndex([x, y]);
            exploredAtDepth.set(index, d);

            setVisualization(prev => ({
              ...prev,
              explored: new Map(exploredAtDepth),
              currentDepth: depth,
              maxDepth: maxDepth
            }));

            if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay / 2));
            nodeIndex++;
          }
        }

        if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay * 3));
      }
    } else {
      // Regular animation
      setVisualization(prev => ({
        ...prev,
        explored: new Map(),
        path: [],
        selectedGoal: null,
        currentDepth: 0,
        maxDepth: 0
      }));

      const exploredWithDepth = new Map();

      for (let i = 0; i < exploredNodes.length; i++) {
        const [x, y] = exploredNodes[i];
        const index = coordToIndex([x, y]);
        const depth = isDepthLimitedAlgorithm() ? Math.min(Math.floor(i / 5), config.depthLimit) : 0;

        exploredWithDepth.set(index, depth);

        setVisualization(prev => ({
          ...prev,
          explored: new Map(exploredWithDepth),
          currentDepth: depth,
          maxDepth: Math.max(prev.maxDepth, depth)
        }));

        if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Animate path
    for (const [x, y] of pathNodes) {
      const index = coordToIndex([x, y]);
      setVisualization(prev => ({
        ...prev,
        path: [...prev.path, index]
      }));
      if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay * 2));
    }
  };

  const handleSolve = async () => {
    if (!startPos) {
      alert('Please set a start position first!');
      return;
    }
    if (backendStatus !== 'connected') {
      alert('Backend server is not connected!');
      return;
    }

    if (goals.length === 0) {
      alert('No goals found! Generate a new maze.');
      return;
    }

    setIsSearching(true);
    resetVisualization(true);

    try {
      const requestBody = {
        maze: convertMazeToGrid(),
        start: startPos,
        goals: goals,
        algorithm: config.algorithm
      };

      if (isDepthLimitedAlgorithm()) {
        requestBody.depth_limit = config.depthLimit;
      }

      const response = await fetch(backendUrl_solve, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      setResult(data);

      if (data.success) {
        await animateVisualization(
          data.nodes_explored_multiple || [],
          data.solution_multiple || [],
          isIterativeAlgorithm()
        );
      } else {
        alert('No solution found!');
      }
    } catch (error) {
      console.error('Pathfinding error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCellClick = (index) => {
    if (isSearching) return;

    if (isSettingStart) {
      const [x, y] = indexToCoord(index);
      const cell = maze[index];
      if (cell?.type !== 'wall') {
        setStartPos([x, y]);
        setIsSettingStart(false);
      }
    }
  };

  const updateConfig = (key, value) => {
    const newValue = parseInt(value) || value;
    setConfig(prev => ({ ...prev, [key]: newValue }));

    // Only trigger regeneration for dimension or goal changes
    if (key === 'rows' || key === 'cols' || key === 'numGoals') {
      setShouldRegenerate(true);
      setUploadedFile(null);
    }
  };

  const handleNewMaze = () => {
    setUploadedFile(null);
    setShouldRegenerate(true);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🧩 Enhanced Maze Pathfinding Visualizer</h1>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${backendStatus === 'connected' ? 'bg-green-100 text-green-800' :
              backendStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
            }`}>
            Backend: {backendStatus === 'connected' ? '🟢 Connected' :
              backendStatus === 'error' ? '🔴 Error' : '🟡 Disconnected'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Maze ({config.rows}×{config.cols})
                {uploadedFile && <span className="text-sm text-blue-600 ml-2">📁 {uploadedFile}</span>}
              </h3>
              <div className="text-sm text-gray-600">
                {goals.length} goals • {algorithms.find(a => a.id === config.algorithm)?.name}
                {isDepthLimitedAlgorithm() && ` (Limit: ${config.depthLimit})`}
              </div>
            </div>

            {isSearching && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-blue-800 font-medium">🔍 Searching with {algorithms.find(a => a.id === config.algorithm)?.name}</span>
                  </div>
                  <div className="text-sm text-blue-600 font-mono bg-white bg-opacity-50 px-2 py-1 rounded">
                    Explored: {visualization.explored.size} nodes
                  </div>
                </div>

                {isDepthLimitedAlgorithm() && !isIterativeAlgorithm() && (
                  <div className="grid grid-cols-1text-sm mb-3">
                    <div className="bg-white bg-opacity-70 rounded px-3 py-2 border border-indigo-200">
                      <span className="font-medium text-indigo-700">Depth Limit:</span>
                      <span className="ml-1 font-mono text-indigo-900 font-bold">{config.depthLimit}</span>
                    </div>
                  </div>
                )}

                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (visualization.explored.size / (config.rows * config.cols * 0.3)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {visualization.explored.size > 0 && !isSearching && (
              <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white bg-opacity-60 rounded px-3 py-2">
                    <span className="font-medium text-indigo-800">Total Explored:</span>
                    <span className="ml-1 font-mono text-indigo-900 font-bold">{visualization.explored.size}</span>
                  </div>
                  <div className="bg-white bg-opacity-60 rounded px-3 py-2">
                    <span className="font-medium text-indigo-800">Path Length:</span>
                    <span className="ml-1 font-mono text-indigo-900 font-bold">{visualization.path.length}</span>
                  </div>
                  <div className="bg-white bg-opacity-60 rounded px-3 py-2">
                    <span className="font-medium text-indigo-800">Efficiency:</span>
                    <span className="ml-1 font-mono text-indigo-900 font-bold">
                      {visualization.path.length > 0 ? Math.round((visualization.path.length / visualization.explored.size) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-inner w-full">
              <div
                className="relative mx-auto w-full max-w-full"
                style={{
                  width: '100%',
                  aspectRatio: `${config.cols} / ${config.rows}`, // maintain square layout
                }}
              >
                <div
                  className="absolute inset-0 grid gap-[1px]"
                  style={{
                    gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                  }}
                >
                  {maze.map((cell, i) => {
                    const [x, y] = indexToCoord(i);
                    const isStart = startPos && startPos[0] === x && startPos[1] === y;
                    const isGoal = cell?.type === 'goal';
                    const isExplored = visualization.explored.has(i);
                    const isPath = visualization.path.includes(i);
                    const isSelectedGoal =
                      visualization.selectedGoal !== null &&
                      isGoal &&
                      goals.findIndex(([gx, gy]) => gx === x && gy === y) ===
                        visualization.selectedGoal;

                    let cellClass =
                      'aspect-square border border-gray-300 cursor-pointer transition-all duration-300 relative overflow-hidden ';

                    if (isStart) {
                      cellClass +=
                        'bg-green-500 border-2 border-green-700 shadow-lg z-30';
                    } else if (isSelectedGoal) {
                      cellClass +=
                        'bg-red-600 shadow-lg border-2 border-red-800 z-20 ring-2 ring-red-300';
                    } else if (isGoal) {
                      cellClass +=
                        'bg-red-400 border-2 border-red-600 shadow-md z-20';
                    } else if (isPath) {
                      cellClass +=
                        'bg-yellow-400 animate-pulse shadow-lg border-2 border-yellow-600 z-10';
                    } else if (isExplored) {
                      cellClass += 'bg-blue-300 shadow-sm border-blue-400';
                    } else if (cell?.type === 'wall') {
                      cellClass += 'bg-gray-800 border-gray-700';
                    } else {
                      cellClass +=
                        'bg-gray-50 hover:bg-gray-100 border-gray-200';
                    }

                    return (
                      <div
                        key={i}
                        className={cellClass}
                        onClick={() => handleCellClick(i)}
                      >
                        {isStart && (
                          <div className="absolute inset-0 flex items-center justify-center z-40">
                            <div className="w-4 h-4 bg-white rounded-full shadow-lg border-2 border-green-800 flex items-center justify-center">
                              <span className="text-xs font-bold text-green-800">S</span>
                            </div>
                          </div>
                        )}
                        {isGoal && !isStart && (
                          <div className="absolute inset-0 flex items-center justify-center z-30">
                            <div className="w-4 h-4 bg-white rounded-full shadow-lg border-2 border-red-800 flex items-center justify-center">
                              <span className="text-xs font-bold text-red-800">G</span>
                            </div>
                          </div>
                        )}
                        {isPath && !isStart && !isGoal && (
                          <div className="absolute inset-0 flex items-center justify-center z-5">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={handleNewMaze} disabled={isSearching}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:hover:shadow-none">
                🎲 New Maze
              </button>
              <button onClick={() => setIsSettingStart(!isSettingStart)} disabled={isSearching}
                className={`px-4 py-2 ${isSettingStart ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' : 'bg-purple-500 hover:bg-purple-600'} disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md`}>
                📍 {isSettingStart ? 'Click to Set Start' : 'Set Start'}
              </button>
              <button onClick={handleSolve} disabled={isSearching || !startPos || backendStatus !== 'connected'}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:hover:shadow-none">
                {isSearching ? '🔄 Solving...' : '▶ Solve'}
              </button>
              <button onClick={resetVisualization} disabled={isSearching}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:hover:shadow-none">
                🔄 Reset
              </button>
            </div>

            {/* Enhanced Legend */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4 border border-gray-200">
              <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>🎨</span> Legend & Controls
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  { color: 'bg-green-500 border-2 border-green-700', label: 'Start (S)', icon: 'S', desc: 'Always visible on top' },
                  { color: 'bg-red-400 border-2 border-red-600', label: 'Goal (G)', icon: 'G', desc: 'Click to see individual path' },
                  { color: 'bg-gray-800', label: 'Wall', icon: '', desc: 'Impassable terrain' },
                  { color: 'bg-blue-300', label: 'Explored', icon: '', desc: 'Algorithm searched here' },
                  { color: 'bg-yellow-400 animate-pulse', label: 'Solution Path', icon: '', desc: 'Optimal route found' },
                ].map(({ color, label, icon, desc }) => (
                  <div key={label} className="flex items-center gap-2 bg-white bg-opacity-60 rounded-md p-2">
                    <div className={`w-5 h-5 ${color} rounded flex-shrink-0 relative flex items-center justify-center shadow-sm`}>
                      {icon && (
                        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-800">{icon}</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-700 truncate">{label}</div>
                      <div className="text-gray-500 text-xs">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {result && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <span>📊</span> Search Results
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="bg-white bg-opacity-70 rounded px-3 py-2">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-1 font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? '✅ Success' : '❌ Failed'}
                    </span>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded px-3 py-2">
                    <span className="font-medium text-gray-700">Path Length:</span>
                    <span className="ml-1 font-mono font-bold text-blue-800">{result.path_length_multiple || 0}</span>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded px-3 py-2">
                    <span className="font-medium text-gray-700">Nodes Explored:</span>
                    <span className="ml-1 font-mono font-bold text-blue-800">{result.num_explored_multiple || 0}</span>
                  </div>
                  <div className="bg-white bg-opacity-70 rounded px-3 py-2">
                    <span className="font-medium text-gray-700">Time:</span>
                    <span className="ml-1 font-mono font-bold text-blue-800">{result.time_taken?.toFixed(4) || 0}s</span>
                  </div>
                </div>

                {result.solution_single && result.solution_single.length > 1 && (
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <p className="text-sm text-blue-700 mb-3 font-medium">🎯 Individual Goal Analysis:</p>
                    <div className="flex flex-wrap gap-2">
                      {goals.map((goal, i) => (
                        <button key={i}
                          onClick={() => {
                            setVisualization(prev => ({ ...prev, selectedGoal: i }));
                            animateVisualization(
                              result.nodes_explored_single[i] || [],
                              result.solution_single[i] || []
                            );
                          }}
                          className={`px-3 py-2 text-xs rounded-lg font-medium transition-all duration-200 ${visualization.selectedGoal === i
                              ? 'bg-blue-500 text-white shadow-md scale-105'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-sm'
                            }`}>
                          Goal {i + 1} ({goal[0]},{goal[1]})
                          {result.solution_single[i] && (
                            <span className="ml-1 text-xs opacity-75">
                              • {result.solution_single[i].length} steps
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>⚙️</span> Configuration
            </h3>

            <div className="space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-all duration-200 hover:bg-indigo-50">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  📁 Upload Maze File
                  {uploadedFile && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                      ✓ {uploadedFile}
                    </span>
                  )}
                </h4>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isSearching}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSearching}
                  className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 text-sm hover:shadow-md disabled:hover:shadow-none mb-3"
                >
                  {uploadedFile ? '🔄 Replace File' : '📤 Choose .txt File'}
                </button>

                <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-600 border">
                  <div className="font-medium mb-2 text-gray-700">📝 Expected Format:</div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                      <span>[rows,cols]</span>
                    </div>
                    <div className="flex justify-between">
                      <span>(start_x,start_y)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>(goal_x,goal_y)|...</span>
                    </div>
                    <div className="flex justify-between">
                      <span>(x,y,h,w)</span>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs border border-blue-200">
                    <span className="font-medium text-blue-800">Example:</span>
                    <div className="font-mono text-blue-700 mt-1">
                      [20,30]<br />
                      (1,1)<br />
                      (28,18)|(15,10)<br />
                      (5,5,2,3)
                    </div>
                  </div>
                </div>
              </div>

              {/* Maze Configuration */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    📐 Maze Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rows</label>
                      <input type="range" min="10" max="40" value={config.rows}
                        onChange={(e) => updateConfig('rows', e.target.value)}
                        className="w-full accent-blue-500" disabled={isSearching || uploadedFile} />
                      <div className="text-xs text-center text-gray-600 font-mono mt-1">{config.rows}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Columns</label>
                      <input type="range" min="10" max="50" value={config.cols}
                        onChange={(e) => updateConfig('cols', e.target.value)}
                        className="w-full accent-blue-500" disabled={isSearching || uploadedFile} />
                      <div className="text-xs text-center text-gray-600 font-mono mt-1">{config.cols}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Number of Goals: <span className="font-mono text-blue-600">{goals.length}</span>
                  </label>
                  <input type="range" min="1" max="8" value={config.numGoals}
                    onChange={(e) => updateConfig('numGoals', e.target.value)}
                    className="w-full accent-red-500" disabled={isSearching || uploadedFile} />
                  <div className="text-xs text-center text-gray-600 mt-1">
                    Current: {config.numGoals} {uploadedFile && '(from file)'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🧠 Search Algorithm</label>
                  <select value={config.algorithm}
                    onChange={(e) => updateConfig('algorithm', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isSearching}>
                    {algorithms.map(alg => (
                      <option key={alg.id} value={alg.id}>{alg.name}</option>
                    ))}
                  </select>
                </div>

                {isDepthLimitedAlgorithm() && (
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <label className="block text-sm font-medium text-yellow-800 mb-2">
                      🔢 Threshold: <span className="font-mono">{config.depthLimit}</span>
                    </label>
                    <input type="range" min="1" max="100" value={config.depthLimit}
                      onChange={(e) => updateConfig('depthLimit', e.target.value)}
                      className="w-full accent-yellow-500" disabled={isSearching} />
                    <div className="text-xs text-yellow-700 mt-1">
                      {isIterativeAlgorithm() ? 'Maximum depth per iteration' : 'Search depth limit'}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">⚡ Animation Speed</label>
                  <select value={config.speed}
                    onChange={(e) => updateConfig('speed', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isSearching}>
                    <option value="slow">🐌 Slow</option>
                    <option value="normal">🚶 Normal</option>
                    <option value="fast">🏃 Fast</option>
                    <option value="instant">⚡ Instant</option>
                  </select>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <h5 className="text-sm font-semibold text-indigo-800 mb-2">📈 Current Setup</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-indigo-600">Total Cells:</span>
                    <span className="font-mono text-indigo-800">{config.rows * config.cols}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-600">Wall Density:</span>
                    <span className="font-mono text-indigo-800">~15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-600">Start Position:</span>
                    <span className="font-mono text-indigo-800">
                      {startPos ? `(${startPos[0]},${startPos[1]})` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-600">Goals Found:</span>
                    <span className="font-mono text-indigo-800">{goals.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeSolver;