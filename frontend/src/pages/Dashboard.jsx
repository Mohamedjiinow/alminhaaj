import React, { useContext, useMemo, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Users, UserCheck, BookOpen, Wallet, Clock, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const { students, subjects, backendUrl, token } = useContext(AppContext)
  const [topAbsent, setTopAbsent] = useState([])

  // 1. Logic-ga Bisha
  const currentMonth = new Date().toISOString().slice(0, 7);

  // 2. Soo aqriska xogta maqnaanshiyaha
  useEffect(() => {
    const fetchTopAbsent = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/attendance/summary`, { headers: { token } })
        if (data.success) {
          setTopAbsent(data.topAbsent.slice(0, 4))
        }
      } catch (error) {
        console.log("Error fetching attendance summary")
      }
    }
    if (token) {
      fetchTopAbsent()
    }
  }, [backendUrl, token])

  // 3. Xisaabinta Tirada iyo Lacagta
  const stats = useMemo(() => {
    let male = 0;
    let female = 0;
    let totalExpected = 0;
    let totalPaid = 0;

    students.forEach(s => {
      if (s.gender === 'Male') male++;
      else if (s.gender === 'Female') female++;

      const subTotal = s.subjects?.reduce((sum, sub) => sum + (sub.price || 0), 0) || 0;
      const finalFee = subTotal - (s.discount || 0);
      
      totalExpected += finalFee;
      if (s.lastPaymentMonth === currentMonth) {
        totalPaid += finalFee;
      }
    });

    return {
      male,
      female,
      totalStudents: students.length,
      expected: totalExpected,
      paid: totalPaid,
      remaining: totalExpected - totalPaid,
      recentStudents: [...students].reverse().slice(0, 3) 
    };
  }, [students, currentMonth]);

  const financeData = [
    { name: 'La Bixiyay', value: stats.paid },
    { name: 'Dhiman', value: stats.remaining },
  ];

  const FINANCE_COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className='p-4 sm:p-8 bg-[#f8fafc] min-h-screen'>
      
      {/* 1. Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase'>Dashboard-ka Guud</h1>
          <p className='text-slate-500 font-medium'>Xogta bisha: <span className='text-blue-600 font-bold'>{currentMonth}</span></p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg shadow-blue-100 hover:scale-105 transition-all w-full md:w-auto justify-center cursor-default'>
          Soo Dhawoow Maamule
        </button>
      </div>

      {/* 2. Top Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8'>
        <div className='bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4'>
          <div className='w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0'>
            <Users size={24} />
          </div>
          <div>
            <p className='text-slate-400 text-[10px] font-black uppercase tracking-wider'>Ardayda</p>
            <h2 className='text-xl font-black text-slate-800'>{stats.totalStudents}</h2>
          </div>
        </div>

        <div className='bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4'>
          <div className='w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center shrink-0'>
            <UserCheck size={24} />
          </div>
          <div className='flex flex-col text-xs font-black'>
            <span className='text-blue-600'>{stats.male} WIILAL</span>
            <span className='text-pink-600'>{stats.female} GABDHO</span>
          </div>
        </div>

        <div className='bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4'>
          <div className='w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0'>
            <BookOpen size={24} />
          </div>
          <div>
            <p className='text-slate-400 text-[10px] font-black uppercase tracking-wider'>Maaddooyinka</p>
            <h2 className='text-xl font-black text-slate-800'>{subjects.length}</h2>
          </div>
        </div>

        <div className='bg-rose-500 p-6 rounded-[2rem] shadow-lg shadow-rose-100 flex items-center gap-4'>
          <div className='w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center shrink-0'>
            <Clock size={24} />
          </div>
          <div>
            <p className='text-white/70 text-[10px] font-black uppercase tracking-wider'>Dhiman (Debt)</p>
            <h2 className='text-xl font-black text-white'>${stats.remaining}</h2>
          </div>
        </div>
      </div>

      {/* 3. Financial Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 flex justify-between items-center shadow-sm'>
           <div className='flex items-center gap-4'>
              <div className='w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center'><Wallet size={28}/></div>
              <div>
                <p className='text-slate-400 text-xs font-bold uppercase'>Target-ka Bishaan</p>
                <h3 className='text-2xl font-black text-slate-800'>${stats.expected}</h3>
              </div>
           </div>
           <TrendingUp className='text-slate-200 hidden sm:block' size={40}/>
        </div>

        <div className='bg-white p-6 rounded-[2.5rem] border-2 border-green-50 flex justify-between items-center shadow-sm'>
           <div className='flex items-center gap-4'>
              <div className='w-14 h-14 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center'><CheckCircle size={28}/></div>
              <div>
                <p className='text-slate-400 text-xs font-bold uppercase'>La Bixiyay (Paid)</p>
                <h3 className='text-2xl font-black text-green-600'>${stats.paid}</h3>
              </div>
           </div>
           <div className='text-right'>
              <p className='text-[10px] font-black text-green-500'>COLLECTED</p>
              <p className='text-lg font-black text-slate-700'>{((stats.paid/stats.expected)*100 || 0).toFixed(0)}%</p>
           </div>
        </div>
      </div>

      {/* 4. Charts & Sections */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        
        {/* Payment Chart */}
        <div className='bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 lg:col-span-1'>
          <h3 className='font-black text-slate-800 uppercase text-xs tracking-widest mb-6 italic'>Payment Progress</h3>
          <div className='h-[250px]'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={financeData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                  {financeData.map((e, i) => <Cell key={i} fill={FINANCE_COLORS[i]} stroke="none" cornerRadius={10} />)}
                </Pie>
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 Arday ee ugu maqnaanshiyaha badan - FIXED UI */}
        <div className='bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 lg:col-span-1'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='font-black text-rose-600 uppercase text-xs tracking-widest flex items-center gap-2'>
               <AlertTriangle size={16}/> Top Absent
            </h3>
            <span className='text-[9px] bg-rose-50 text-rose-600 px-2 py-1 rounded-full font-black uppercase'>Bishaan</span>
          </div>
          <div className='space-y-3'>
            {topAbsent.length > 0 ? topAbsent.map((item, index) => (
              <div key={index} className='flex items-center justify-between p-3 rounded-2xl bg-rose-50/30 border border-rose-50 gap-2'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className='w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0'>
                    {item.name.charAt(0)}
                  </div>
                  <span className='font-bold text-slate-700 text-sm truncate uppercase'>
                    {item.name}
                  </span>
                </div>
                <div className='text-right shrink-0 min-w-fit'>
                   <span className='block text-xs font-black text-rose-600 whitespace-nowrap'>
                     {item.days} Maalmood
                   </span>
                   <span className='text-[9px] text-slate-400 font-bold uppercase block'>
                     Maqan
                   </span>
                </div>
              </div>
            )) : (
              <div className='text-center py-10'>
                <p className='text-slate-400 text-xs italic'>Dhamaan ardaydu waa joogaan</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Students */}
        <div className='bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 lg:col-span-1'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='font-black text-slate-800 uppercase text-xs tracking-widest'>Cusub</h3>
            <span className='text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold'>UPDATES</span>
          </div>
          <div className='space-y-3'>
            {stats.recentStudents.length > 0 ? stats.recentStudents.map((student) => (
              <div key={student._id} className='flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100 gap-2'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-xs shrink-0 ${student.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                    {student.name.charAt(0)}
                  </div>
                  <div className='min-w-0'>
                    <p className='font-bold text-slate-800 text-xs truncate uppercase'>{student.name}</p>
                    <p className='text-[9px] text-slate-400 font-mono'>{student.rollNumber}</p>
                  </div>
                </div>
                <div className='text-right shrink-0'>
                   <p className='text-[10px] font-black text-slate-700 uppercase'>{student.gender}</p>
                </div>
              </div>
            )) : (
              <p className='text-center py-10 text-slate-400 italic text-xs'>Ma jiro xog cusub</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard