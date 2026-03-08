import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../context/AppContext' // Soo jiido context-ka

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { userData, logout } = useContext(AppContext) // Ka soo saar userData iyo logout

  return (
    <>
      {/* HAMBURGER ICON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-4 z-[70] md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-md active:scale-90 transition-all"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* SIDEBAR CONTAINER */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white border-r transition-all duration-300 z-[60]
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-16 lg:w-64'}
      `}>
        
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Space */}
          
          <div className="h-20 flex items-center px-6 border-b md:border-b-0">
             <h2 className={`font-black text-blue-600 tracking-tighter transition-opacity whitespace-nowrap ${!isOpen ? 'md:hidden lg:block' : 'block'}`}>
              Al-minhaj<span className='text-gray-700'>School</span>
             </h2>
          </div>

          <ul className='flex flex-col gap-2 mt-4 flex-1'>
            {/* Dashboard & Subjects waxaa arki kara oo kaliya ADMIN */}
            {userData?.role === 'admin' && (
              <NavItem to="/dashboard" icon="📊" label="Dashboard" isOpen={isOpen} closeMobile={() => setIsOpen(false)} />
            )}
            
            <NavItem to="/students" icon="👨‍🎓" label="Students" isOpen={isOpen} closeMobile={() => setIsOpen(false)} />
            <NavItem to="/Attendance" icon="📝" label="Attendance" isOpen={isOpen} closeMobile={() => setIsOpen(false)} />
            
            {userData?.role === 'admin' && (
              <NavItem to="/subjects" icon="📚" label="Subjects" isOpen={isOpen} closeMobile={() => setIsOpen(false)} />
            )}

            <NavItem to="/feestatus" icon="💰" label="FeeStatus" isOpen={isOpen} closeMobile={() => setIsOpen(false)} />
          </ul>

          {/* LOGOUT BUTTON - Hoosta lagu daray */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={logout}
              className={`flex items-center gap-4 py-3 px-5 lg:px-7 w-full text-blue-600 hover:text-white hover:bg-blue-600 rounded-2xl transition-all font-bold`}
            >
              <span className="text-xl shrink-0">📤</span>
              <p className={`whitespace-nowrap ${!isOpen ? 'md:hidden lg:block' : 'block'}`}>
                Logout
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const NavItem = ({ to, icon, label, isOpen, closeMobile }) => (
  <NavLink 
    to={to} 
    onClick={closeMobile}
    className={({isActive}) => `
      flex items-center gap-4 py-3 px-5 lg:px-7 cursor-pointer transition-all
      ${isActive ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}
    `}
  >
    <span className="text-xl shrink-0">{icon}</span>
    <p className={`transition-all duration-200 whitespace-nowrap ${!isOpen ? 'md:hidden lg:block' : 'block'}`}>
      {label}
    </p>
  </NavLink>
)

export default Sidebar