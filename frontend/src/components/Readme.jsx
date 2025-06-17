import React from 'react';
import { Github, ExternalLink, Code, Folder, Download, Star, GitBranch } from 'lucide-react';

const ReadMe = () => {
  const repoStats = [
    { label: 'Repository', value: 'pathfinding-visualizer' },
    { label: 'Language', value: 'JavaScript/React' },
    { label: 'Version', value: 'v1.0.0' }
  ];

  const features = [
    'Interactive maze visualization',
    '8 different pathfinding algorithms',
    'Custom maze file upload',
    'Real-time algorithm animation',
    'Multiple goal support',
    'Responsive design'
  ];

  const techStack = [
    { name: 'React', desc: 'Frontend framework' },
    { name: 'Tailwind CSS', desc: 'Styling framework' },
    { name: 'Lucide React', desc: 'Icon library' },
    { name: 'JavaScript', desc: 'Programming language' }
  ];

  const fileStructure = [
    { name: 'src/', type: 'folder', desc: 'Source code directory' },
    { name: '├── components/', type: 'folder', desc: 'React components' },
    { name: '│   ├── Dashboard.jsx', type: 'file', desc: 'Main visualization component' },
    { name: '│   ├── Guidelines.jsx', type: 'file', desc: 'Instructions page' },
    { name: '│   ├── ReadMe.jsx', type: 'file', desc: 'This documentation' },
    { name: '│   └── About.jsx', type: 'file', desc: 'About page' },
    { name: '├── algorithms/', type: 'folder', desc: 'Pathfinding algorithms' },
    { name: '│   ├── bfs.js', type: 'file', desc: 'Breadth-First Search' },
    { name: '│   ├── dfs.js', type: 'file', desc: 'Depth-First Search' },
    { name: '│   ├── astar.js', type: 'file', desc: 'A* Search' },
    { name: '│   └── greedy.js', type: 'file', desc: 'Greedy Best-First' },
    { name: '├── utils/', type: 'folder', desc: 'Utility functions' },
    { name: '│   ├── mazeGenerator.js', type: 'file', desc: 'Random maze creation' },
    { name: '│   └── fileParser.js', type: 'file', desc: 'Maze file parsing' },
    { name: '└── App.jsx', type: 'file', desc: 'Main application component' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Pathfinding Visualizer</h1>
              <p className="text-gray-600">Interactive maze solving with multiple algorithms</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Github className="w-4 h-4" />
              View on GitHub
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </button>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Download ZIP
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {repoStats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-800">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Project Description</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A comprehensive web application for visualizing pathfinding algorithms in maze environments. 
            Users can upload custom mazes or generate random ones, then watch as different algorithms 
            find paths from start to goal positions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This project demonstrates the behavior and efficiency of various pathfinding algorithms 
            including BFS, DFS, A*, Greedy Best-First, and iterative deepening variants. Perfect for 
            educational purposes and algorithm comparison.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Key Features</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠️ Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <span className="font-semibold text-gray-800">{tech.name}</span>
                  <span className="text-gray-600 text-sm ml-2">- {tech.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Quick Start</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Clone the repository:</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-gray-300 font-mono text-sm">
                git clone https://github.com/yourusername/pathfinding-visualizer.git
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Install dependencies:</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-gray-300 font-mono text-sm">
                cd pathfinding-visualizer<br />
                npm install
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Start development server:</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-gray-300 font-mono text-sm">
                npm start
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Build for production:</h3>
              <div className="bg-gray-900 rounded-lg p-4 text-gray-300 font-mono text-sm">
                npm run build
              </div>
            </div>
          </div>
        </div>

        {/* File Structure */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📁 Project Structure</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-mono text-sm space-y-1">
              {fileStructure.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-600">{item.name}</span>
                  {item.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Code className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-gray-500 text-xs">- {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithms */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 Implemented Algorithms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Search Algorithms:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Breadth-First Search (BFS)</li>
                <li>• Depth-First Search (DFS)</li>
                <li>• Depth-Limited Search</li>
                <li>• Iterative Deepening DFS</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Heuristic Algorithms:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• A* Search</li>
                <li>• Greedy Best-First Search</li>
                <li>• Iterative Deepening A*</li>
                <li>• Backtracking Search</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Usage Guide</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Create or Upload a Maze</h3>
              <p className="text-gray-600 text-sm">Generate a random maze or upload a custom .txt file with the specified format</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Set Start Position</h3>
              <p className="text-gray-600 text-sm">Click "Set Start" then click on any empty cell to place the starting position</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Choose Algorithm</h3>
              <p className="text-gray-600 text-sm">Select from 8 different pathfinding algorithms using the dropdown menu</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4. Visualize</h3>
              <p className="text-gray-600 text-sm">Watch the algorithm explore the maze and find the optimal path to all goals</p>
            </div>
          </div>
        </div>

        {/* Contributing */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🤝 Contributing</h2>
          <p className="text-gray-700 mb-4">
            Contributions are welcome! Please feel free to submit a Pull Request. For major changes, 
            please open an issue first to discuss what you would like to change.
          </p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <GitBranch className="w-4 h-4" />
              Fork Repository
            </button>
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Star className="w-4 h-4" />
              Star Project
            </button>
          </div>
        </div>

        {/* License */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 License</h2>
          <p className="text-gray-700 mb-4">
            This project is licensed under the MIT License - see the LICENSE file for details.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <strong>MIT License</strong><br />
            Copyright (c) 2024 Pathfinding Visualizer<br />
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadMe;