import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const AddStudent = () => {
    // Waxaan ku darnay 'token' halkan
    const { backendUrl, getStudents, subjects, students, token } = useContext(AppContext)
    const navigate = useNavigate()
    const { id } = useParams()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        responsibleName: '',
        responsiblePhone: '',
        gender: 'Male',
        subjects: [],
        discount: 0
    })

    const getSubTotal = () => {
        const selected = subjects.filter(sub => formData.subjects.includes(sub._id));
        return selected.reduce((sum, sub) => sum + sub.price, 0);
    }

    const subTotal = getSubTotal();
    const finalAmount = subTotal - formData.discount;

    useEffect(() => {
        if (id && students && students.length > 0) {
            const student = students.find(s => s._id === id);
            if (student) {
                setFormData({
                    name: student.name,
                    rollNumber: student.rollNumber,
                    responsibleName: student.responsibleName,
                    responsiblePhone: student.responsiblePhone,
                    gender: student.gender || 'Male',
                    subjects: student.subjects.map(s => (typeof s === 'object' ? s._id : s)),
                    discount: student.discount || 0
                });
            }
        }
    }, [id, students])

    const handleDiscountChange = (val) => {
        const value = Number(val);
        const currentSubTotal = getSubTotal();
        if (value < 0) {
            setFormData(prev => ({ ...prev, discount: 0 }));
        } else if (value > currentSubTotal) {
            setFormData(prev => ({ ...prev, discount: currentSubTotal }));
        } else {
            setFormData(prev => ({ ...prev, discount: value }));
        }
    }

    const handleSubjectChange = (subjectId) => {
        setFormData(prev => {
            const current = [...prev.subjects];
            const updatedSubjects = current.includes(subjectId) 
                ? current.filter(sid => sid !== subjectId) 
                : [...current, subjectId];
            return { ...prev, subjects: updatedSubjects };
        });
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (formData.subjects.length === 0) {
            return toast.warn("Fadlan ugu yaraan hal maaddo dooro!");
        }

        try {
            setLoading(true);
            const url = id ? `${backendUrl}/api/student/update/${id}` : `${backendUrl}/api/student/add`;
            const method = id ? 'put' : 'post';
            
            const dataToSend = { 
                ...formData,
                subjects: formData.subjects.map(s => typeof s === 'object' ? s._id : s)
            };

            if (!id) {
                delete dataToSend.rollNumber;
            }

            // Waxaan ku darnay { headers: { token } } si loogu gudbo Authuser middleware
            const { data } = await axios[method](url, dataToSend, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                await getStudents(); 
                navigate('/students');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Dhibka dhacay:", error.response?.data);
            const msg = error.response?.data?.message || "Khalad ayaa dhacay xilliga keydinta!";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 p-3 sm:p-6 lg:p-8'>
            <div className='mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl'>
                <div className='bg-blue-600 px-5 py-4 text-white sm:px-8'>
                    <h2 className='text-xl font-bold sm:text-2xl'>{id ? "Beddel Xogtii hore" : "Diiwaan-gelin Cusub"}</h2>
                    <p className='text-xs opacity-80 sm:text-sm'>Fadlan buuxi macluumaadka ardayga</p>
                </div>
                
                <form onSubmit={onSubmitHandler} className='p-5 sm:p-8'>
                    <div className='flex flex-col gap-8 lg:flex-row'>
                        <div className='flex-1 space-y-5'>
                            <h3 className='border-b pb-2 text-lg font-semibold text-gray-800'>Xogta Guud</h3>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold text-gray-600 sm:text-sm'>Magaca Ardayga</label>
                                    <input className='w-full rounded-xl border-2 border-gray-100 p-3 outline-none transition focus:border-blue-500' value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} placeholder="Magaca oo buuxa" required />
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold text-gray-600 sm:text-sm'>Roll Number</label>
                                    <input 
                                        className='w-full rounded-xl border-2 border-gray-100 p-3 outline-none bg-gray-50 cursor-not-allowed font-bold text-blue-600' 
                                        value={formData.rollNumber || (id ? "" : "Autogenerated")} 
                                        readOnly 
                                        placeholder="Auto-generated" 
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold text-gray-600 sm:text-sm'>Gender</label>
                                    <select 
                                        className='w-full rounded-xl border-2 border-gray-100 p-3 outline-none transition focus:border-blue-500 bg-white'
                                        value={formData.gender}
                                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                        required
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold text-gray-600 sm:text-sm'>Magaca Mas'uulka</label>
                                    <input className='w-full rounded-xl border-2 border-gray-100 p-3 outline-none transition focus:border-blue-500' value={formData.responsibleName} onChange={(e)=>setFormData({...formData, responsibleName:e.target.value})} placeholder="Magaca Waalidka" required />
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold text-gray-600 sm:text-sm'>Telefoonka</label>
                                    <input className='w-full rounded-xl border-2 border-gray-100 p-3 outline-none transition focus:border-blue-500' value={formData.responsiblePhone} onChange={(e)=>setFormData({...formData, responsiblePhone:e.target.value})} placeholder="061xxxxxxx" required />
                                </div>
                            </div>
                            <div className='rounded-xl border border-red-100 bg-red-50 p-4'>
                                <div className='flex items-center justify-between gap-4'>
                                    <span className='text-sm font-bold text-red-800'>Qiimo Dhimis ($):</span>
                                    <input type="number" className='w-24 rounded-lg border-2 border-white p-2 font-bold outline-none focus:border-red-300 sm:w-32' value={formData.discount} onChange={(e) => handleDiscountChange(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className='w-full lg:w-[350px]'>
                            <div className='rounded-2xl border border-gray-200 bg-gray-50 p-5'>
                                <h3 className='mb-4 border-b pb-2 font-bold text-gray-800'>Maaddooyinka</h3>
                                <div className='custom-scrollbar max-h-[250px] space-y-2 overflow-y-auto pr-1'>
                                    {subjects.map(sub => (
                                        <label key={sub._id} className='flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-white p-3 transition hover:border-blue-200'>
                                            <div className='flex items-center gap-3'>
                                                <input type="checkbox" className='h-5 w-5 rounded accent-blue-600' checked={formData.subjects.includes(sub._id)} onChange={() => handleSubjectChange(sub._id)} />
                                                <span className='text-sm font-medium text-gray-700'>{sub.name}</span>
                                            </div>
                                            <span className='text-sm font-bold text-blue-600'>${sub.price}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className='mt-6 space-y-2 border-t border-gray-200 pt-4'>
                                    <div className='flex justify-between text-sm text-gray-500'>
                                        <span>Wadarta Guud:</span>
                                        <span className='line-through'>${subTotal}</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='font-bold text-gray-700'>Bixinaya:</span>
                                        <span className='text-2xl font-black text-blue-700'>${finalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-10 flex flex-col gap-3 sm:flex-row'>
                        <button type='button' onClick={() => navigate('/students')} className='order-2 w-full rounded-xl bg-gray-100 py-4 font-bold text-gray-600 transition hover:bg-gray-200 sm:order-1 sm:w-1/3'>
                            Jooji
                        </button>
                        <button type='submit' disabled={loading} className='order-1 w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 active:scale-[0.98] sm:order-2 sm:flex-1 disabled:opacity-50'>
                            {loading ? "Waa la keydinayaa..." : (id ? "Update Student" : "Register Student")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddStudent;