import React, { useState, useEffect } from 'react';
import '../index.css';

const Search = () => <span>🔍</span>;
const Dashboard = () => <span>📊</span>;
const Guidelines = () => <span>📌</span>;
const Report = () => <span>📄</span>;
const ReadMe = () => <span>📕</span>;
const Settings = () => <span>⚙️</span>;

function SideMenu({ onMenuClick, selectedView }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Auto-collapse on small screens
            if (mobile) {
                setIsCollapsed(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const icons = [
        Dashboard,
        Guidelines,
        Report,
        ReadMe,
        Settings
    ];

    const Menus = [
        { title: 'Dashboard', description: 'Overview & Visualization' },
        { title: 'Guidelines', description: 'Guidelines & Limitations' },
        { title: 'Report', spacing: true, description: 'Project Report' },
        { title: 'ReadMe', description: 'Project Structure' },
    ];

    const filteredMenus = Menus.filter(menu =>
        menu.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMenuClick = (title) => {
        onMenuClick(title);
        // Close mobile menu after selection
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 shadow-lg transition-all duration-200 hover:scale-110 md:hidden"
                >
                    <span className="text-lg">☰</span>
                </button>
            )}

            {/* Sidebar */}
            <div className={`
                ${isMobile ? 'fixed' : 'relative'} 
                h-screen p-5 pt-6 duration-300 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col shadow-2xl border-r border-slate-700 z-50
                ${isMobile 
                    ? `transform transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72`
                    : `${isCollapsed ? 'w-20' : 'w-75'}`
                }
            `}>
                
                {/* Desktop Collapse Toggle Button */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    >
                        <span className={`transform transition-transform duration-200 text-sm ${isCollapsed ? 'rotate-180' : ''}`}>
                            ◀
                        </span>
                    </button>
                )}

                {/* Mobile Close Button */}
                {isMobile && (
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="text-xl">✕</span>
                    </button>
                )}

                {/* Logo and Title */}
                <div className={`inline-flex items-center mb-8 ${(isCollapsed && !isMobile) ? 'justify-center' : ''} ${isMobile ? 'mt-8' : ''}`}>
                    <div className='w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg mr-3 transition-all duration-300 hover:shadow-xl hover:scale-105 flex-shrink-0'>
                        <Settings className="text-3xl" />
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <div className="overflow-hidden min-w-0">
                            <h1 className="text-white font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text truncate">
                                Maze Searching
                            </h1>
                            <p className="text-slate-400 text-xs truncate">Pathfinding Visualizer</p>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                {(!isCollapsed || isMobile) && (
                    <div className="flex items-center rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600 py-3 px-4 mb-6 transition-all duration-200 hover:bg-slate-700/70 focus-within:ring-2 focus-within:ring-indigo-500/50">
                        <Search className="text-slate-400 text-lg mr-3 flex-shrink-0" />
                        <input
                            type="search"
                            placeholder="Search menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-sm bg-transparent w-full text-slate-200 placeholder-slate-400 focus:outline-none min-w-0"
                        />
                    </div>
                )}

                {/* Menu Items */}
                <ul className="pt-2 flex-grow space-y-1 overflow-y-auto overflow-x-hidden">
                    {(searchQuery ? filteredMenus : Menus).map((menu, index) => {
                        const originalIndex = searchQuery ? Menus.findIndex(m => m.title === menu.title) : index;
                        const Icon = icons[originalIndex];
                        const isActive = menu.title === selectedView;
                        
                        return (
                            <li key={menu.title}>
                                {menu.spacing && !searchQuery && (
                                    <div className="border-t border-slate-700 my-4 opacity-50"></div>
                                )}
                                <div
                                    className={`
                                        group relative text-slate-200 text-sm flex items-center cursor-pointer rounded-xl transition-all duration-200 overflow-hidden
                                        ${(isCollapsed && !isMobile) ? 'justify-center p-3' : 'gap-x-4 p-3.5'}
                                        ${isActive 
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105' 
                                            : 'hover:bg-slate-700/50 hover:scale-102 hover:shadow-md'
                                        }
                                    `}
                                    onClick={() => handleMenuClick(menu.title)}
                                >
                                    {/* Background animation */}
                                    <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`}></div>
                                    
                                    {/* Icon */}
                                    <span className={`relative z-10 text-2xl transition-all duration-200 flex-shrink-0 ${
                                        isActive ? 'text-white scale-110' : 'text-slate-300 group-hover:text-white group-hover:scale-110'
                                    }`}>
                                        <Icon />
                                    </span>
                                    
                                    {/* Menu Text */}
                                    {(!isCollapsed || isMobile) && (
                                        <div className="relative z-10 flex-1 overflow-hidden min-w-0">
                                            <span className={`block text-base font-medium transition-colors duration-200 truncate ${
                                                isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                                            }`}>
                                                {menu.title}
                                            </span>
                                            <span className={`block text-xs transition-colors duration-200 truncate ${
                                                isActive ? 'text-indigo-100' : 'text-slate-400 group-hover:text-slate-300'
                                            }`}>
                                                {menu.description}
                                            </span>
                                        </div>
                                    )}

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-lg"></div>
                                    )}

                                    {/* Tooltip for collapsed state on desktop */}
                                    {isCollapsed && !isMobile && (
                                        <div className="absolute ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-slate-600 z-50">
                                            <div className="font-medium hover:text-transparent">{menu.title}</div>
                                            <div className="text-xs text-slate-300 hover:text-transparent">{menu.description}</div>
                                            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-600 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Footer */}
                {(!isCollapsed || isMobile) && (
                    <div className="mt-auto pt-4 border-t border-slate-700 flex-shrink-0">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 border border-slate-600/50">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                C
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">Author</div>
                                <div className="text-xs text-slate-400 truncate">104848770@student.swin.edu.au</div>
                            </div>
                            <div className="text-slate-400 hover:text-white cursor-pointer transition-colors flex-shrink-0">
                                <span className="text-lg">⚙️</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SideMenu;