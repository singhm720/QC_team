import React from 'react'
import { FaHome, FaBroadcastTower, FaDigitalTachograph, FaCashRegister, FaBuilding, FaRegHandshake } from 'react-icons/fa'
import { Link } from 'react-router-dom'


const Sidebar = ({sidebarToggle}) =>{

    return(
        <div className={`${sidebarToggle? " hidden " : " block "} w-64 bg-gray-800 fixed h-full px-4 py-2` }>
            <div className='my-2 mb-4'>
                <img src="/logo.png" alt="Company Logo" className='h-16' />
            </div>
            <hr />
            <ul className='mt-3 text-white font-bold'>
                <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                    <Link to='/ppminfo' className='px-3'>
                        <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                        PPM Info
                    </Link>
                </li>
                <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                    <Link to='/dvrnvr'  className='px-3'>
                        <FaDigitalTachograph className='inline-block w-6 h-6 mr-2 -mt-2'></FaDigitalTachograph>
                        DVR/NVR
                    </Link>
                </li>
                <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                    <Link to='/senserstatus'  className='px-3'>
                        <FaCashRegister className='inline-block w-6 h-6 mr-2 -mt-2'></FaCashRegister>
                        Senser Status
                    </Link>
                </li>
                <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                    <Link to='/routerinfo' className='px-3'>
                        <FaBroadcastTower className='inline-block w-6 h-6 mr-2 -mt-2'></FaBroadcastTower>
                        Router Info
                    </Link>
                </li>
                <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                    <Link to='/infrastructure' className='px-3'>
                        <FaBuilding className='inline-block w-6 h-6 mr-2 -mt-2'></FaBuilding>
                        Infrastructure
                    </Link>
                </li>
                <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                    <Link to='/finalstatus' className='px-3'>
                        <FaRegHandshake className='inline-block w-6 h-6 mr-2 -mt-2'></FaRegHandshake>
                        Final Status
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar