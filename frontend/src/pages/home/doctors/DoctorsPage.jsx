import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Star, Clock, ArrowRight, User, MapPin, Award, 
  Stethoscope, HeartPulse, UserCheck, ShieldCheck, Phone, Calendar,
  Building, CheckCircle2, Sparkles, Activity, Pill, Truck, ChevronDown, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Card, CardContent } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Badge } from '../../../components/Badge';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const deptDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target)) {
        setIsDeptOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = ['All', 'Doctor', 'Nursing Staff', 'Lab Technician', 'Pharmacist & EMT'];

  const departments = [
    'All',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Critical Care & ICU',
    'Pathology & Diagnostics',
    'Radiology & Imaging',
    'Pharmacy & Pharmacy Care',
    'Emergency & Ambulance'
  ];

  // Comprehensive Hospital Staff Directory (Doctors, Nurses, Technicians, Pharmacists, Paramedics)
  const staffDirectory = [
    // 1. Doctors
    {
      id: 'DOC-1',
      name: 'Dr. Sarah Smith',
      role: 'Doctor',
      roleBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roleIcon: Stethoscope,
      designation: 'Senior Consultant Cardiologist',
      dept: 'Cardiology',
      deptBadge: 'bg-red-50 text-red-700 border-red-200',
      qualification: 'MD, DM (Cardiology), FACC',
      exp: '15 Years',
      rating: 4.9,
      reviews: 124,
      availability: 'Mon - Fri • 09:00 AM - 02:00 PM',
      campus: 'Main Hospital, Cardiopulmonary Wing',
      phone: '+91 89532 08952',
      email: 'dr.smith@medisphere.com',
      avatarBg: 'bg-emerald-700'
    },
    {
      id: 'DOC-2',
      name: 'Dr. Michael Chen',
      role: 'Doctor',
      roleBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roleIcon: Stethoscope,
      designation: 'Chief Neurosurgeon',
      dept: 'Neurology',
      deptBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      qualification: 'MS, M.Ch (Neurosurgery)',
      exp: '12 Years',
      rating: 4.8,
      reviews: 98,
      availability: 'Mon - Sat • 10:00 AM - 04:00 PM',
      campus: 'Neuroscience Center, 3rd Floor',
      phone: '+91 89532 08952',
      email: 'dr.chen@medisphere.com',
      avatarBg: 'bg-blue-700'
    },
    {
      id: 'DOC-3',
      name: 'Dr. Emily Jones',
      role: 'Doctor',
      roleBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roleIcon: Stethoscope,
      designation: 'Senior Pediatrician & Neonatologist',
      dept: 'Pediatrics',
      deptBadge: 'bg-pink-50 text-pink-700 border-pink-200',
      qualification: 'MD (Pediatrics), DNB (Neonatology)',
      exp: '8 Years',
      rating: 4.9,
      reviews: 210,
      availability: 'Daily • 09:00 AM - 01:00 PM',
      campus: 'Children & Maternity Wing',
      phone: '+91 89532 08952',
      email: 'dr.jones@medisphere.com',
      avatarBg: 'bg-pink-600'
    },
    {
      id: 'DOC-4',
      name: 'Dr. Robert Wilson',
      role: 'Doctor',
      roleBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roleIcon: Stethoscope,
      designation: 'Joint Replacement & Spine Surgeon',
      dept: 'Orthopedics',
      deptBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      qualification: 'MS (Orthopedics), M.Ch (UK)',
      exp: '20 Years',
      rating: 4.7,
      reviews: 156,
      availability: 'Tue, Thu, Sat • 11:00 AM - 05:00 PM',
      campus: 'Orthopedic & Trauma Block',
      phone: '+91 89532 08952',
      email: 'dr.wilson@medisphere.com',
      avatarBg: 'bg-amber-700'
    },
    {
      id: 'DOC-5',
      name: 'Dr. Ritik Pandey',
      role: 'Doctor',
      roleBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roleIcon: Stethoscope,
      designation: 'Consultant Physician & Diabetologist',
      dept: 'General Medicine',
      deptBadge: 'bg-teal-50 text-teal-700 border-teal-200',
      qualification: 'MBBS, MD (General Medicine)',
      exp: '10 Years',
      rating: 4.9,
      reviews: 184,
      availability: 'Mon - Sat • 09:00 AM - 03:00 PM',
      campus: 'OPD Complex, Room 104',
      phone: '+91 89532 08952',
      email: 'dr.ritik@medisphere.com',
      avatarBg: 'bg-teal-700'
    },

    // 2. Nursing Staff
    {
      id: 'NUR-1',
      name: 'Sister Priya Sharma',
      role: 'Nursing Staff',
      roleBadge: 'bg-blue-100 text-blue-800 border-blue-200',
      roleIcon: HeartPulse,
      designation: 'Head Nurse - Critical Care & ICU',
      dept: 'Critical Care & ICU',
      deptBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      qualification: 'B.Sc Nursing, Critical Care Certified (ICU)',
      exp: '11 Years',
      rating: 4.9,
      reviews: 82,
      availability: 'Shift A: 07:00 AM - 03:00 PM',
      campus: 'Intensive Care Unit (ICU), 2nd Floor',
      phone: '+91 89532 08952',
      email: 'priya.nurse@medisphere.com',
      avatarBg: 'bg-blue-600'
    },
    {
      id: 'NUR-2',
      name: 'Sister Anjali Verma',
      role: 'Nursing Staff',
      roleBadge: 'bg-blue-100 text-blue-800 border-blue-200',
      roleIcon: HeartPulse,
      designation: 'Senior OT Scrub & Surgical Nurse',
      dept: 'Critical Care & ICU',
      deptBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      qualification: 'GNM, Advanced OT Assistance Certified',
      exp: '9 Years',
      rating: 4.8,
      reviews: 64,
      availability: 'Modular OT Schedule (24/7 On-Call)',
      campus: 'Operation Theatre Complex',
      phone: '+91 89532 08952',
      email: 'anjali.ot@medisphere.com',
      avatarBg: 'bg-indigo-600'
    },
    {
      id: 'NUR-3',
      name: 'Sister Sunita Rao',
      role: 'Nursing Staff',
      roleBadge: 'bg-blue-100 text-blue-800 border-blue-200',
      roleIcon: HeartPulse,
      designation: 'Emergency Triage & Trauma Nurse',
      dept: 'Emergency & Ambulance',
      deptBadge: 'bg-red-50 text-red-700 border-red-200',
      qualification: 'B.Sc Nursing, Trauma Care Specialist',
      exp: '7 Years',
      rating: 4.9,
      reviews: 91,
      availability: 'Emergency Shift (Rotational 24/7)',
      campus: 'Emergency & Casualty Desk',
      phone: '+91 89532 08952',
      email: 'sunita.emergency@medisphere.com',
      avatarBg: 'bg-rose-600'
    },

    // 3. Lab Technicians
    {
      id: 'TECH-1',
      name: 'Arun Kumar',
      role: 'Lab Technician',
      roleBadge: 'bg-purple-100 text-purple-800 border-purple-200',
      roleIcon: UserCheck,
      designation: 'Senior Clinical Pathology Technician',
      dept: 'Pathology & Diagnostics',
      deptBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      qualification: 'M.Sc Medical Lab Technology (MLT)',
      exp: '10 Years',
      rating: 4.8,
      reviews: 110,
      availability: '24/7 Pathology Desk',
      campus: 'Central Diagnostic Laboratory, Basement',
      phone: '+91 89532 08952',
      email: 'arun.lab@medisphere.com',
      avatarBg: 'bg-purple-700'
    },
    {
      id: 'TECH-2',
      name: 'Vikram Rajput',
      role: 'Lab Technician',
      roleBadge: 'bg-purple-100 text-purple-800 border-purple-200',
      roleIcon: UserCheck,
      designation: 'Lead MRI & 128-Slice CT Radiographer',
      dept: 'Radiology & Imaging',
      deptBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      qualification: 'B.Sc Radiography & Medical Imaging Technology',
      exp: '8 Years',
      rating: 4.9,
      reviews: 95,
      availability: 'Mon - Sat • 08:00 AM - 08:00 PM',
      campus: 'Radiology Imaging Center',
      phone: '+91 89532 08952',
      email: 'vikram.mri@medisphere.com',
      avatarBg: 'bg-indigo-700'
    },
    {
      id: 'TECH-3',
      name: 'Deepak Saxena',
      role: 'Lab Technician',
      roleBadge: 'bg-purple-100 text-purple-800 border-purple-200',
      roleIcon: UserCheck,
      designation: 'Certified Phlebotomist & Blood Bank Technician',
      dept: 'Pathology & Diagnostics',
      deptBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      qualification: 'DMLT, Certified Phlebotomy Technician (CPT)',
      exp: '6 Years',
      rating: 4.9,
      reviews: 140,
      availability: 'Home Collection & Blood Bank 24/7',
      campus: 'Blood Bank & Phlebotomy Lounge',
      phone: '+91 89532 08952',
      email: 'deepak.sample@medisphere.com',
      avatarBg: 'bg-purple-800'
    },

    // 4. Pharmacists & Emergency Paramedics
    {
      id: 'PHARM-1',
      name: 'Manoj Tripathi',
      role: 'Pharmacist & EMT',
      roleBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roleIcon: Pill,
      designation: 'Chief Hospital Pharmacist',
      dept: 'Pharmacy & Pharmacy Care',
      deptBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      qualification: 'M.Pharm (Clinical Pharmacy), R.Ph',
      exp: '14 Years',
      rating: 4.9,
      reviews: 160,
      availability: '24/7 In-House Central Pharmacy',
      campus: 'Main Pharmacy Store, Ground Floor',
      phone: '+91 89532 08952',
      email: 'manoj.pharm@medisphere.com',
      avatarBg: 'bg-emerald-800'
    },
    {
      id: 'EMT-1',
      name: 'Ramesh Yadav',
      role: 'Pharmacist & EMT',
      roleBadge: 'bg-red-100 text-red-800 border-red-200',
      roleIcon: Truck,
      designation: 'Advanced Life Support (ALS) Paramedic Lead',
      dept: 'Emergency & Ambulance',
      deptBadge: 'bg-red-50 text-red-700 border-red-200',
      qualification: 'Diploma in Emergency Medical Services (DEMT), ACLS/BLS',
      exp: '9 Years',
      rating: 5.0,
      reviews: 130,
      availability: '24/7 Rapid Ambulance Fleet Dispatch',
      campus: 'Mobile ICU Ambulance Base',
      phone: '+91 89532 08952',
      email: 'ramesh.ambulance@medisphere.com',
      avatarBg: 'bg-red-700'
    }
  ];

  // Filtering Logic
  const filteredStaff = staffDirectory.filter(member => {
    const matchSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.qualification.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole =
      selectedRole === 'All' || member.role === selectedRole;

    const matchDept =
      selectedDept === 'All' || member.dept === selectedDept;

    return matchSearch && matchRole && matchDept;
  });

  // Count by roles
  const countDoctors = staffDirectory.filter(s => s.role === 'Doctor').length;
  const countNurses = staffDirectory.filter(s => s.role === 'Nursing Staff').length;
  const countTechs = staffDirectory.filter(s => s.role === 'Lab Technician').length;
  const countPharmaEMT = staffDirectory.filter(s => s.role === 'Pharmacist & EMT').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* ======================================================== */}
      {/* HERO BANNER SECTION (Full height on mobile with navbar clearance) */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[100dvh] md:min-h-[500px] flex flex-col justify-center items-center text-white bg-slate-900 overflow-hidden pt-24 sm:pt-24 lg:pt-28 pb-12 sm:pb-16">
        {/* Background Image Container (clipped to bounds) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785925415/medisphere/about/doctors/doctors1.png" 
            alt="Medical Staff & Doctors" 
            className="w-full h-full object-cover opacity-60 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-950/75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-transparent to-slate-950/85"></div>
        </div>

        <div className="container mx-auto max-w-7xl px-3 sm:px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/15 text-[var(--color-accent)] text-[10px] sm:text-xs font-extrabold mb-4 sm:mb-5 border border-white/25 backdrop-blur-sm shadow-sm">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Hospital Clinical Workforce & Medical Staff
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-3 text-white drop-shadow-lg tracking-tight">
              Our Doctors, Nurses & Staff Directory
            </h1>
            
            <p className="text-xs sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-medium drop-shadow-md">
              Meet our multidisciplinary team of board-certified doctors, critical care nurses, laboratory technicians, and emergency paramedics dedicated to your healing.
            </p>
            
            {/* Bespoke Human-Crafted Search Bar (Reduced width on mobile & sleek fit) */}
            <div className="relative z-40 max-w-[92%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-1.5 sm:p-2.5 md:p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] border border-white/50 ring-1 ring-slate-900/5 text-left">
              <div className="flex flex-col md:flex-row items-center gap-1.5 sm:gap-2">
                
                {/* 1. Specialist / Staff Name Search Field */}
                <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 flex-grow w-full rounded-xl hover:bg-slate-50/80 transition-colors">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-50 text-[#0f6c4f] flex items-center justify-center shrink-0 shadow-2xs">
                    <Search className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none mb-0.5 sm:mb-1">
                      Find Specialist / Staff
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Dr. Sarah, Cardiologist..." 
                      className="w-full text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 truncate"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {searchTerm && (
                    <button 
                      type="button" 
                      onClick={() => setSearchTerm('')}
                      className="text-slate-400 hover:text-slate-700 p-1 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Subtle Vertical Divider */}
                <div className="h-8 md:h-10 w-[1px] bg-slate-200 hidden md:block mx-1 shrink-0"></div>

                {/* 2. Custom Animated Department Dropdown Selector */}
                <div ref={deptDropdownRef} className="relative z-50 flex-grow md:max-w-xs w-full">
                  <button
                    type="button"
                    onClick={() => setIsDeptOpen(prev => !prev)}
                    className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 w-full rounded-xl hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
                  >
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs transition-colors">
                      <Building className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none mb-0.5 sm:mb-1 cursor-pointer">
                        Department
                      </label>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {selectedDept === 'All' ? 'All Departments' : selectedDept}
                      </div>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isDeptOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {/* Custom Popover Dropdown Menu */}
                  <AnimatePresence>
                    {isDeptOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute left-0 sm:right-0 top-full mt-2 z-[99999] w-full min-w-[260px] bg-white rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.35)] border border-slate-200 p-2 overflow-hidden ring-1 ring-slate-900/10 max-h-72 overflow-y-auto"
                        style={{ scrollbarWidth: 'thin' }}
                      >
                        <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                          Select Clinical Department
                        </div>
                        
                        <div className="space-y-0.5">
                          {departments.map((dept) => {
                            const isSelected = selectedDept === dept;
                            return (
                              <button
                                key={dept}
                                type="button"
                                onClick={() => {
                                  setSelectedDept(dept);
                                  setIsDeptOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0f6c4f] text-white shadow-xs'
                                    : 'text-slate-700 hover:bg-emerald-50/70 hover:text-[#0f6c4f]'
                                }`}
                              >
                                <span className="truncate">
                                  {dept === 'All' ? '🏥 All Departments' : dept}
                                </span>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-white shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Action Search Button */}
                <Button 
                  onClick={() => {}}
                  className="h-10 sm:h-12 md:h-13 px-4 sm:px-7 rounded-xl md:rounded-2xl bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm w-full md:w-auto shadow-md hover:shadow-lg transition-all border-0 shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Find Staff
                </Button>

              </div>
            </div>

            {/* Quick Department Tags Under Search Bar */}
            <div className="relative z-10 mt-4 mb-8 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-white/70 font-semibold text-[11px]">Quick Filters:</span>
              {['Cardiology', 'Neurology', 'Orthopedics', 'Critical Care & ICU', 'Pathology & Diagnostics'].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-white text-[#0f6c4f] shadow-xs'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  }`}
                >
                  {dept}
                </button>
              ))}
              {selectedDept !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedDept('All')}
                  className="text-[11px] font-bold text-amber-300 hover:underline ml-1 cursor-pointer"
                >
                  Reset Dept ✕
                </button>
              )}
            </div>

            {/* compact stats row removed from hero and moved into navigator */}

          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* DEPARTMENT NAVIGATOR (sticky & fits all 4 on mobile)     */}
      {/* ======================================================== */}
      <section className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-xs">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4">
          <div className="grid grid-cols-4 gap-1 sm:gap-3 py-1.5 sm:py-3 max-w-3xl mx-auto">
            {[
              { key: 'doctors', icon: Stethoscope, color: 'text-[#0f6c4f]', label: 'Medical Doctors', shortLabel: 'Doctors', role: 'Doctor' },
              { key: 'nurses', icon: HeartPulse, color: 'text-blue-600', label: 'Nursing Staff', shortLabel: 'Nursing', role: 'Nursing Staff' },
              { key: 'techs', icon: UserCheck, color: 'text-purple-600', label: 'Lab & Scan Techs', shortLabel: 'Lab Techs', role: 'Lab Technician' },
              { key: 'pharma', icon: Truck, color: 'text-amber-600', label: 'Pharma & EMTs', shortLabel: 'Pharma & EMT', role: 'Pharmacist & EMT' }
            ].map((f) => {
              const Icon = f.icon;
              const isSelected = selectedRole === f.role;
              return (
                <button
                  key={f.key}
                  onClick={() => {
                    setSelectedRole(prev => prev === f.role ? 'All' : f.role);
                    document.getElementById('staff-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex flex-col items-center justify-center p-1 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl text-center transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-50 text-[#0f6c4f] shadow-2xs border border-emerald-200' 
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${f.color} mb-0.5 sm:mb-1`} />
                  <div className="text-[7.5px] sm:text-xs font-bold uppercase tracking-tight text-slate-600 truncate w-full text-center">
                    <span className="sm:hidden">{f.shortLabel}</span>
                    <span className="hidden sm:inline">{f.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* DIRECTORY GRID (3 Cards per line across mobile & desktop) */}
      {/* ======================================================== */}
      <section id="staff-list" className="py-6 sm:py-14">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4">
          
          {/* Header Info with Active Role Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-lg font-bold text-slate-800">
                {selectedRole === 'All' ? 'All Hospital Staff & Doctors' : `${selectedRole} Directory`}
              </span>
            </div>

            <p className="text-[10px] sm:text-xs font-bold text-slate-500">
              Showing <span className="text-[#0f6c4f] font-black">{filteredStaff.length}</span> members
            </p>
          </div>

          {/* Staff Cards Grid (3 in 1 line on all screens) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 lg:gap-6">
            {filteredStaff.map((member, index) => {
              const RoleIcon = member.roleIcon;
              return (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 rounded-xl sm:rounded-3xl overflow-hidden bg-white group flex flex-col justify-between h-full">
                    <CardContent className="p-0 flex flex-col justify-between h-full">
                      
                      {/* Top Header Card */}
                      <div>
                        <div className="p-1.5 sm:p-5 sm:pb-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4 text-center sm:text-left">
                          <div className={`h-8 w-8 sm:h-16 sm:w-16 rounded-lg sm:rounded-2xl ${member.avatarBg} text-white flex items-center justify-center font-bold text-xs sm:text-xl shadow-2xs shrink-0`}>
                            {member.name.split(' ').slice(-1)[0][0]}
                          </div>
                          
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-center justify-center sm:justify-start gap-0.5 sm:gap-1.5 mb-0.5 sm:mb-1 flex-wrap">
                              <span className={`inline-flex items-center gap-0.5 px-1 sm:px-2 py-0.2 rounded-full text-[6px] sm:text-[10px] font-bold border ${member.roleBadge}`}>
                                <RoleIcon className="h-2 w-2 sm:h-3 sm:w-3" /> <span className="hidden sm:inline">{member.role}</span>
                              </span>
                              <span className={`inline-flex items-center px-1 sm:px-2 py-0.2 rounded-full text-[6px] sm:text-[10px] font-semibold border ${member.deptBadge} truncate max-w-[65px] sm:max-w-none`}>
                                {member.dept}
                              </span>
                            </div>
                            
                            <h3 className="text-[9.5px] sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-[#0f6c4f] transition-colors truncate leading-tight">
                              {member.name}
                            </h3>
                            <p className="text-[7px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate leading-tight">{member.designation}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-1.5 sm:p-5 space-y-0.5 sm:space-y-2 text-[7px] sm:text-xs text-slate-600">
                          <p className="flex items-center gap-1 sm:gap-2 font-medium">
                            <Award className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-[#0f6c4f] shrink-0" />
                            <span className="truncate">{member.exp} Exp</span>
                          </p>
                          <p className="hidden sm:flex items-center gap-2 font-medium">
                            <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{member.availability}</span>
                          </p>
                          <p className="hidden sm:flex items-center gap-2 font-medium">
                            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="text-slate-500 truncate">{member.campus}</span>
                          </p>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="p-1.5 sm:p-5 sm:pt-0">
                        <div className="pt-1 sm:pt-3 border-t border-slate-100 flex gap-1 sm:gap-2.5">
                          {member.role === 'Doctor' ? (
                            <Link to={`/book-appointment?doctor=${member.id}`} className="flex-1">
                              <Button className="w-full h-6 sm:h-10 rounded-md sm:rounded-xl bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold text-[7.5px] sm:text-xs shadow-2xs cursor-pointer px-1">
                                <Calendar className="mr-0.5 sm:mr-1.5 h-2 w-2 sm:h-3.5 sm:w-3.5" /> Book
                              </Button>
                            </Link>
                          ) : (
                            <a href="tel:+918953208952" className="flex-1">
                              <Button variant="outline" className="w-full h-6 sm:h-10 rounded-md sm:rounded-xl border-emerald-200 text-[#0f6c4f] hover:bg-emerald-50 font-bold text-[7.5px] sm:text-xs cursor-pointer px-1">
                                <Phone className="mr-0.5 sm:mr-1.5 h-2 w-2 sm:h-3.5 sm:w-3.5" /> Call
                              </Button>
                            </a>
                          )}
                          <Button 
                            variant="outline" 
                            onClick={() => alert(`👨‍⚕️ ${member.name}\nDesignation: ${member.designation}\nDepartment: ${member.dept}\nShift: ${member.availability}\nContact: ${member.phone}`)}
                            className="hidden sm:inline-flex rounded-xl px-3.5 h-10 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                          >
                            Details
                          </Button>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8">
              <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Staff Members Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try clearing your search query or selecting "All Departments" to see all hospital staff.
              </p>
              <Button 
                variant="outline" 
                className="rounded-xl font-bold text-xs cursor-pointer" 
                onClick={() => { setSearchTerm(''); setSelectedDept('All'); setSelectedRole('All'); }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
          
        </div>
      </section>

    </div>
  );
}
