import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Students = () => {
  // Waxaan halkan ka soo bixinnay 'token' maadaama looga baahan yahay tirtirista
  const { students, backendUrl, getStudents, token } = useContext(AppContext)
  const navigate = useNavigate()

  // Markii qofku soo galo boggan, mar walba xogta ha la soo cusboonaysiiyo
  useEffect(() => {
    if (token) {
      getStudents()
    }
  }, [token])

  // Function-ka tirtirista ardayga
  const removeStudent = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto ardaygan?")) {
      try {
        // MUHIIM: Waxaan ku darnay headers-ka token-ka leh
        const { data } = await axios.delete(`${backendUrl}/api/student/remove/${id}`, {
          headers: { token }
        })

        if (data.success) {
          toast.success("Ardayga waa la tirtiray")
          getStudents() // Dib u soo qaad liiska cusub
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Ma haysatid awoodda tirtirista!")
      }
    }
  }

  return (
    <div className='p-3 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Liiska Ardayda</h1>
          <p className='text-sm text-gray-500'>Maamul xogta ardayda diiwaangashan</p>
        </div>
        <button 
          onClick={() => navigate('/add-student')} 
          className='w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold'
        >
          <i className="fa-solid fa-plus text-sm"></i> Add New Student
        </button>
      </div>

      {/* Main Container */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        
        {/* Desktop View Table */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold'>
              <tr>
                <th className='p-5'>Magaca</th>
                <th className='p-5'>Gender</th>
                <th className='p-5'>Roll No</th>
                <th className='p-5'>Maadooyinka</th>
                <th className='p-5'>Mas'uulka / Tel</th>
                <th className='p-5 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {students && students.length > 0 ? (
                students.map((item) => (
                  <tr key={item._id} className='hover:bg-blue-50/30 transition-colors group'>
                    <td className='p-5 font-bold text-gray-700'>{item.name}</td>
                    <td className='p-5'>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${item.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                        {item.gender}
                      </span>
                    </td>
                    <td className='p-5 text-gray-600 font-medium'>{item.rollNumber}</td>
                    <td className='p-5'>
                      <div className='flex flex-wrap gap-1 max-w-[200px]'>
                        {item.subjects && item.subjects.length > 0 ? (
                          item.subjects.map((sub, index) => (
                            <span key={index} className='bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-blue-100'>
                              {sub.name}
                            </span>
                          ))
                        ) : (
                          <span className='text-gray-400 text-xs italic'>Maaddo ma jidho</span>
                        )}
                      </div>
                    </td>
                    <td className='p-5'>
                      <div className='flex flex-col'>
                        <span className='text-sm font-semibold text-gray-700'>{item.responsibleName}</span>
                        <span className='text-xs text-gray-500'>{item.responsiblePhone}</span>
                      </div>
                    </td>
                    <td className='p-5'>
                      <div className='flex justify-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity'>
                        <button onClick={() => navigate(`/update-student/${item._id}`)} className='p-2 hover:bg-green-100 rounded-lg transition text-green-600'>
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => removeStudent(item._id)} className='p-2 hover:bg-red-100 rounded-lg transition text-red-500'>
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="p-20 text-center text-gray-400 italic">Xog arday ma jirto...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className='md:hidden divide-y divide-gray-100'>
          {students && students.length > 0 ? (
            students.map((item) => (
              <div key={item._id} className='p-5 space-y-4'>
                <div className='flex justify-between items-start'>
                  <div className='flex gap-3 items-center'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${item.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-800'>{item.name}</h3>
                      <div className='flex items-center gap-2'>
                        <p className='text-xs text-gray-500'>ID: {item.rollNumber}</p>
                        <span className='text-[9px] font-bold uppercase'>{item.gender}</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button onClick={() => navigate(`/update-student/${item._id}`)} className='p-2 bg-green-50 text-green-600 rounded-lg'>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => removeStudent(item._id)} className='p-2 bg-red-50 text-red-500 rounded-lg'>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl'>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-gray-400'>Mas'uulka</p>
                    <p className='text-sm font-semibold text-gray-700'>{item.responsibleName}</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-gray-400'>Telefoonka</p>
                    <p className='text-sm font-semibold text-gray-700'>{item.responsiblePhone}</p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <p className='text-[10px] uppercase font-bold text-gray-400'>Maaddooyinka</p>
                  <div className='flex flex-wrap gap-1'>
                    {item.subjects && item.subjects.length > 0 ? (
                      item.subjects.map((sub, index) => (
                        <span key={index} className='bg-white border border-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded-md'>
                          {sub.name}
                        </span>
                      ))
                    ) : (
                      <span className='text-gray-400 text-xs italic'>Maaddo ma jidho</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='p-10 text-center text-gray-400'>Xog arday ma jirto...</div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Students