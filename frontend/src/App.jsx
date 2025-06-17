import SideMenu from './components/SideMenu'
import Main from './components/Main';
import './App.css'
import './index.css'

function App() {
  return (
    <div >
        <div className='flex h-screen bg-slate-100'>
            <div className={`flex-1 overflow-auto`}>
                <Main />
            </div>
        </div>
    </div>
  )
}

export default App
