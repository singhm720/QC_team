import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import PPMInfo from '../webpage/PPMInfo';
import DVRNVR from '../webpage/dvrnvr';
import SenserStatus from '../webpage/senserstatus';
import RouterInfo from '../webpage/RouterInfo';
import Infrastructure from '../webpage/Infrastructure';
import FinalStatus from '../webpage/FinalStatus';
import Reports from './Reports';

const Dashboard = ({ sidebarToggle, setSidebarToggle }) => {
  return (
    <div className="flex w-full bg-light">
      <div className={`${sidebarToggle ? '' : 'ml-64'} w-full`}>
        <Navbar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
        <div className="p-2">
          <Routes>
            <Route path='/' element={<Reports/>}/>
            <Route path="ppminfo" element={<PPMInfo />} />
            <Route path="dvrnvr" element={<DVRNVR />} />
            <Route path="senserstatus" element={<SenserStatus />} />
            <Route path="routerinfo" element={<RouterInfo />} />
            <Route path="infrastructure" element={<Infrastructure />} />
            <Route path="finalstatus" element={<FinalStatus />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
