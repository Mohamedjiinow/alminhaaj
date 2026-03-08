import React, { useContext } from 'react' // Ku dar useContext
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext' // Soo jiido Context-ka
import { 
  CheckCircle, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  ArrowRight,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

const LandingPage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext); // Ka soo saar userData

  // Function go'aaminaya halka qofka loo tuurayo
  const handleGetStarted = () => {
    if (userData?.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/attendance');
    }
  };

  return (
    <div className='bg-white font-sans text-slate-900'>
      
      {/* --- HERO SECTION --- */}
      <section className='relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-20 pb-32'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex-1 text-center lg:text-left'
            >
              <span className='inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6'>
                Nidaamka Maamulka Dugsiyada ee Mustaqbalka
              </span>
              <h1 className='text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6'>
                Ku maamul dugsigaaga <span className='text-blue-600'>hal gujin.</span>
              </h1>
              <p className='text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0'>
                CASRI MS waa nidaam dhammaystiran oo loogu talagalay in lagu casriyeeyo maamulka ardayda, diiwaangelinta, lacag bixinta, iyo xaadirinta. Degdeg, ammaan, iyo fududaan.
              </p>
              
              <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4'>
                <button 
                  onClick={handleGetStarted} // Halkan ayaan u yeernay function-ka cusub
                  className='bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95'
                >
                  {userData?.role === 'admin' ? 'Tag Dashboard' : 'Bilow Xaadirinta'} <ArrowRight size={20} />
                </button>
                
                <button className='bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all'>
                  Daawo Demo-ga
                </button>
              </div>
              
              {/* Role Indicator - Si qofku u ogaado heerka uu ka joogo nidaamka */}
              <p className='mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest'>
                Waxaad ku soo gashay: <span className='text-blue-500'>{userData?.role}</span>
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex-1 relative'
            >
              <div className='relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white'>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                  alt="Dashboard Preview" 
                  className='w-full object-cover'
                />
              </div>
              <div className='absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl z-20 hidden md:block border border-blue-50'>
                <div className='flex items-center gap-4'>
                  <div className='bg-green-100 p-3 rounded-2xl text-green-600'>
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <p className='text-xs text-slate-400 font-bold uppercase'>Dakhliga Bishan</p>
                    <p className='text-xl font-black text-slate-800'>$12,450.00</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className='py-24 bg-white'>
        <div className='container mx-auto px-6 text-center mb-16'>
          <h2 className='text-3xl lg:text-5xl font-black text-slate-900 mb-4'>Maxaa CASRI MS u gaar ah?</h2>
          <p className='text-slate-500'>Waxaan xallinnay caqabadihii maamulka si aad adigu diiradda u saarto baridda.</p>
        </div>

        <div className='container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <FeatureCard 
            icon={<Users className='text-blue-600' />} 
            title="Diiwaangelinta Ardayda" 
            desc="Si fudud u diiwaangeli ardayda adoo isticmaalaya nidaam casri ah oo otomaatig ah."
          />
          <FeatureCard 
            icon={<Smartphone className='text-purple-600' />} 
            title="Xaadirinta Digital-ka" 
            desc="Kula soco imaanshaha iyo maqnaanshaha ardayda taleefankaaga ama laptop-kaaga."
          />
          <FeatureCard 
            icon={<BarChart3 className='text-green-600' />} 
            title="Warbixinnada Lacagta" 
            desc="Arag dakhliga guud, dhimista, iyo hadhaaga adigoon u baahneyn xisaabiye."
          />
          <FeatureCard 
            icon={<ShieldCheck className='text-red-600' />} 
            title="Amni Sare" 
            desc="Xogtaada waa mid la ilaaliyay oo ku kaydsan daruurta (Cloud Storage) 24/7."
          />
          <FeatureCard 
            icon={<Zap className='text-yellow-600' />} 
            title="Xawaare Sare" 
            desc="Nidaamku waa mid u shaqeeya si degdeg ah xitaa haddii internet-ku daciif yahay."
          />
          <FeatureCard 
            icon={<Globe className='text-teal-600' />} 
            title="Laga heli karo meel walba" 
            desc="Ka gal nidaamka xafiiska, guriga ama safarka adigoo isticmaalaya qalab kasta."
          />
        </div>
      </section>

      {/* --- SHOWCASE SECTION --- */}
      <section className='py-24 bg-slate-900 text-white rounded-[3rem] mx-4 lg:mx-10 mb-20'>
        <div className='container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12'>
          <div className='flex-1'>
            <h2 className='text-4xl lg:text-5xl font-black mb-8 leading-tight'>
              Dhis nidaam waxbarasho oo casri ah maanta.
            </h2>
            <ul className='space-y-4'>
              <li className='flex items-center gap-3'>
                <CheckCircle className='text-green-400' size={24} />
                <span className='text-slate-300 font-medium'>Maamul maaddooyin aan xad lahayn</span>
              </li>
              <li className='flex items-center gap-3'>
                <CheckCircle className='text-green-400' size={24} />
                <span className='text-slate-300 font-medium'>Warbixinnada bilaha ah oo PDF ah</span>
              </li>
              <li className='flex items-center gap-3'>
                <CheckCircle className='text-green-400' size={24} />
                <span className='text-slate-300 font-medium'>Interface aad u fudud in la barto</span>
              </li>
            </ul>
          </div>
          <div className='flex-1 grid grid-cols-2 gap-4'>
             <div className='bg-white/10 p-8 rounded-3xl backdrop-blur-md text-center'>
                <h4 className='text-4xl font-black mb-2'>99%</h4>
                <p className='text-sm text-slate-400 uppercase font-bold tracking-widest'>Qanaacada</p>
             </div>
             <div className='bg-blue-600 p-8 rounded-3xl text-center'>
                <h4 className='text-4xl font-black mb-2'>24/7</h4>
                <p className='text-sm text-blue-100 uppercase font-bold tracking-widest'>Taageero</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className='py-12 border-t border-slate-100'>
        <div className='container mx-auto px-6 text-center text-slate-400'>
          <p className='font-bold text-slate-800 mb-2'>CASRI MS - Somalia</p>
          <p className='text-sm'>&copy; 2026 Dhamaan xuquuqda waa la dhowray.</p>
        </div>
      </footer>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className='p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all group'>
    <div className='mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform'>
      {icon}
    </div>
    <h3 className='text-xl font-black text-slate-800 mb-3'>{title}</h3>
    <p className='text-slate-500 text-sm leading-relaxed'>{desc}</p>
  </div>
)

export default LandingPage