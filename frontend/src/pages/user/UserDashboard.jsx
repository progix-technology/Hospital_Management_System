import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { 
  Calendar, FileText, Activity, 
  HeartPulse, ShieldCheck,
  Video, Clock, MapPin, ArrowUpRight, ChevronRight, Droplets, Scale, Pill, Bell
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

export default function UserDashboard() {
  const [userName, setUserName] = React.useState('Patient');
  const [vitals, setVitals] = React.useState({
    bloodPressure: '--/--',
    heartRate: '--',
    weight: '--',
    sugarLevel: '--'
  });
  const [upcomingApt, setUpcomingApt] = React.useState(null);

  const [prescriptions, setPrescriptions] = React.useState([]);

  React.useEffect(() => {
    const fetchProfileAndAppointments = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.name) {
          const firstName = userInfo.name.split(' ')[0];
          setUserName(firstName);
          
          if (userInfo._id) {
            // Fetch profile and vitals
            const { data: profileData } = await axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`);
            if (profileData.vitals) {
              setVitals(profileData.vitals);
            }
            if (profileData.clinicalRecord?.prescriptions) {
              setPrescriptions(profileData.clinicalRecord.prescriptions);
            }

            // Fetch appointments to find the closest upcoming one
            const { data: aptData } = await axios.get(`http://localhost:5000/api/appointments/patient/${userInfo._id}`);
            if (Array.isArray(aptData)) {
              // Filter for future scheduled/waiting/in-progress appointments
              const now = new Date();
              now.setHours(0,0,0,0);
              
              const active = aptData
                .filter(apt => {
                  if (apt.status === 'Completed' || apt.status === 'Cancelled') return false;
                  const aptDate = new Date(apt.date);
                  aptDate.setHours(0,0,0,0);
                  return aptDate >= now;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date));

              if (active.length > 0) {
                setUpcomingApt(active[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Could not fetch user dashboard data", error);
      }
    };
    fetchProfileAndAppointments();
  }, []);

  const heartRateData = [
    { time: '12 AM', value: 65 }, { time: '6 AM', value: 68 },
    { time: '12 PM', value: 82 }, { time: '6 PM', value: 72 },
    { time: '12 AM', value: 68 }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-10">
      
      {/* Top Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          Good morning, {userName}! <span className="text-xl">👋</span>
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Here's your health overview for today</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Content (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="relative z-10 max-w-sm mb-6 sm:mb-0">
              <h2 className="text-2xl font-bold text-[#0f6c4f] mb-3">Welcome back, {userName}!</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                You have 1 upcoming appointment tomorrow and 2 active prescriptions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/portal/appointments">
                  <Button className="bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-lg shadow-sm font-medium border-0">
                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                  </Button>
                </Link>
                <Link to="/portal/records">
                  <Button variant="outline" className="bg-white text-[#0f6c4f] border-slate-200 hover:bg-slate-50 rounded-lg font-medium">
                    <FileText className="mr-2 h-4 w-4" /> View Medical Records
                  </Button>
                </Link>
              </div>
            </div>
            {/* Illustration Placeholder */}
            <div className="hidden sm:flex absolute right-0 bottom-0 top-0 w-1/2 justify-end items-end pr-2">
              <img src="/patient/patient.png" alt="Patient Welcome" className="h-56 sm:h-64 lg:h-72 object-contain object-bottom translate-y-5" />
            </div>
          </div>

          {/* Upcoming Appointment */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Upcoming Appointment</h3>
              <Link to="/portal/appointments" className="text-sm font-semibold text-[#0f6c4f] hover:underline">View All</Link>
            </div>
            
            {upcomingApt ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex flex-col items-center justify-center h-24 w-24 rounded-xl bg-[#f0f9f5] text-emerald-800 text-center shrink-0">
                  <span className="text-xs uppercase font-bold tracking-wider">
                    {new Date(upcomingApt.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="font-bold text-3xl leading-none my-0.5">
                    {new Date(upcomingApt.date).getDate()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600/80">
                    {new Date(upcomingApt.date).toLocaleString('default', { weekday: 'short' })}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase text-[#0f6c4f] bg-[#f0f9f5] border-transparent font-bold tracking-wider rounded-md px-2 py-0.5">
                      {new Date(upcomingApt.date).toDateString() === new Date().toDateString() ? 'Today' : 'Upcoming'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 mb-2">{upcomingApt.type} Checkup</h4>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    <div className="flex items-center text-slate-600">
                      <div className="h-6 w-6 rounded-full overflow-hidden mr-2 border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">
                        {upcomingApt.doctor?.name ? upcomingApt.doctor.name.charAt(0) : 'D'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {upcomingApt.doctor?.name ? `Dr. ${upcomingApt.doctor.name}` : 'Doctor Assigned'}
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          {upcomingApt.doctor?.specialty || 'General Physician'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-slate-600 font-medium">
                      <Clock className="h-4 w-4 mr-1.5" /> {upcomingApt.timeSlot}
                    </div>
                    <div className="flex items-center text-slate-600 font-medium">
                       <MapPin className="h-4 w-4 mr-1.5" /> Room 402, Main Wing
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                  <Link to="/portal/appointments" className="w-full">
                    <Button className="w-full sm:w-32 bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-lg shadow-sm font-medium flex items-center justify-center gap-1.5">
                      <FileText className="h-4 w-4" /> View Slip
                    </Button>
                  </Link>
                  <Link to="/portal/appointments" className="w-full">
                    <Button variant="outline" className="w-full sm:w-32 rounded-lg text-slate-600 border-slate-200 hover:bg-slate-50 font-medium">Reschedule</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">
                No upcoming appointments. Need a checkup?{' '}
                <Link to="/portal/appointments" className="text-[#0f6c4f] font-semibold hover:underline">
                  Book one now
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* BP */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 w-full mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <span className="font-bold text-lg text-slate-800 block leading-tight">{vitals.bloodPressure}</span>
                  <span className="text-[10px] font-medium text-slate-500">mmHg</span>
                </div>
              </div>
              <div className="w-full text-center bg-blue-50/50 text-blue-600 text-xs font-semibold py-1 rounded-md">
                Blood Pressure
              </div>
            </div>
            
            {/* HR */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 w-full mb-3">
                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <HeartPulse className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <span className="font-bold text-lg text-slate-800 block leading-tight">{vitals.heartRate} <span className="text-xs text-slate-500 font-medium font-normal">bpm</span></span>
                  <span className="text-[10px] font-medium text-slate-500">Resting Heart Rate</span>
                </div>
              </div>
              <div className="w-full text-center bg-red-50/50 text-red-600 text-xs font-semibold py-1 rounded-md">
                Heart Rate
              </div>
            </div>
            
            {/* Sugar */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 w-full mb-3">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Droplets className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <span className="font-bold text-lg text-slate-800 block leading-tight">{vitals.sugarLevel}</span>
                  <span className="text-[10px] font-medium text-slate-500">Fasting Sugar</span>
                </div>
              </div>
              <div className="w-full text-center bg-purple-50/50 text-purple-600 text-xs font-semibold py-1 rounded-md">
                Sugar Level
              </div>
            </div>
            
            {/* Weight */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 w-full mb-3">
                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Scale className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <span className="font-bold text-lg text-slate-800 block leading-tight">{vitals.weight}</span>
                  <span className="text-[10px] font-medium text-slate-500">Weight</span>
                </div>
              </div>
              <div className="w-full text-center bg-orange-50/50 text-orange-600 text-xs font-semibold py-1 rounded-md">
                Body Weight
              </div>
            </div>
            
          </div>

          {/* Health Tips Banner */}
          <div className="bg-[#f0f9f5] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="h-16 w-16 flex items-center justify-center shrink-0">
                {/* Insert Shield/Clipboard Image Here */}
                <ShieldCheck className="h-10 w-10 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-[#0f6c4f] text-base">Stay on top of your health</h4>
                <p className="text-emerald-700/80 text-xs max-w-md mt-1">Regular check-ups and a healthy lifestyle can help you live a happier and healthier life.</p>
              </div>
            </div>
            <Button variant="outline" className="bg-transparent border-[#0f6c4f]/30 text-[#0f6c4f] hover:bg-emerald-50 rounded-lg text-sm font-medium whitespace-nowrap">
              Explore Health Tips <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          
          {/* Heart Rate Chart */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-800">Heart Rate</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#0f6c4f]">72</span>
                  <span className="text-sm font-semibold text-slate-800">bpm</span>
                </div>
                <div className="mt-1 flex items-center text-emerald-600 text-xs font-semibold">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> Resting HR is normal
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <HeartPulse className="h-4 w-4 text-red-500" />
              </div>
            </div>
            
            <div className="h-32 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={heartRateData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} orientation="right" domain={[40, 100]} ticks={[40, 60, 80, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Prescriptions</h3>
              <Link to="/portal/prescriptions" className="text-sm font-semibold text-[#0f6c4f] hover:underline">View All</Link>
            </div>
            
            <div className="space-y-3">
              {prescriptions.length > 0 ? (
                <>
                  {prescriptions.slice(0, 2).map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <Pill className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{med.medicineName || med.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{med.dosage} • {med.frequency}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Active</span>
                    </div>
                  ))}
                  
                  {/* Alert Box */}
                  <div className="mt-2 p-3 rounded-xl bg-[#f0f9f5] flex items-center gap-3">
                    <Bell className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-[#0f6c4f]">{prescriptions.length} prescriptions are active</h5>
                      <p className="text-[10px] text-emerald-700/80">Don't forget to take your medicines</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-emerald-600 opacity-60" />
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No active prescriptions on file.
                </div>
              )}
            </div>
          </div>

          {/* Health Insurance */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Health Insurance</h3>
              <Link to="/portal/insurance" className="text-sm font-semibold text-[#0f6c4f] hover:underline">View Details</Link>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-100 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Star Health Insurance</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Policy No. 1234 5678 9012</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Valid till 31 Dec, 2025</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
