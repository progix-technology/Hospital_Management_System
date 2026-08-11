import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Bell, User, Calendar, FileText, Home, LogOut,
  HeartPulse, Pill, CreditCard, ShieldCheck, LifeBuoy, Menu, X, PhoneCall, ChevronDown, Search, Settings, Phone
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [userData, setUserData] = useState({
    name: 'Patient',
    initials: 'P',
    _id: null
  });

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo.name) {
        const names = userInfo.name.split(' ');
        const firstName = names[0] || '';
        const lastName = names.length > 1 ? names[names.length - 1] : '';
        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'P';

        setUserData({
          name: userInfo.name,
          initials: initials !== 'P' ? initials : 'P',
          _id: userInfo._id
        });

        // Fetch patient notifications
        if (userInfo._id) {
          Promise.all([
            axios.get(`http://localhost:5000/api/appointments/patient/${userInfo._id}`).catch(() => ({ data: [] })),
            axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`).catch(() => ({ data: {} }))
          ]).then(([{ data: appointments }, { data: profile }]) => {
              const notifs = [];

              if (Array.isArray(appointments)) {
                appointments.forEach(apt => {
                  const docName = apt.doctor ? apt.doctor.name : 'Doctor';
                  let message = `Appointment scheduled with ${docName} on ${new Date(apt.date).toLocaleDateString()}`;
                  if (apt.status === 'Completed') message = `Consultation completed with ${docName}`;
                  if (apt.status === 'Cancelled') message = `Appointment with ${docName} was cancelled`;
                  notifs.push({
                    message,
                    time: new Date(apt.updatedAt || Date.now()).toLocaleString()
                  });
                });
              }

              if (profile?.clinicalRecord?.labTests) {
                profile.clinicalRecord.labTests.forEach(test => {
                  if (typeof test === 'string' && test.includes('###PDF_DATA###')) {
                    const testName = test.split('###PDF_DATA###')[0].split('(Attached')[0].trim();
                    notifs.push({
                      message: `🔬 Lab test report for "${testName}" has been uploaded by the Lab Technician.`,
                      time: new Date(profile.vitals?.lastUpdated || Date.now()).toLocaleString()
                    });
                  }
                });
              }

              const clearedMap = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
              const activeNotifs = notifs.filter(n => !clearedMap.includes(n.id || n.message));
              
              activeNotifs.sort((a, b) => new Date(b.time) - new Date(a.time));
              setNotifications(activeNotifs);
            })
            .catch(err => console.error("Error fetching notifications", err));
        }
      }
    } catch (error) {
      console.error("Could not parse userInfo", error);
    }
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/portal', icon: Home },
    { name: 'Health Metrics', path: '/portal/health', icon: HeartPulse },
    { name: 'Appointments', path: '/portal/appointments', icon: Calendar },
    { name: 'Medical Records', path: '/portal/records', icon: FileText },
    { name: 'Prescriptions', path: '/portal/prescriptions', icon: Pill },
    { name: 'Billing & Payments', path: '/portal/billing', icon: CreditCard },
    { name: 'Insurance', path: '/portal/insurance', icon: ShieldCheck },
    { name: 'Support', path: '/portal/support', icon: LifeBuoy },
    { name: 'Settings', path: '/portal/settings', icon: User },
  ];

  // Formatted date for top navbar
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedDay = today.toLocaleDateString('en-US', { weekday: 'long' });

  const currentPageName = navLinks.find(l => l.path === location.pathname)?.name || 'Patient Portal';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64 shadow-2xs">
      {/* Sidebar Header Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#0f6c4f] text-white flex items-center justify-center font-bold shadow-xs">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base leading-none tracking-tight text-slate-900">Medisphere</span>
            <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Patient Healthcare</span>
          </div>
        </Link>
      </div>

      {/* Nav Links Container */}
      <div className="flex-1 overflow-y-auto py-4 px-3.5 space-y-1 no-scrollbar">
        <p className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          PATIENT PORTAL
        </p>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 relative group",
                isActive
                  ? "bg-slate-100/90 text-[#0f6c4f]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                <div className="absolute -left-3.5 w-1.5 h-5.5 bg-[#0f6c4f] rounded-r-full" />
              )}
              <Icon className={cn("h-4.5 w-4.5", isActive ? "text-[#0f6c4f]" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="font-bold">{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Nurse "Need Help?" Board */}
      <div className="px-3.5 pb-2">
        <div className="bg-[#f2f7f5] border border-emerald-100 rounded-2xl p-3.5 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-[#e3efea] rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative border border-emerald-200/60 shadow-2xs">
              <img src="/patient/nurse.png" alt="Support Nurse" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-[#0a2e23] text-xs leading-none mb-1">Need Help?</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-snug">Contact support for quick assistance.</p>
            </div>
          </div>
          <Link to="/portal/support" className="w-full">
            <Button className="w-full bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold py-2 h-auto border-0 shadow-xs">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors bg-white"
        >
          <LogOut className="h-4 w-4 text-slate-500" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 flex">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">

        {/* ULTRA-PROFESSIONAL TOP NAVBAR */}
        <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white shadow-2xs h-16 flex items-center">
          <div className="px-4 sm:px-8 w-full flex items-center justify-between gap-4">

            {/* Left: Mobile Toggle & Dynamic Page Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentPageName}
                </h1>
              </div>
            </div>

            {/* Center Search Input Bar */}
            <div className="hidden md:flex items-center relative w-72 lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors, appointments, records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-16 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/30 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs pointer-events-none">
                Ctrl + K
              </span>
            </div>

            {/* Right Header Controls: SOS Button | Date Box | Notifications | Profile Pill */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* SOS Emergency Call Button */}
              <button
                onClick={() => setShowSosModal(true)}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-red-500/20 transition-all hover:scale-105 shrink-0"
              >
                <PhoneCall className="h-3.5 w-3.5 animate-pulse" />
                <span>SOS Emergency</span>
              </button>
              
              {/* Date & Day Info Box */}
              <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                <div className="text-left leading-tight">
                  <span className="font-bold text-slate-800 block text-[11px]">{formattedDate}</span>
                  <span className="text-[10px] font-semibold text-slate-400 block">{formattedDay}</span>
                </div>
              </div>

              {/* Notifications Bell Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                  className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors relative"
                >
                  <Bell className="h-4.5 w-4.5 text-slate-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center border-2 border-white shadow-2xs">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Popup */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 text-xs">Patient Notifications</h3>
                        <span className="text-[10px] bg-[#0f6c4f]/10 text-[#0f6c4f] px-2 py-0.5 rounded-full font-bold">
                          {notifications.length} New
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 text-xs">
                        {notifications.length > 0 ? (
                          notifications.map((notif, idx) => (
                            <div key={idx} className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left">
                              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {notif.time}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No new notifications.
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
                        <button 
                          className="text-xs text-[#0f6c4f] font-bold hover:underline" 
                          onClick={() => {
                            const clearedMap = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
                            notifications.forEach(n => {
                              if (!clearedMap.includes(n.id || n.message)) {
                                clearedMap.push(n.id || n.message);
                              }
                            });
                            localStorage.setItem('clearedNotifications', JSON.stringify(clearedMap));
                            setNotifications([]);
                            setShowNotifications(false);
                          }}
                        >
                          Clear all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Patient Profile Dropdown Header Pill */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100/80 transition-all border border-slate-200/80 bg-slate-50/50"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-[#0f6c4f] flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                    {userData.initials}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-none text-left">
                    <span className="text-xs font-bold text-slate-900">{userData.name}</span>
                    <span className="text-[9.5px] font-semibold text-slate-400 mt-0.5">Patient</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Menu Popup */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-1.5 text-xs font-semibold"
                    >
                      <Link
                        to="/portal/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-slate-400" /> Account Settings
                      </Link>
                      <Link
                        to="/portal/support"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LifeBuoy className="h-4 w-4 text-slate-400" /> Help & Support
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('userInfo');
                          window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4 text-red-500" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>

      </div>

      {/* SOS Emergency Modal */}
      <AnimatePresence>
        {showSosModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 text-center"
            >
              <div className="p-6 bg-gradient-to-b from-red-500 to-rose-600 text-white space-y-2 relative">
                <button
                  onClick={() => setShowSosModal(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="h-14 w-14 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto shadow-inner">
                  <PhoneCall className="h-7 w-7 animate-bounce" />
                </div>
                <h3 className="font-black text-xl">Emergency SOS Support</h3>
                <p className="text-xs text-red-100 font-medium">Medisphere 24/7 Hospital Ambulance & Emergency Line</p>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2">
                  <p className="font-bold text-slate-800 text-sm">Ambulance & Trauma Center</p>
                  <p className="text-slate-600 text-xs font-semibold">Toll-Free Helpline: <strong className="text-red-600 text-sm">108 / +91 98765 00000</strong></p>
                  <p className="text-slate-400 text-[10px]">Hospital ER Room 01 • Available 24 Hours</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href="tel:108"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold h-11 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 text-xs"
                  >
                    <Phone className="h-4 w-4" /> Call 108 Emergency Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
