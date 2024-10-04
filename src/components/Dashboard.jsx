import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import PPMInfo from '../webpage/PPMInfo'
import DVRNVR from '../webpage/DVRNVR'
import SensorStatus from '../webpage/SensorStatus'
import RouterInfo from '../webpage/RouterInfo'
import Infrastructure from '../webpage/Infrastructure'
import FinalStatus from '../webpage/FinalStatus'

const Dashboard = ({ sidebarToggle, setSidebarToggle }) => {
    return (
        <Router>
            <div className="flex">
                <Sidebar sidebarToggle={sidebarToggle} />
                <div className={`${sidebarToggle ? "" : "ml-64"} w-full`}>
                    <Navbar
                        sidebarToggle={sidebarToggle}
                        setSidebarToggle={setSidebarToggle}
                    />
                    <div className="p-4">
                        <Routes>
                            <Route path="/ppminfo" element={<PPMInfo />} />
                            <Route path="/dvrnvr" element={<DVRNVR />} />
                            <Route path="/sensorstatus" element={<SensorStatus />} />
                            <Route path="/routerinfo" element={<RouterInfo />} />
                            <Route path="/infrastructure" element={<Infrastructure />} />
                            <Route path="/finalstatus" element={<FinalStatus />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    )
}

export default Dashboard
