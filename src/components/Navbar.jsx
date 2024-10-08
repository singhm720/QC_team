import React, { useEffect, useState } from 'react';
import { FaBars, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa'
import { useLocation } from 'react-router-dom';

const Navbar = ({sidebarToggle, setSidebarToggle}) =>{
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState('E-Commerce');
  
    // Define a mapping of paths to page names
    const pageTitles = {
      '/dashboard/ppminfo': 'PPM Info',
      '/dashboard/dvrnvr': 'DVR/NVR',
      '/dashboard/senserstatus': 'Sensor Status',
      '/dashboard/routerinfo': 'Router Info',
      '/dashboard/infrastructure': 'Infrastructure',
      '/dashboard/finalstatus': 'Final Status',
    };
  
    // Update the page title based on the current path
    useEffect(() => {
      const currentPath = location.pathname;
      setPageTitle(pageTitles[currentPath] || 'E-Commerce');
    }, [location.pathname]); // Re-run this effect whenever the path changes
  
    return(
        <nav className='bg-gray-800 px-4 py-3 flex justify-between'>
            <div className='flex item-center text-x1'>
                <FaBars className='text-white me-4 cursor-pointer mt-1' onClick={() => setSidebarToggle(!sidebarToggle)}/>
                <span className='text-white font-semibold'>{pageTitle}</span>
            </div>

            <div className='flex item-centre gap-x-5'>
                <div className='relative md:w-65'>
                    <span className='relative md:absolute inset-y-0 left-0 flex item-centre pl-2'>
                        <button className='p-1 focus:outline-none text-white md:text-black'><FaSearch /></button>
                    </span>
                    <input type='text' className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block'/>
                </div>
                <div className='text-white'><FaBell className='w-6 h-6 mt-1'/></div>
                
                <div className='relative'>
                    <button className='text-white group'>
                        <FaUserCircle className='w-6 h-6 mt-1'/>
                        <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0'>
                            <ul className='py-2 text-sm text-gray-950'>
                                <li><a href=''>Profile</a></li>
                                <li><a href=''>Setting</a></li>
                                <li><a href=''>Log Out</a></li>
                            </ul>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar