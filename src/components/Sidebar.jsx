import React, { createContext, useEffect, useState } from 'react';
import { FaHome, FaBroadcastTower, FaDigitalTachograph, FaCashRegister, FaBuilding, FaRegHandshake, FaDeezer } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';


export const SidebarContext = createContext();

const Sidebar = ({ sidebarToggle, children }) => {
  const location = useLocation();
  const [recordId, setRecordId] = useState(localStorage.getItem('recordId'));
  const [isPPMInfoFilled, setIsPPMInfoFilled] = useState(false);
  const isEditMode = new URLSearchParams(location.search).get("mode") === "edit";

  // Update PPM info status from localStorage
  useEffect(() => {
    setIsPPMInfoFilled(localStorage.getItem('isPPMInfoFilled') === 'true');

    const handleStorageChange = () => {
      setRecordId(localStorage.getItem('recordId'));
      setIsPPMInfoFilled(localStorage.getItem('isPPMInfoFilled') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Helper function to add mode=edit to the link if recordId is present
  const getLinkWithMode = (path) => {
    const link = recordId ? `${path}?mode=edit` : path;
    return link;
  };

  return (
    <SidebarContext.Provider value={{ isPPMInfoFilled, recordId }}>
    <div className={`${sidebarToggle ? 'hidden' : 'block'} w-64 bg-gray-800 fixed h-full px-4 py-2`}>
      <div className="my-2 mb-4">
        <img src="/logo.png" alt="Company Logo" className="h-16" />
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/dashboard" className="px-3">
            <FaDeezer className="inline-block w-6 h-6 mr-2 -mt-2" />
            Dashboard
          </Link>
        </li>

        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to={getLinkWithMode("/dashboard/ppminfo")} className="px-3">
            <FaHome className="inline-block w-6 h-6 mr-2 -mt-2" />
            PPM Info
          </Link>
        </li>

        <li className={`mb-2 rounded py-2 ${(!isPPMInfoFilled && !isEditMode) ? 'text-gray-500 cursor-not-allowed' : 'hover:shadow hover:bg-blue-500'}`}>
          <Link
            to={getLinkWithMode("/dashboard/dvrnvr")}
            className="px-3"
            style={{
              pointerEvents: (!isPPMInfoFilled && !isEditMode) ? 'none' : 'auto',
              color: (!isPPMInfoFilled && !isEditMode) ? 'gray' : 'white'
            }}
          >
            <FaDigitalTachograph className="inline-block w-6 h-6 mr-2 -mt-2" />
            DVR/NVR
          </Link>
        </li>

        <li className={`mb-2 rounded py-2 ${(!isPPMInfoFilled && !isEditMode) ? 'text-gray-500 cursor-not-allowed' : 'hover:shadow hover:bg-blue-500'}`}>
          <Link
            to={getLinkWithMode("/dashboard/senserstatus")}
            className="px-3"
            style={{
              pointerEvents: (!isPPMInfoFilled && !isEditMode) ? 'none' : 'auto',
              color: (!isPPMInfoFilled && !isEditMode) ? 'gray' : 'white'
            }}
          >
            <FaCashRegister className="inline-block w-6 h-6 mr-2 -mt-2" />
            Senser Status
          </Link>
        </li>

        <li className={`mb-2 rounded py-2 ${(!isPPMInfoFilled && !isEditMode) ? 'text-gray-500 cursor-not-allowed' : 'hover:shadow hover:bg-blue-500'}`}>
          <Link
            to={getLinkWithMode("/dashboard/routerinfo")}
            className="px-3"
            style={{
              pointerEvents: (!isPPMInfoFilled && !isEditMode) ? 'none' : 'auto',
              color: (!isPPMInfoFilled && !isEditMode) ? 'gray' : 'white'
            }}
          >
            <FaBroadcastTower className="inline-block w-6 h-6 mr-2 -mt-2" />
            Router Info
          </Link>
        </li>

        <li className={`mb-2 rounded py-2 ${(!isPPMInfoFilled && !isEditMode) ? 'text-gray-500 cursor-not-allowed' : 'hover:shadow hover:bg-blue-500'}`}>
          <Link
            to={getLinkWithMode("/dashboard/infrastructure")}
            className="px-3"
            style={{
              pointerEvents: (!isPPMInfoFilled && !isEditMode) ? 'none' : 'auto',
              color: (!isPPMInfoFilled && !isEditMode) ? 'gray' : 'white'
            }}
          >
            <FaBuilding className="inline-block w-6 h-6 mr-2 -mt-2" />
            Infrastructure
          </Link>
        </li>

        <li className={`mb-2 rounded py-2 ${(!isPPMInfoFilled && !isEditMode) ? 'text-gray-500 cursor-not-allowed' : 'hover:shadow hover:bg-blue-500'}`}>
          <Link
            to={getLinkWithMode("/dashboard/finalstatus")}
            className="px-3"
            style={{
              pointerEvents: (!isPPMInfoFilled && !isEditMode) ? 'none' : 'auto',
              color: (!isPPMInfoFilled && !isEditMode) ? 'gray' : 'white'
            }}
          >
            <FaRegHandshake className="inline-block w-6 h-6 mr-2 -mt-2" />
            Final Status
          </Link>
        </li>
      </ul>
    </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
