import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Subjects = () => {
  // Waxaan halkan ku darnay 'token'
  const { subjects, backendUrl, getSubjects, token } = useContext(AppContext)
  const [showForm, setShowForm] = useState(false)
  const [isEdit, setIsEdit] = useState(null)
  const [formData, setFormData] = useState({ name: '', price: '', description: '' })

  const removeSubject = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto maaddadan?")) {
      try {
        // Waxaan ku darnay headers: { token }
        const { data } = await axios.delete(`${backendUrl}/api/subject/remove/${id}`, { headers: { token } })
        if (data.success) {
          toast.success(data.message)
          getSubjects() 
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error("Khalad ayaa dhacay xilliga tirtirista")
      }
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      let data;
      if (isEdit) {
        // Waxaan ku darnay headers: { token } qaybta Update-ka
        const res = await axios.put(`${backendUrl}/api/subject/update/${isEdit}`, formData, { headers: { token } })
        data = res.data
      } else {
        // Waxaan ku darnay headers: { token } qaybta Add-ka
        const res = await axios.post(`${backendUrl}/api/subject/add`, formData, { headers: { token } })
        data = res.data
      }

      if (data.success) {
        toast.success(data.message)
        setShowForm(false)
        setIsEdit(null)
        setFormData({ name: '', price: '', description: '' })
        getSubjects()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Ma suuragalin in la kaydiyo")
    }
  }

  return (
    <div className='p-3 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
      
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Maamulka Maaddooyinka</h1>
          <p className='text-sm text-gray-500'>Kudar ama wax ka beddel liiska maaddooyinka</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setIsEdit(null); setFormData({name:'', price:'', description:''}) }} 
          className='w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold'
        >
          <i className="fa-solid fa-plus text-sm"></i> Add New Subject
        </button>
      </div>

      {/* MODAL FORM (Improved UI) */}
      {showForm && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <form onSubmit={onSubmitHandler} className='bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold text-gray-800'>{isEdit ? "Beddel Maaddada" : "Ku dar Maaddo"}</h2>
              <button type='button' onClick={() => setShowForm(false)} className='text-gray-400 hover:text-red-500 transition'><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div className='space-y-5'>
              <div className='space-y-1'>
                <label className='text-sm font-semibold text-gray-600'>Magaca Maaddada</label>
                <input className='w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-blue-500 transition' placeholder='Tusaale: Mathematics' value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-semibold text-gray-600'>Qiimaha ($)</label>
                <input className='w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-blue-500 transition' type='number' placeholder='0.00' value={formData.price} onChange={(e)=>setFormData({...formData, price:e.target.value})} required />
              </div>
              <div className='space-y-1'>
                <label className='text-sm font-semibold text-gray-600'>Sharaxaad</label>
                <textarea rows="3" className='w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-blue-500 transition resize-none' placeholder='Faahfaahin...' value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})} />
              </div>
            </div>

            <div className='flex gap-3 mt-8'>
              <button type='button' onClick={() => setShowForm(false)} className='flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition'>Jooji</button>
              <button type='submit' className='flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition'>Kaydi</button>
            </div>
          </form>
        </div>
      )}

      {/* RESPONSIVE LIST (Table on Desktop, Cards on Mobile) */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        
        {/* Desktop View Table */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold'>
              <tr>
                <th className='p-5'>Maaddada</th>
                <th className='p-5'>Sharaxaadda</th>
                <th className='p-5'>Qiimaha</th>
                <th className='p-5 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {subjects && subjects.length > 0 ? subjects.map((item) => (
                <tr key={item._id} className='hover:bg-blue-50/30 transition-colors group'>
                  <td className='p-5 font-bold text-gray-700'>{item.name}</td>
                  <td className='p-5 text-sm text-gray-500 max-w-xs truncate'>{item.description || 'No description'}</td>
                  <td className='p-5'><span className='bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm'>${item.price}</span></td>
                  <td className='p-5'>
                    <div className='flex justify-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity'>
                      <button onClick={() => { setIsEdit(item._id); setFormData({name:item.name, price:item.price, description:item.description}); setShowForm(true) }} className='p-2 hover:bg-green-100 rounded-lg transition text-green-600'><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => removeSubject(item._id)} className='p-2 hover:bg-red-100 rounded-lg transition text-red-500'><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-20 text-center text-gray-400 italic">Maaddooyin lama helin...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className='md:hidden divide-y divide-gray-100'>
          {subjects && subjects.length > 0 ? subjects.map((item) => (
            <div key={item._id} className='p-4 space-y-3'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>{item.name}</h3>
                </div>
                <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm'>${item.price}</span>
              </div>
              <div className='flex gap-2 pt-2'>
                <button onClick={() => { setIsEdit(item._id); setFormData({name:item.name, price:item.price, description:item.description}); setShowForm(true) }} className='flex-1 bg-green-50 text-green-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2'><i className="fa-solid fa-pen text-xs"></i> Edit</button>
                <button onClick={() => removeSubject(item._id)} className='flex-1 bg-red-50 text-red-500 py-2 rounded-lg font-semibold flex items-center justify-center gap-2'><i className="fa-solid fa-trash text-xs"></i>delete</button>
              </div>
            </div>
          )) : (
            <div className='p-10 text-center text-gray-400'>Maaddooyin lama helin...</div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Subjects