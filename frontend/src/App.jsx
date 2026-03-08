import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddStudent from './pages/AddStudent'
import Students from './pages/Students'
import Subjects from './pages/Subjects'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/Landingpage' 
import FeeStatus from './pages/Feestatus'
import Login from './pages/Login' 
import { AppContext } from './context/AppContext'
const App = () => {
  const { token, userData } = useContext(AppContext)

  // ProtectedRoute: Xannibaadda meelaha macallinka laga rabo in laga ilaaliyo
  const ProtectedRoute = ({ children }) => {
    if (userData?.role !== 'admin') {
      toast.warn("Halkaan maamulka kaliya ayaa arki karo!", { toastId: 'admin-only' });
      return <Navigate replace to="/attendance" />; 
    }
    return children;
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {!token ? (
        <Login />
      ) : (
        <div className='flex'>
          <Sidebar />

          <div className='flex-1 transition-all duration-300 md:ml-16 lg:ml-64'>
            <Navbar />

            <div className='p-4 sm:p-6 lg:p-8'>
              <Routes>
                {/* Home Page */}
                <Route path="/" element={<LandingPage />} />

                {/* --- ADMIN ONLY ROUTES --- */}
                <Route path='/dashboard' element={
                  <ProtectedRoute> <Dashboard /> </ProtectedRoute>
                } />
                
                

                <Route path='/subjects' element={
                  <ProtectedRoute> <Subjects /> </ProtectedRoute>} />

                {/* --- SHARED ROUTES (Admin & Teacher) --- */}
                <Route path='/students' element={<Students />} />
                <Route path='/attendance' element={<Attendance />} />
                <Route path='/add-student' element={<AddStudent />} />
                <Route path='/feestatus' element={<FeeStatus />} />
                <Route path='/update-student/:id' element={<AddStudent />} />
                

                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App