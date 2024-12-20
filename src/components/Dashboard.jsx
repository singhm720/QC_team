import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import PPMInfo from '../webpage/ppminfo';
import DVRNVR from '../webpage/dvrnvr';
import SenserStatus from '../webpage/senserstatus';
import RouterInfo from '../webpage/routerinfo';
import Infrastructure from '../webpage/infrastructure';
import FinalStatus from '../webpage/finalstatus';
import Reports from './Reports';
import DAdmin from '../webpage/admin/Dadmin'
import UserAdmin from '../webpage/admin/User_admin'
import MappingAdmin from '../webpage/admin/Mapping_admin';
import MasterAdmin from '../webpage/admin/Master_Admin';
import PMAdmin from '../webpage/admin/PMData_admin'

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
            <Route path="admin" element={<DAdmin />} />
            <Route path="User_admin" element={<UserAdmin />} />
            <Route path="Mapping_admin" element={<MappingAdmin />} />
            <Route path="Master_Admin" element={<MasterAdmin />} />
            <Route path="PMData_admin" element={<PMAdmin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
