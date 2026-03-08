import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Attendance = () => {
  // Waxaan soo bixinnay 'token' si aan ugu dirno backend-ka
  const { students, backendUrl, token } = useContext(AppContext)
  const todayStr = new Date().toISOString().split('T')[0]
  
  const [date, setDate] = useState(todayStr)
  const [attendanceData, setAttendanceData] = useState([]) 
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Mar walba oo Date-ka ama Students-ka isbeddelaan, soo qaad xogta cusub
  useEffect(() => {
    const isPast = date < todayStr;
    const isFuture = date > todayStr;
    setIsReadOnly(isPast || isFuture);
    
    if (date <= todayStr && token) {
      fetchAttendanceData();
    } else {
      setAttendanceData([]);
    }
  }, [date, students, token])

  // 1. Soo qaadashada Xogta (Fetching)
  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      // Waxaan ku darnay headers-ka token-ka si backend-ku u ogaado qofka codsanaya
      const { data } = await axios.get(`${backendUrl}/api/attendance/get?date=${date}`, {
        headers: { token }
      })
      
      if (data.success && data.data && data.data.length > 0) {
        const savedRecords = data.data;
        
        // Isku xirka (Merge) ardayda hadda jirta iyo xogta kaydsan ee taariikhdaas
        const mergedList = students.map(student => {
          const existing = savedRecords.find(r => r.studentId === student._id);
          if (existing) {
            return { 
              ...existing, 
              studentName: student.name, 
              rollNumber: student.rollNumber, 
              responsiblePhone: student.responsiblePhone 
            }; 
          } else {
            return {
              studentId: student._id,
              studentName: student.name,
              rollNumber: student.rollNumber,
              responsiblePhone: student.responsiblePhone || 'N/A',
              status: 'Present' 
            };
          }
        });
        setAttendanceData(mergedList);
      } else {
        // Haddii aan xog la helin (tusaale: maalin aan weli la xaadirin)
        prepareDefaultList();
      }
    } catch (error) {
      console.error("Cilad ayaa dhacday:", error);
      prepareDefaultList();
    } finally {
      setLoading(false)
    }
  }

  const prepareDefaultList = () => {
    if (students && students.length > 0) {
      const initial = students.map(s => ({
        studentId: s._id,
        studentName: s.name,
        rollNumber: s.rollNumber,
        responsiblePhone: s.responsiblePhone || 'N/A',
        status: 'Present',
        date: date
      }))
      setAttendanceData(initial)
    }
  }

  const handleStatusChange = (studentId, newStatus) => {
    if (isReadOnly) return
    setAttendanceData(prev => 
      prev.map(item => item.studentId === studentId ? { ...item, status: newStatus } : item)
    )
  }

  // 2. Kaydinta Xogta (Saving)
  const saveAttendance = async () => {
    try {
      const dataToSave = attendanceData.map(item => ({ ...item, date: date }));
      
      // Waxaan ku darnay token-ka qaybta Post-ka
      const { data } = await axios.post(`${backendUrl}/api/attendance/save`, 
        { attendanceData: dataToSave },
        { headers: { token } }
      )
      
      if (data.success) {
        toast.success(data.message)
        fetchAttendanceData(); // Mar kale soo refresh garee xogta
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Ma haysatid ogolaansho aad ku kaydiso!")
    }
  }

  const filteredStudents = attendanceData.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.rollNumber && item.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  })

  return (
    <div className='w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6 mb-10'>
      
      {/* Filters Section */}
      <div className='bg-white p-3 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-4'>
        <div className='flex flex-col gap-3 sm:gap-4'>
          <div className='flex flex-wrap justify-between items-center gap-2'>
            <h1 className='text-base sm:text-xl font-black text-gray-800 uppercase'>Xaadirinta</h1>
            <input 
              type="date" 
              max={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='bg-gray-50 p-2 rounded-lg border border-gray-100 text-[10px] sm:text-sm font-bold text-blue-600 outline-none w-full sm:w-auto cursor-pointer'
            />
          </div>

          <div className='flex gap-1 bg-gray-50 p-1 rounded-xl overflow-x-auto'>
            {['All', 'Present', 'Absent'].map((mode) => (
              <button
                key={mode}
                onClick={() => setStatusFilter(mode)}
                className={`flex-1 py-2 px-1 rounded-lg text-[9px] sm:text-[10px] font-black transition-all min-w-[60px] ${
                  statusFilter === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                }`}
              >
                {mode === 'All' ? 'DHAMMAAN' : mode === 'Present' ? 'JOOGA' : 'MAQAN'}
              </button>
            ))}
          </div>

          <div className='relative'>
            <input 
              type="text" 
              placeholder="Raadi arday..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs sm:text-sm'
            />
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='bg-gray-50 border-b border-gray-100 px-3 sm:px-4 py-3 flex flex-row items-center justify-between text-[9px] sm:text-xs font-black text-gray-500 uppercase tracking-widest'>
          <div className='flex gap-2 sm:gap-4 items-center flex-1'>
            <span className='w-10 sm:w-20 shrink-0'>ID</span>
            <span className='truncate'>Ardayga</span>
          </div>
          <span className='shrink-0 text-right'>Xaaladda</span>
        </div>

        {loading ? (
          <div className='p-12 text-center text-gray-400 text-xs animate-pulse font-bold uppercase tracking-widest'>Waa la soo racaayaa...</div>
        ) : (
          <div className='divide-y divide-gray-50'>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((item) => (
                <div key={item.studentId} className='px-3 sm:px-4 py-3 flex flex-row items-center justify-between gap-2 hover:bg-gray-50/40 transition-colors'>
                  <div className='flex flex-row items-center gap-2 sm:gap-4 flex-1 min-w-0'>
                    <span className='w-10 sm:w-20 shrink-0 font-mono font-bold text-[9px] sm:text-xs text-blue-600 truncate'>
                      {item.rollNumber ? item.rollNumber.replace('STD', '') : '??'}
                    </span>
                    <div className='flex flex-col min-w-0'>
                      <span className='font-bold text-gray-700 text-[11px] sm:text-base truncate uppercase leading-tight'>
                        {item.studentName}
                      </span>
                    </div>
                  </div>

                  <div className={`flex p-0.5 rounded-lg gap-0.5 sm:gap-1 shrink-0 ${isReadOnly ? 'opacity-50 pointer-events-none' : 'bg-gray-100'}`}>
                    <button 
                      onClick={() => handleStatusChange(item.studentId, 'Present')}
                      className={`w-7 h-7 sm:w-12 sm:h-10 rounded-md text-[10px] sm:text-xs font-black transition-all flex items-center justify-center ${
                        item.status === 'Present' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400'
                      }`}
                    >P</button>
                    <button 
                      onClick={() => handleStatusChange(item.studentId, 'Absent')}
                      className={`w-7 h-7 sm:w-12 sm:h-10 rounded-md text-[10px] sm:text-xs font-black transition-all flex items-center justify-center ${
                        item.status === 'Absent' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400'
                      }`}
                    >A</button>
                  </div>
                </div>
              ))
            ) : (
              <div className='p-10 text-center text-gray-400 text-[10px] sm:text-xs italic uppercase tracking-widest font-medium'>Lama helin xogta.</div>
            )}
          </div>
        )}

        {!isReadOnly && attendanceData.length > 0 && (
          <div className='p-3 sm:p-4 bg-gray-50 border-t border-gray-100'>
            <button 
              onClick={saveAttendance}
              className='w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-[10px] sm:text-sm uppercase tracking-tighter sm:tracking-widest shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all'
            >
              Kaydi Xaadirinta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Attendance