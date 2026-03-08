import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Search, Phone, CheckCircle, Clock, DollarSign, Loader2, User } from 'lucide-react'

const FeeStatus = () => {
  // Waxaan halkan ku darnay 'token'
  const { students, backendUrl, getStudents, token } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const handlePayment = async (studentId) => {
    try {
      setLoadingId(studentId);
      // Waxaan ku darnay headers: { token } si loo aqoonsado codsiga
      const { data } = await axios.post(
        `${backendUrl}/api/student/pay-fee`, 
        { studentId }, 
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Lacagta waa la qabtay!");
        getStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Khalad ayaa dhacay!");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.includes(searchTerm)
  );

  return (
    <div className='p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans'>
      
      {/* Top Bar - Stacked on mobile, row on desktop */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight'>MAAMULKA LACAGAHA</h1>
          <p className='text-slate-500 font-medium flex items-center gap-2 mt-1'>
            Bisha: <span className='bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold'>{currentMonth}</span>
          </p>
        </div>

        <div className='relative w-full md:w-80'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
          <input 
            type="text" 
            placeholder="Raadi arday..." 
            className='w-full pl-12 pr-4 py-3.5 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm'
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE VIEW (Visible on Medium screens and up) --- */}
      <div className='hidden md:block bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50/80 border-b border-slate-100'>
                <th className='px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest'>Ardayga & ID</th>
                <th className='px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest'>Mas'uulka</th>
                <th className='px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest'>Lacagta</th>
                <th className='px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center'>Xaaladda</th>
                <th className='px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {filteredStudents.length > 0 ? filteredStudents.map((s) => {
                const isPaid = s.lastPaymentMonth === currentMonth;
                const subTotal = s.subjects?.reduce((sum, sub) => sum + (sub.price || 0), 0) || 0;
                const finalAmount = subTotal - (s.discount || 0);

                return (
                  <tr key={s._id} className='group hover:bg-blue-50/30 transition-all'>
                    <td className='px-6 py-5'>
                      <div className='flex items-center gap-3'>
                        <div className={`flex w-10 h-10 rounded-xl items-center justify-center font-bold ${isPaid ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className='font-bold text-slate-800 text-base'>{s.name}</p>
                          <p className='text-[10px] font-mono text-slate-400 uppercase'>#{s.rollNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-5'>
                      <div className='flex flex-col'>
                        <span className='text-sm font-semibold text-slate-700'>{s.responsibleName}</span>
                        <a href={`tel:${s.responsiblePhone}`} className='text-xs text-blue-500 hover:underline flex items-center gap-1'>
                          <Phone size={10} /> {s.responsiblePhone}
                        </a>
                      </div>
                    </td>
                    <td className='px-6 py-5'>
                      <span className='font-black text-slate-900 text-lg'>${finalAmount}</span>
                    </td>
                    <td className='px-6 py-5 text-center'>
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${
                          isPaid ? 'bg-green-100 text-green-600 shadow-sm shadow-green-100' : 'bg-rose-100 text-rose-600 shadow-sm shadow-rose-100'
                        }`}>
                          {isPaid ? <CheckCircle size={14} /> : <Clock size={14} className='animate-pulse' />}
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                    </td>
                    <td className='px-6 py-5 text-right'>
                      <div className='flex justify-end'>
                        {isPaid ? (
                          <button disabled className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed'>
                            <CheckCircle size={16} /> Completed
                          </button>
                        ) : (
                          <button 
                            onClick={() => handlePayment(s._id)}
                            disabled={loadingId === s._id}
                            className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all'
                          >
                            {loadingId === s._id ? <Loader2 size={16} className='animate-spin' /> : <DollarSign size={16} />}
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              }) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARD VIEW (Visible only on small screens) --- */}
      <div className='grid grid-cols-1 gap-4 md:hidden'>
        {filteredStudents.length > 0 ? filteredStudents.map((s) => {
          const isPaid = s.lastPaymentMonth === currentMonth;
          const subTotal = s.subjects?.reduce((sum, sub) => sum + (sub.price || 0), 0) || 0;
          const finalAmount = subTotal - (s.discount || 0);

          return (
            <div key={s._id} className='bg-white p-5 rounded-3xl shadow-sm border border-slate-100'>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex items-center gap-3'>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isPaid ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className='font-bold text-slate-800 leading-tight'>{s.name}</h3>
                    <p className='text-[10px] font-mono text-slate-400 uppercase mt-0.5'>#{s.rollNumber}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 ${isPaid ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                  {isPaid ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {isPaid ? 'Paid' : 'Unpaid'}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4'>
                <div>
                  <p className='text-[10px] text-slate-400 uppercase font-bold mb-1'>Mas'uulka</p>
                  <p className='text-sm font-bold text-slate-700 truncate'>{s.responsibleName}</p>
                  <p className='text-xs text-blue-500 font-medium'>{s.responsiblePhone}</p>
                </div>
                <div className='text-right'>
                  <p className='text-[10px] text-slate-400 uppercase font-bold mb-1'>Lacagta</p>
                  <p className='text-xl font-black text-slate-900'>${finalAmount}</p>
                </div>
              </div>

              {isPaid ? (
                <button disabled className='w-full py-3.5 rounded-2xl bg-slate-100 text-slate-400 font-bold text-sm flex items-center justify-center gap-2'>
                  <CheckCircle size={18} /> Payment Completed
                </button>
              ) : (
                <button 
                  onClick={() => handlePayment(s._id)}
                  disabled={loadingId === s._id}
                  className='w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all'
                >
                  {loadingId === s._id ? <Loader2 size={18} className='animate-spin' /> : <DollarSign size={18} />}
                  Mark as Paid
                </button>
              )}
            </div>
          )
        }) : (
          <div className='py-20 text-center text-slate-400 bg-white rounded-3xl border border-dashed'>
            Arday ma helin...
          </div>
        )}
      </div>
    </div>
  )
}

export default FeeStatus