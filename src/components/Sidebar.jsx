import React from 'react';
import { FaHome, FaBroadcastTower, FaDigitalTachograph, FaCashRegister, FaBuilding, FaRegHandshake , FaDeezer } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarToggle }) => {
  return (
    <div className={`${sidebarToggle ? 'hidden' : 'block'} w-64 bg-gray-800 fixed h-full px-4 py-2`}>
      <div className="my-2 mb-4">
        <img src="/logo.png" alt="Company Logo" className="h-16" />
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">

      <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard" className="px-3">
            <FaDeezer className="inline-block w-6 h-6 mr-2 -mt-2"></FaDeezer>
            Dashboard
          </Link>
        </li>

        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard/ppminfo" className="px-3">
            <FaHome className="inline-block w-6 h-6 mr-2 -mt-2"></FaHome>
            PPM Info
          </Link>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard/dvrnvr" className="px-3">
            <FaDigitalTachograph className="inline-block w-6 h-6 mr-2 -mt-2"></FaDigitalTachograph>
            DVR/NVR
          </Link>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard/senserstatus" className="px-3">
            <FaCashRegister className="inline-block w-6 h-6 mr-2 -mt-2"></FaCashRegister>
            Senser Status
          </Link>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard/routerinfo" className="px-3">
            <FaBroadcastTower className="inline-block w-6 h-6 mr-2 -mt-2"></FaBroadcastTower>
            Router Info
          </Link>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard/infrastructure" className="px-3">
            <FaBuilding className="inline-block w-6 h-6 mr-2 -mt-2"></FaBuilding>
            Infrastructure
          </Link>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard/finalstatus" className="px-3">
            <FaRegHandshake className="inline-block w-6 h-6 mr-2 -mt-2"></FaRegHandshake>
            Final Status
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
