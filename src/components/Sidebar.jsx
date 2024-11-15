import React, { useEffect, useState } from 'react';
import { FaHome, FaBroadcastTower, FaDigitalTachograph, FaCashRegister, FaBuilding, FaRegHandshake, FaDeezer } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarToggle }) => {
  const [recordId, setRecordId] = useState(localStorage.getItem('recordId'));
  const [isPPMInfoSaved, setIsPPMInfoSaved] = useState(localStorage.getItem('ppmInfoSaved') === 'true'); // Check if PPM info is saved
  const location = useLocation();
  const navigate = useNavigate();
  // Check if "mode=edit" is in the URL query parameters
  const isEditMode = new URLSearchParams(location.search).get('mode') === 'edit';

  // const getLinkWithMode = (path) => {
  //   const link = recordId ? `${path}?mode=edit` : path;
  //   return link;
  // };
  // Dynamically set URL with "mode=edit" if conditions are met
  const handleNavigation = (path) => {
    if (recordId && isPPMInfoSaved) {
      navigate(`${path}?mode=edit`);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
      const handleStorageChange = () => {
        setRecordId(localStorage.getItem('recordId'));
        setIsPPMInfoSaved(localStorage.getItem('ppmInfoSaved') === 'true');
      };
      handleStorageChange();
      window.addEventListener('storage', handleStorageChange());
      return () => {
        window.removeEventListener('storage', handleStorageChange());
      }
    return () => clearInterval(intervalId);
  }, [location]);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaDeezer className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/ppminfo", label: "PPM Info", icon: <FaHome className="inline-block w-6 h-6 mr-2 -mt-2" />, alwaysEnabled: true },
    { path: "/dashboard/dvrnvr", label: "DVR/NVR", icon: <FaDigitalTachograph className="inline-block w-6 h-6 mr-2 -mt-2" />},
    { path: "/dashboard/senserstatus", label: "Sensor Status", icon: <FaCashRegister className="inline-block w-6 h-6 mr-2 -mt-2" />, },
    { path: "/dashboard/routerinfo", label: "Router Info", icon: <FaBroadcastTower className="inline-block w-6 h-6 mr-2 -mt-2" />, },
    { path: "/dashboard/infrastructure", label: "Infrastructure", icon: <FaBuilding className="inline-block w-6 h-6 mr-2 -mt-2" />, },
    { path: "/dashboard/finalstatus", label: "Final Status", icon: <FaRegHandshake className="inline-block w-6 h-6 mr-2 -mt-2" />, },
  ];

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
