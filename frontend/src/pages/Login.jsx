import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react' // ShieldCheck waan ka saarnay maadaama sawir loo beddelay
import logo from '../assets/logo.jpeg' // Halkan ayaan ku soo darnay sawirkaaga

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { backendUrl, setToken, setUserData } = useContext(AppContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })

            if (data.success) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                
                setToken(data.token)
                setUserData(data.user)

                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Xiriirka Backend-ka waa uu xumaaday")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 font-sans overflow-hidden relative">
            
            <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>

            <div className="w-full max-w-md z-10">
                {/* Logo & Welcome Text */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-blue-100 mb-4 transform hover:rotate-12 transition-transform duration-300 overflow-hidden border-4 border-white">
                        {/* HALKAN AYAA LAGU BEDDELAY SAWIRKAAGA */}
                        <img src={logo} alt="SmartSchool Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Al-minhaj<span className="text-blue-600 font-black">School</span></h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Casri Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="tusaale@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className={`w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Geli Nidaamka <LogIn size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            Kaliya dadka loo ogolyahay ayaa geli kara nidaamka.
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
                    &copy; 2026 Powered by CASRI MS
                </p>
            </div>
        </div>
    )
}

export default Login