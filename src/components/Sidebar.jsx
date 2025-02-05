import React, { useEffect, useState } from 'react';
import { FaHome, FaBroadcastTower, FaDigitalTachograph, FaCashRegister, FaBuilding, FaRegHandshake, FaDeezer, FaUserPlus, FaTasks, FaDatabase } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarToggle }) => {
  const [recordId, setRecordId] = useState(localStorage.getItem('recordId'));
  const [isPPMInfoSaved, setIsPPMInfoSaved] = useState(localStorage.getItem('ppmInfoSaved') === 'true');
  const [userType, setUserType] = useState(sessionStorage.getItem('user_type')); // Fetch user type
  const location = useLocation();
  const navigate = useNavigate();

  const isEditMode = new URLSearchParams(location.search).get('mode');
  const id = new URLSearchParams(location.search).get('id');

  const handleNavigation = (path) => {
    if (isEditMode === 'edit') {
        navigate(`${path}?mode=edit`);
    } else if (isEditMode === 'editnew') {
        navigate(`${path}?mode=editnew&id=${id}`);
    } else {
        navigate(path);
    }
};


  useEffect(() => {
    const handleStorageChange = () => {
      setRecordId(localStorage.getItem('recordId'));
      setIsPPMInfoSaved(localStorage.getItem('ppmInfoSaved') === 'true');
      setUserType(sessionStorage.getItem('user_type')); // Update user type
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  },
  [location]);

  const generalMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaDeezer className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/ppminfo", label: "PPM Info", icon: <FaHome className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/dvrnvr", label: "DVR/NVR", icon: <FaDigitalTachograph className="inline-block w-6 h-6 mr-2 -mt-2" /> },
    { path: "/dashboard/senserstatus", label: "Sensor Status", icon: <FaCashRegister className="inline-block w-6 h-6 mr-2 -mt-2" /> },
    { path: "/dashboard/routerinfo", label: "Router Info", icon: <FaBroadcastTower className="inline-block w-6 h-6 mr-2 -mt-2" /> },
    { path: "/dashboard/infrastructure", label: "Infrastructure", icon: <FaBuilding className="inline-block w-6 h-6 mr-2 -mt-2" /> },
    { path: "/dashboard/finalstatus", label: "Final Status", icon: <FaRegHandshake className="inline-block w-6 h-6 mr-2 -mt-2" /> },
  ];

  const adminMenuItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: <FaDeezer className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/User_admin", label: "Users", icon: <FaUserPlus className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/Mapping_admin", label: "Mapping", icon: <FaTasks className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/Master_Admin", label: "Master Data", icon: <FaDatabase className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/PMData_admin", label: "PM Data", icon: <FaDatabase className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
  ];

  const menuItems = userType === 'Admin' ? adminMenuItems : generalMenuItems;

  return (
    <div className={`${sidebarToggle ? 'hidden' : 'block'} w-64 bg-gray-800 fixed h-full px-4 py-2`}>
      <div className="my-2 mb-4">
        <img src="/logo.png" alt="Company Logo" className="h-16" />
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">
        {menuItems.map((item) => {
          const isEnabled = isEditMode || item.alwaysEnabled || isPPMInfoSaved;
          const linkClass = isEnabled ? 'hover:shadow hover:bg-blue-500' : 'cursor-not-allowed text-gray-500';

          return (
            <li key={item.path} className={`mb-2 rounded py-2 ${linkClass}`}>
              {isEnabled ? (
                <span onClick={() => handleNavigation(item.path)} className="px-3 flex items-center cursor-pointer">
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                <span className="px-3 flex items-center">
                  {item.icon}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
