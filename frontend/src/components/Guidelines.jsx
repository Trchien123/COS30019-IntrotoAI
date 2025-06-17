import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const GuideLine = () => {
    // Make the useState hook for the expanded section, which stores
    // all the state of the sections
    const [expandedSections, setExpandedSections] = useState({
        algorithms: true,
        pages: false,
        dashboard: false,
        fileFormat: false,
        legend: false,
        limitations: false
    });

    // Toggle section to animate the toggle
    const toggleSection = (section) => {
        // get the section state from the expanded section
        const wasExpanded = expandedSections[section];

        // get all the previous state of the expanded sections
        // and with the chosen section chenge its previous value
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));

        // If expanding, scroll the section into view after DOM update
        if (!wasExpanded) {
            setTimeout(() => {
                const sectionElement = document.querySelector(`[data-section="${section}"]`); // find the section element with the data-section name
                if (sectionElement) {
                    // if section element exists move to that section after 100 miliseconds
                    sectionElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    };

    // create section const to draw the section
    const Section = ({ id, title, icon, children }) => {
        const isExpanded = expandedSections[id];

        return (
            <div
                // here is where the data-section is stored with the name in the const expandedSection
                data-section={id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
                <button
                    type="button"
                    onClick={() => toggleSection(id)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            <span className="mr-2 text-2xl">{icon}</span> {title}
                        </h2>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                        <div className="w-6 h-6">🔽</div>
                    </div>
                </button>

                <div
                    className='overflow-hidden transition-all duration-300 ease-in-out'
                    style={{
                        maxHeight: isExpanded ? `3000px` : '0px'
                    }}
                >
                    <div className="px-8 pb-8">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    const AlgorithmCard = ({ name, description }) => (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 border-blue-400 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <h3 className="font-bold text-lg text-gray-800 mb-2">{name}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );

    const FeatureItem = ({ title, description }) => (
        <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
            <div>
                <span className="font-semibold text-gray-800">{title}:</span>
                <span className="text-gray-600 ml-2">{description}</span>
            </div>
        </div>
    );

    const LegendItem = ({ color, label, icon, desc }) => (
        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm`}>
                {icon}
            </div>
            <div>
                <span className="font-semibold text-gray-800">{label}:</span>
                <span className="text-gray-600 ml-2">{desc}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-100 mb-6">
                        <h1 className="text-4xl font-bold text-blue-500">
                            📖 Guidelines
                        </h1>
                    </div>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto mb-1 \">
                        ℹ️ Explore and visualize various pathfinding algorithms on custom or random mazes.
                    </p>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto mb-1 \">
                        ℹ️ This platform demonstrates how different algorithms traverse mazes to find paths to one or multiple goals.
                    </p>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto mb-1 \">
                        ℹ️ There are also the descriptions about the algorithms used, challenges, further improvements (will be made in the future) as well as other findings.
                    </p>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto mb-1 \">
                        ℹ️ This website aims to assist those who are struggling in pathfinding algorithms.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Supported Algorithms */}
                    <Section id="algorithms" title="Supported Algorithms" icon="🚀">
                        <div className="space-y-4">
                            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
                                <h4 className="font-semibold text-amber-800 mb-2">Depth-First Search</h4>
                                <p className="text-amber-700">Depth-first search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking.</p>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                                <h4 className="font-semibold text-blue-800 mb-2">Breadth-First Search</h4>
                                <p className="text-blue-700">
                                    Breadth-first search (BFS) is an algorithm for searching a tree data structure for a node that satisfies a given property. It starts at the tree root and explores all nodes at the present depth prior to moving on to the nodes at the next depth level. (Wikipedia)
                                </p>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-400">
                                <h4 className="font-semibold text-purple-800 mb-2">Greedy Best-First Search</h4>
                                <p className="text-purple-700">
                                    Greedy Best-First Search is an AI search algorithm that attempts to find the most promising path from a given starting point to a goal. The algorithm works by evaluating the cost of each possible path and then expanding the path with the lowest cost. (GeeksforGeeks)
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-400">
                                <h4 className="font-semibold text-green-800 mb-2">A* Search</h4>
                                <p className="text-green-700">
                                    A* (pronounced "A-star") is a graph traversal and pathfinding algorithm that is used in many fields of computer science due to its completeness, optimality, and optimal efficiency. Given a weighted graph, a source node and a goal node, the algorithm finds the shortest path (with respect to the given weights) from source to goal. (Wikipedia)
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-400">
                                <h4 className="font-semibold text-red-800 mb-2">Backtracking Search</h4>
                                <p className="text-red-700">
                                    Backtracking is a problem-solving algorithmic technique that involves finding a solution incrementally by trying different options and undoing them if they lead to a dead end.
                                </p>
                                <p className='text-red-700'>
                                    It is commonly used in situations where you need to explore multiple possibilities to solve a problem, like searching for a path in a maze or solving puzzles like Sudoku. When a dead end is reached, the algorithm backtracks to the previous decision point and explores a different path until a solution is found or all possibilities have been exhausted. (GeeksforGeeks)
                                </p>
                            </div>

                            <div className="bg-cyan-50 rounded-xl p-6 border-l-4 border-cyan-400">
                                <h4 className="font-semibold text-cyan-800 mb-2">Depth-Limited Search</h4>
                                <p className="text-cyan-700">
                                    Depth Limited Search is a modified version of DFS that imposes a limit on the depth of the search. This means that the algorithm will only explore nodes up to a certain depth, effectively preventing it from going down excessively deep paths that are unlikely to lead to the goal. (GeeksforGeeks)
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-400">
                                <h4 className="font-semibold text-gray-800 mb-2">Iterative Deepening Depth-First Search</h4>
                                <p className="text-gray-700">
                                    IDDFS combines depth-first search's space-efficiency and breadth-first search's fast search (for nodes closer to root). (GeeksforGeeks)
                                </p>
                            </div>

                            <div className="bg-lime-50 rounded-xl p-6 border-l-4 border-lime-400">
                                <h4 className="font-semibold text-lime-800 mb-2">Iterative Deepening Depth-First Search</h4>
                                <p className="text-lime-700">
                                    Iterative Deepening A* (IDA*) is a graph traversal and pathfinding algorithm that combines the depth-first search approach of Iterative Deepening Search (IDS) with the heuristic guidance of the A* search algorithm
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* Website Pages */}
                    <Section id="pages" title="Website Pages" icon="📑">
                        <div className="grid gap-4">
                            <FeatureItem
                                title="📊 Dashboard"
                                description="Main visualization page with interactive maze display and algorithm settings."
                            />
                            <FeatureItem
                                title="📌 Guidelines"
                                description="Comprehensive instructions and feature explanations (this page)."
                            />
                            <FeatureItem
                                title="📄 Report"
                                description="Detailed project report with analysis and there will be available report file for download."
                            />
                            <FeatureItem
                                title="📕 ReadMe"
                                description="GitHub links and project structure documentation."
                            />
                        </div>
                    </Section>

                    {/* Dashboard */}
                    <Section id="dashboard" title="Dashboard Controls" icon="⚙️">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl mb-4 flex items-center gap-2">
                                    <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-400">
                                        <h4 className="font-semibold text-black-800 mb-2">Configuration Options</h4>
                                    </div>
                                </h3>
                                <div className="grid gap-4">
                                    <FeatureItem
                                        title="📁 Maze File Upload"
                                        description="Upload custom .txt files with proper maze format."
                                    />
                                    <FeatureItem
                                        title="📐 Maze Dimensions"
                                        description="Create random mazes with custom dimensions (10-40 rows/ 10-50 columns) and 1-8 goals."
                                    />
                                    <FeatureItem
                                        title="🧠 Algorithm Selection"
                                        description="Choose from 8 different pathfinding algorithms via intuitive dropdown menu."
                                    />
                                    <FeatureItem
                                        title="⚡ Speed Control"
                                        description="Adjust visualization speed from slow motion to instant execution."
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl mb-4 flex items-center gap-2">
                                    <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-400">
                                        <h4 className="font-semibold text-black-800 mb-2">Maze Visualization</h4>
                                    </div>
                                </h3>
                                <div className="grid gap-4">
                                    <FeatureItem
                                        title="📊 Visual Maze Display"
                                        description="Color-coded grid with start (green S), goals (red G), walls (gray), explored nodes (blue), and solution paths (yellow)."
                                    />
                                    <FeatureItem
                                        title="🎲 New Maze"
                                        description="Randomly generate newmaze with the selected dimensions."
                                    />
                                    <FeatureItem
                                        title="📍 Set Start"
                                        description="Interactive start position placement by clicking any empty cell after selecting 'Set Start'."
                                    />
                                    <FeatureItem
                                        title="▶ Solve"
                                        description="Watch algorithms explore the maze in real-time with smooth animations and path highlighting."
                                    />
                                    <FeatureItem
                                        title="🔄 Reset"
                                        description="Clear the visualization after finished for restart."
                                    />
                                    <FeatureItem
                                        title="🎯 Individual Goal Analysis"
                                        description="Handle multiple goals with individual path visualization and goal selection. Users can click on one of the goal to see the visualization for that goal."
                                    />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* File Format */}
                    <Section id="fileFormat" title="Maze File Format" icon="📁">
                        <div className="space-y-6">
                            <p className="text-gray-700 leading-relaxed">
                                Custom maze files must follow this structured format for proper loading:
                            </p>

                            <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
                                <div className="text-gray-300 font-mono text-sm leading-relaxed">
                                    <div className="text-green-400"># Maze dimensions</div>
                                    <div>[rows,cols]</div>
                                    <div className="text-green-400 mt-2"># Start position</div>
                                    <div>(startX,startY)</div>
                                    <div className="text-green-400 mt-2"># Goals separated by '|'</div>
                                    <div>(goal1X,goal1Y)|(goal2X,goal2Y)|...</div>
                                    <div className="text-green-400 mt-2"># Wall definitions (x,y,height,width)</div>
                                    <div>(x,y,height,width)</div>
                                    <div>...</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Example File:</h4>
                                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                                    <div className="font-mono text-sm text-gray-700 leading-relaxed">
                                        <div>[10,15]</div>
                                        <div>(0,0)</div>
                                        <div>(2,4)|(7,10)|(5,5)</div>
                                        <div>(3,3,2,5)</div>
                                        <div>(8,1,4,3)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Legend */}
                    <Section id="legend" title="Visual Legend" icon="🎨">
                        <div className="grid gap-4">
                            <LegendItem
                                color="bg-green-500 border-2 border-green-700"
                                label="Start (S)"
                                icon="S"
                                desc="Always visible on top"
                            />
                            <LegendItem
                                color="bg-red-400 border-2 border-red-600"
                                label="Goal (G)"
                                icon="G"
                                desc="Click to see individual path"
                            />
                            <LegendItem
                                color="bg-gray-800"
                                label="Wall"
                                icon=""
                                desc="Impassable terrain"
                            />
                            <LegendItem
                                color="bg-blue-300"
                                label="Explored"
                                icon=""
                                desc="Algorithm searched here"
                            />
                            <LegendItem
                                color="bg-yellow-400 animate-pulse"
                                label="Solution Path"
                                icon=""
                                desc="Optimal route found"
                            />
                        </div>
                    </Section>

                    {/* Limitations */}
                    <Section id="limitations" title="Important Limitations" icon="⚠️">
                        <div className="space-y-4">

                            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                                <h4 className="font-semibold text-blue-800 mb-2">Movement Restrictions</h4>
                                <p className="text-blue-700">
                                    Only orthogonal movement (with order of explored node UP-LEFT-DOWN-RIGHT) is supported. Diagonal movement is not allowed. 
                                </p>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-400">
                                <h4 className="font-semibold text-purple-800 mb-2">Algorithm Considerations</h4>
                                <p className="text-purple-700">Iterative deepening algorithms (IDDFS, IDA*) are memory-efficient but slower due to repeated searches. Therefore, it is recommended to set he maze with the size around (20,20) and not too many goals. This is one of the limitations and it is going to be fixed in the future.</p>
                            </div>

                            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-400">
                                <h4 className="font-semibold text-green-800 mb-2">Heuristic Information</h4>
                                <p className="text-green-700">A* and Greedy Best-First Search use Manhattan distance heuristic, the use of other heuristic types will be updated in future works.</p>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                        <span className="text-sm">📖 Happy pathfinding! 🚀</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideLine;