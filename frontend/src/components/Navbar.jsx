import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  // Waxaan ka soo qaadaneynaa userData iyo logout function Context-ka
  const { userData, logout } = useContext(AppContext)

  return (
    <div className='flex justify-between items-center px-4 md:px-8 py-4 bg-white border-b sticky top-0 z-[40]'>
      
      {/* pl-12: Waxay banaynaysaa meesha Hamburger-ka uu taanyahay mobile-ka */}
      <h1 className='text-xl md:text-2xl font-bold text-blue-600 pl-12 md:pl-0 transition-all'>
        Al-minhaj <span className='text-gray-700'>school</span>
      </h1>
      
      <div className='flex items-center gap-4'>
        
        {/* User Profile Circle - Waxaan muujineynaa xarafka hore ee magaca */}
        <div className='flex items-center gap-2'>
          <div className='w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-black shadow-sm border-2 border-blue-100'>
             {/* Haddii userData uu jiro, soo qaad xarafka hore ee magaca */}
             {userData ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className='hidden sm:block text-left'>
             <p className='text-xs font-black text-slate-800 leading-none'>{userData?.name}</p>
             <p className='text-[10px] font-bold text-blue-500 uppercase tracking-tighter'>{userData?.role}</p>
          </div>
        </div>

        {/* Logout Button - Hadda waa mid shaqaynaya */}
        <button 
          onClick={logout}
          className='bg-slate-100 text-slate-600 px-4 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all text-xs font-black uppercase tracking-widest border border-transparent hover:border-rose-100 active:scale-95'
        >
          Logout
        </button>
        
      </div>
    </div>
  )
}

export default Navbar