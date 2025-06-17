import '../index.css';
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import GuideLine from './Guidelines';
import Report from './Report';
import ReadMe from './Readme';
import SideMenu from './SideMenu';

const Main = () => {
    const [selectedView, setSelectedView] = useState('GuideLine');
    const [menuOpen, setMenuOpen] = useState(true);
    
    const renderContent = () => {
        switch(selectedView) {
            case 'Dashboard':
                return (
                    <Dashboard />
                );
            case 'Guidelines':
                return (
                    <GuideLine />
                );
            case 'Report':
                return (
                    <Report />
                );
            case 'ReadMe':
                return (
                    <ReadMe />
                );
            default: 
                return (
                    <GuideLine />
                );
        }
    };

    return (
        <div className='flex h-screen bg-slate-100'>
            <div>
                <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} onMenuClick={setSelectedView} selectedView={selectedView} />
            </div>
            <div className={`flex-1 overflow-auto`}>
                {renderContent()}
            </div>
        </div>
    )
}

export default Main;