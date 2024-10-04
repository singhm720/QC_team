import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
const[sidebarToggle, setSidebarToggle] = useState(false)
  return (
    <Router>
      <div className='flex'>
        <Sidebar sidebarToggle={sidebarToggle}/>
          <Dashboard
            sidebarToggle={sidebarToggle}
            setSidebarToggle={setSidebarToggle}
          />
        </div>
    </Router>
  )
}

export default App
