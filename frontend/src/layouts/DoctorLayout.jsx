import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Bell, User, Calendar, FileText, Home, LogOut,
  Pill, Menu, X, Users, Settings, Search, ChevronDown, CheckCircle,
  HelpCircle, MessageCircle, Microscope, Phone, Mail, MapPin, ShieldAlert, Headphones,
  FlaskConical, FileCode, FileCheck2
} from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

export default function DoctorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const profileRef = useRef(null);

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

  const [userData, setUserData] = useState({
    name: 'Dr. Ritik',
    fullName: 'Dr. Ritik Pandey',
    initials: 'RP',
    specialty: 'General Physician',
    degree: 'MD (Medicine)',
    _id: null
  });

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo.name) {
        const isLabTech = userInfo.role === 'lab_technician';

        let cleanName = userInfo.name;
        if (isLabTech) {
          cleanName = cleanName.replace(/^Dr\.\s*/i, '');
        } else if (!cleanName.startsWith('Dr.')) {
          cleanName = `Dr. ${cleanName}`;
        }

        const shortName = cleanName.split(' ').slice(0, 2).join(' ');

        const names = cleanName.replace(/^Dr\.\s*/i, '').split(' ');
        const firstName = names[0] || '';
        const lastName = names.length > 1 ? names[names.length - 1] : '';
        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || (isLabTech ? 'LT' : 'DR');

        setUserData({
          name: shortName,
          fullName: cleanName,
          initials: initials,
          specialty: isLabTech ? 'Lab Technician' : (userInfo.specialty || 'General Physician'),
          degree: isLabTech ? 'Pathology Dept' : 'MD (Medicine)',
          _id: userInfo._id
        });
      }
    } catch (error) {
      console.error("Could not parse userInfo", error);
    }
  }, []);

  // Fetch Live Notifications for Doctor and Lab Technician
  const fetchLiveNotifications = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo.role === 'lab_technician') {
        const { data: patients } = await axios.get('http://localhost:5000/api/users/patients');
        const notifList = [];
        (patients || []).forEach(p => {
          if (p.clinicalRecord?.labTests && p.clinicalRecord.labTests.length > 0) {
            p.clinicalRecord.labTests.forEach((t, idx) => {
              const isCompleted = t.includes('###PDF_DATA###') || t.includes('- (');
              const cleanName = t
                .split('###PDF_DATA###')[0]
                .split('(Attached')[0]
                .split('- (Report Uploaded')[0]
                .split('- (')[0]
                .trim();

              const notifId = `NOTIF-${p._id}-${idx}`;
              notifList.push({
                _id: notifId,
                title: `New Lab Test Prescribed`,
                description: `Dr. assigned ${cleanName || 'Lab Test'} for ${p.name}`,
                patientName: p.name,
                testName: cleanName,
                isCompleted,
                time: p.createdAt || p.updatedAt || new Date(),
                path: '/doctor/lab-requests'
              });
            });
          }
        });

        // Uncompleted pending lab tests at top, newest first
        notifList.sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
          return new Date(b.time) - new Date(a.time);
        });

        setNotifications(notifList);
      } else if (userInfo._id) {
        const { data } = await axios.get(`http://localhost:5000/api/appointments/doctor/${userInfo._id}/dashboard`);
        if (data.recentActivity) {
          setNotifications(data.recentActivity.map(a => ({
            _id: a._id,
            title: `Appointment Update`,
            description: `${a.patient ? a.patient.name : 'Patient'} ${a.status === 'Completed' ? 'completed consultation' : `booked ${a.type || 'Appointment'}`}`,
            time: a.updatedAt || a.date,
            path: '/doctor/appointments'
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 10000); // Poll every 10s for real-time doctor assignments
    return () => clearInterval(interval);
  }, []);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isLabTech = userInfo.role === 'lab_technician';

  // Grouped Navigation matching reference screenshot
  const portalLinks = isLabTech ? [
    { name: 'Dashboard', path: '/lab/dashboard', icon: Home },
    { name: 'Lab Requests', path: '/lab/requests', icon: Microscope },
    { name: 'Samples', path: '/lab/samples', icon: FlaskConical },
    { name: 'Tests', path: '/lab/tests', icon: FileCode },
    { name: 'Results', path: '/lab/results', icon: FileCheck2 },
  ] : [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: Home },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'My Patients', path: '/doctor/patients', icon: Users },
    { name: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
    { name: 'Medical Reports', path: '/doctor/reports', icon: FileText },
    { name: 'Lab Requests', path: '/doctor/reports', icon: Microscope },
  ];

  const communicationLinks = [
    { name: 'Messages', path: '/doctor/messages', icon: MessageCircle, badge: 3 },
  ];

  const systemLinks = [
    { name: 'Settings', path: '/doctor/settings', icon: Settings },
    { name: 'Help & Support', path: '/doctor/support', icon: HelpCircle },
  ];

  // Formatted date & day of week for header
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedDay = today.toLocaleDateString('en-US', { weekday: 'long' });

  const unreadCount = notifications.filter(n => !readNotifications.has(n._id)).length;

  const handleMarkAllRead = () => {
    const allIds = new Set(notifications.map(n => n._id || Math.random().toString()));
    setReadNotifications(allIds);
  };

  const renderNavLink = (item) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const isHelpSupport = item.name === 'Help & Support';

    return (
      <Link
        key={item.name}
        to={item.path}
        onClick={(e) => {
          if (isHelpSupport) {
            e.preventDefault();
            setShowSupportModal(true);
          }
          setIsSidebarOpen(false);
        }}
        className={cn(
          "flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 relative group",
          isActive 
            ? "bg-slate-100/90 text-[#0f6c4f]" 
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <div className="flex items-center gap-3">
          {isActive && (
            <div className="absolute -left-3.5 w-1.5 h-5.5 bg-[#0f6c4f] rounded-r-full" />
          )}
          <Icon className={cn("h-4.5 w-4.5", isActive ? "text-[#0f6c4f]" : "text-slate-400 group-hover:text-slate-600")} />
          <span className="font-bold">{item.name}</span>
        </div>

        {item.badge && (
          <span className="h-5 w-5 rounded-full bg-[#0f6c4f] text-white font-extrabold text-[10px] flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-100 px-4 py-4 overflow-y-auto no-scrollbar">
      <div className="space-y-4">
        
        {/* Logo Section (Top Left) */}
        <div className="h-16 flex items-center px-2 border-b border-slate-100 shrink-0">
          <Link to={isLabTech ? "/lab/dashboard" : "/doctor/dashboard"} className="flex items-center gap-2">
            <img src="/applogo.png" alt="Logo" className="h-9 w-9 object-contain shrink-0" />
            <div>
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#16a34a] bg-clip-text text-transparent leading-none block">
                Medisphere
              </span>
              <span className="text-[8.5px] uppercase tracking-wider font-bold text-slate-400 block mt-0.5">
                Hospital & Research
              </span>
            </div>
          </Link>
        </div>

        {/* Group 1: DOCTOR PORTAL */}
        <div className="space-y-1">
          <p className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            {isLabTech ? 'LAB PORTAL' : 'DOCTOR PORTAL'}
          </p>
          <nav className="space-y-0.5">
            {portalLinks.map(renderNavLink)}
          </nav>
        </div>

        {/* Group 2: COMMUNICATION */}
        <div className="space-y-1 pt-1">
          <p className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            COMMUNICATION
          </p>
          <nav className="space-y-0.5">
            {communicationLinks.map(renderNavLink)}
          </nav>
        </div>

        {/* Group 3: SYSTEM */}
        <div className="space-y-1 pt-1">
          <p className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            SYSTEM
          </p>
          <nav className="space-y-0.5">
            {systemLinks.map(renderNavLink)}
          </nav>
        </div>

      </div>

      {/* Bottom Doctor Profile Card & Log Out */}
      <div className="pt-3.5 border-t border-slate-100 space-y-3">
        
        {/* Doctor Info Block */}
        <div className="flex items-center gap-3 px-1">
          <div className="relative shrink-0">
            <img
              src="/Doctor/doctorsvg.png"
              alt="Doctor Avatar"
              className="h-10 w-10 rounded-full bg-emerald-50 object-cover border border-emerald-200 shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="min-w-0 leading-tight">
            <h4 className="text-xs font-bold text-slate-900 truncate">{userData.fullName}</h4>
            <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{userData.specialty}</p>
            <p className="text-[9.5px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
            </p>
          </div>
        </div>

        {/* Outline Log out Button */}
        <button 
          onClick={() => {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
        >
          <LogOut className="h-4 w-4 text-slate-500" /> Log out
        </button>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col border-r border-slate-200/80 bg-white shadow-2xs">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* TOP NAVBAR (Exact match to reference screenshot) */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-8 shadow-2xs">
          
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {[
                  { name: 'Dashboard', path: isLabTech ? '/lab/dashboard' : '/doctor/dashboard' },
                  { name: 'Lab Requests', path: '/lab/requests' },
                  { name: 'Samples', path: '/lab/samples' },
                  { name: 'Tests', path: '/lab/tests' },
                  { name: 'Results', path: '/lab/results' },
                  { name: 'Appointments', path: '/doctor/appointments' },
                  { name: 'My Patients', path: '/doctor/patients' },
                  { name: 'Prescriptions', path: '/doctor/prescriptions' },
                  { name: 'Medical Reports', path: '/doctor/reports' },
                  { name: 'Messages', path: '/doctor/messages' },
                  { name: 'Settings', path: '/doctor/settings' },
                  { name: 'Help & Support', path: '/doctor/support' }
                ].find(l => location.pathname === l.path || location.pathname.startsWith(l.path + '/'))?.name || (isLabTech ? 'Lab Portal' : 'Doctor Portal')}
              </h1>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center relative w-72 lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-16 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/30 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs pointer-events-none">
              Ctrl + K
            </span>
          </div>

          {/* Right Header Controls: Date Box | Notifications | Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Date & Day Info Box */}
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
              <div className="text-left leading-tight">
                <span className="font-bold text-slate-800 block text-[11px]">{formattedDate}</span>
                <span className="text-[10px] font-semibold text-slate-400 block">{formattedDay}</span>
              </div>
            </div>

            {/* Notification Bell Icon */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center border-2 border-white shadow-2xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Popup */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-800 text-xs">System Notifications</h3>
                      {unreadCount > 0 ? (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-[#0f6c4f] font-bold hover:underline"
                        >
                          Mark all read
                        </button>
                      ) : (
                        <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                          0 New
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {notifications.length > 0 ? (
                        notifications.map((notif, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              if (notif.path) navigate(notif.path);
                              setShowNotifications(false);
                            }}
                            className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3"
                          >
                            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-[#0f6c4f] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100 shadow-2xs">
                              <Microscope className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 text-xs">
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-snug">
                                {notif.description || (notif.patient ? notif.patient.name : 'Patient')}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400">No new notifications.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Doctor Profile Dropdown Header Pill */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100/80 transition-all border border-slate-200/80 bg-slate-50/50"
              >
                <img
                  src="/Doctor/doctorsvg.png"
                  alt="Doctor Avatar"
                  className="h-8 w-8 rounded-full bg-emerald-50 object-cover border border-emerald-200 shrink-0"
                />
                <span className="hidden sm:inline-block font-bold text-xs text-slate-800">
                  {userData.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
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
                      to="/doctor/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" /> Settings
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
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Contact Admin Support Modal Popup */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 to-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#0f6c4f] text-white flex items-center justify-center font-bold shadow-xs">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Help & Support</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Hospital Administrative Desk</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 text-[#0f6c4f] text-center space-y-1">
                  <ShieldAlert className="h-6 w-6 mx-auto text-[#0f6c4f]" />
                  <h4 className="font-extrabold text-xs">Need Help or System Access?</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    For password resets, permissions, or system issues, please reach out to the Hospital Admin directly.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      <Phone className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Contact Admin Line</p>
                      <p className="text-slate-500 font-semibold text-[11px] mt-0.5">+91 98765 43210 / Ext: 101</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Admin Email Support</p>
                      <p className="text-slate-500 font-semibold text-[11px] mt-0.5">admin@medisphere.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 text-[#0f6c4f] flex items-center justify-center font-bold shrink-0">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Admin Office Location</p>
                      <p className="text-slate-500 font-semibold text-[11px] mt-0.5">Admin Block, Room 01, Ground Floor</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setShowSupportModal(false)}
                    className="w-full bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold h-10 rounded-xl"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
