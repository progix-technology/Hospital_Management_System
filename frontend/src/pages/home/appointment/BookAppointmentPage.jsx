import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, FileText, ChevronRight, CheckCircle2, Activity } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'General Medicine'];
  const doctors = {
    'Cardiology': ['Dr. Sarah Smith', 'Dr. James Taylor'],
    'Neurology': ['Dr. Michael Chen'],
    'Orthopedics': ['Dr. Robert Wilson'],
    'Pediatrics': ['Dr. Emily Jones'],
    'Oncology': ['Dr. Lisa Wong'],
    'General Medicine': ['Dr. William Brown', 'Dr. Emma Davis']
  };

  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    reason: ''
  });

  const generateTimeSlots = () => {
    const slots = [];
    let startMinutes = 9 * 60; // 09:00 AM
    const endMinutes = 17 * 60 + 30; // 05:30 PM

    while (startMinutes <= endMinutes) {
      const hours = Math.floor(startMinutes / 60);
      const mins = startMinutes % 60;
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedHours = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
      const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
      
      slots.push(`${formattedHours}:${formattedMins} ${period}`);
      startMinutes += 20;
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if a time slot has already passed for TODAY's date
  const isSlotPassed = (slotStr, selectedDateStr) => {
    if (!selectedDateStr || !slotStr) return false;
    const now = new Date();
    
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const isToday = (
      year === now.getFullYear() &&
      (month - 1) === now.getMonth() &&
      day === now.getDate()
    );
    
    if (!isToday) return false;

    try {
      const [timePart, period] = slotStr.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const slotTotalMinutes = hours * 60 + minutes;
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

      return slotTotalMinutes <= currentTotalMinutes;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (formData.date) {
      axios.get(`http://localhost:5000/api/appointments/booked-slots?date=${formData.date}`)
        .then(({ data }) => setBookedSlots(data || []))
        .catch(err => console.error('Error fetching booked slots:', err));
    } else {
      setBookedSlots([]);
    }
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Reset doctor if department changes
      if (name === 'department') newData.doctor = '';
      return newData;
    });
  };

  const nextStep = () => {
    if (step === 1 && (!formData.department || !formData.date || !formData.time)) {
      alert("Please select Department, Date, and Time.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone) {
      alert("Please fill required fields.");
      return;
    }
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const patientId = userInfo._id || null;

      let selectedDoctorId = null;
      if (formData.doctor) {
        const { data: docs } = await axios.get('http://localhost:5000/api/users/doctors');
        const match = (docs || []).find(d => d.name.toLowerCase().includes(formData.doctor.toLowerCase()));
        if (match) selectedDoctorId = match._id;
      }

      if (patientId) {
        await axios.post('http://localhost:5000/api/appointments', {
          patient: patientId,
          doctor: selectedDoctorId,
          date: formData.date || new Date(),
          timeSlot: formData.time,
          type: 'Consultation',
          fee: 500,
          paymentMethod: 'Cash'
        });
      }
    } catch (err) {
      console.error('Error submitting public appointment:', err);
    }
    setIsSubmitted(true);
  };

  // Period filter for time slots on mobile/desktop
  const [slotFilter, setSlotFilter] = useState('all');

  const filteredTimeSlots = timeSlots.filter(slot => {
    if (slotFilter === 'all') return true;
    const [timePart, period] = slot.split(' ');
    const hour = parseInt(timePart.split(':')[0], 10);
    if (slotFilter === 'morning') {
      return period === 'AM' || (period === 'PM' && hour === 12);
    }
    if (slotFilter === 'afternoon') {
      return period === 'PM' && (hour === 12 || hour === 1 || hour === 2);
    }
    if (slotFilter === 'evening') {
      return period === 'PM' && (hour >= 3 && hour <= 6);
    }
    return true;
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24 pb-12 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-heading)] mb-2 sm:mb-3">Appointment Confirmed!</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 leading-relaxed">
            Thank you, <span className="font-bold text-slate-700">{formData.firstName}</span>. Your appointment has been scheduled for <br/>
            <span className="font-bold text-[var(--color-primary)] text-sm sm:text-base mt-1 inline-block">{formData.date} at {formData.time}</span>
          </p>
          <Link to="/">
            <Button className="w-full h-11 sm:h-12 text-xs sm:text-base font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl cursor-pointer">
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      
      {/* Hero Section (Full height on mobile with navbar clearance) */}
      <section className="relative w-full min-h-[100dvh] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-center text-white overflow-hidden bg-slate-900 pt-24 sm:pt-28 pb-16 sm:pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925413/medisphere/about/docters.jpg" 
            alt="Doctor Consultation" 
            className="w-full h-full object-cover object-center opacity-55 scale-105 transition-transform duration-1000"
          />
        </div>
        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/80 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/90 z-0"></div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/15 text-[var(--color-accent)] text-[10px] sm:text-xs font-extrabold mb-3 sm:mb-5 border border-white/25 backdrop-blur-sm shadow-sm">
              <Calendar className="h-3.5 w-3.5" /> Instant Doctor Appointment
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-2.5 sm:mb-4 text-white drop-shadow-lg tracking-tight">
              Book a Consultation
            </h1>
            <p className="text-xs sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md px-2">
              Select your specialty, choose your doctor and preferred time slot for instant confirmation with top medical specialists.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-8">
              <a 
                href="#booking-card" 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[11px] sm:text-sm font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/30 transition-transform active:scale-95"
              >
                <Calendar className="h-3.5 w-3.5 text-[var(--color-accent)]" /> Choose Slot
              </a>
              <a 
                href="tel:+918953208952" 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-sm font-bold rounded-xl backdrop-blur-md border border-white/20 transition-transform active:scale-95"
              >
                <Phone className="h-3.5 w-3.5 text-[var(--color-accent)]" /> Call Helpline
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Appointment Section (Overlapping Hero) */}
      <section id="booking-card" className="relative z-20 -mt-10 sm:-mt-20 pb-12 sm:pb-24 scroll-mt-24">
        <div className="container mx-auto max-w-4xl px-2.5 sm:px-4">
          
          {/* Stepper */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-md border border-slate-200 flex items-center justify-between max-w-md mx-auto">
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${step === 1 ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
              <span>1. Slot Details</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${step === 2 ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
              <span>2. Patient Info</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden">
            
            <div className="p-4 sm:p-8 md:p-12">
              <form onSubmit={handleSubmit}>
                
                {/* STEP 1: Medical Details */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-heading)]">Select Department & Slot</h3>
                        <p className="text-[11px] sm:text-xs text-slate-500">Pick preferred specialty, date and appointment timing.</p>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">OPD ₹500</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-5 sm:mb-8">
                      
                      {/* Department */}
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-[var(--color-primary)]"/> Department <span className="text-red-500">*</span>
                        </label>
                        <select 
                          name="department" 
                          value={formData.department} 
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium"
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                      </div>

                      {/* Doctor (Optional based on dept) */}
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[var(--color-primary)]"/> Doctor (Optional)
                        </label>
                        <select 
                          name="doctor" 
                          value={formData.doctor} 
                          onChange={handleChange}
                          disabled={!formData.department}
                          className="w-full h-10 sm:h-12 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium disabled:opacity-50"
                        >
                          <option value="">Any Available Doctor</option>
                          {formData.department && doctors[formData.department]?.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                        </select>
                      </div>

                      {/* Date */}
                      <div className="space-y-1 sm:space-y-2 sm:col-span-2">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[var(--color-primary)]"/> Preferred Date <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          name="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.date}
                          onChange={(e) => {
                            handleChange(e);
                            setFormData(prev => ({ ...prev, date: e.target.value, time: '' }));
                          }}
                          className="w-full h-10 sm:h-12 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Time Slots with Filter Tabs */}
                    <div className="mb-6 sm:mb-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[var(--color-primary)]"/> Available Time Slots <span className="text-red-500">*</span>
                        </label>

                        {/* Slot Period Filters (Morning / Afternoon / Evening) */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                          {[
                            { key: 'all', label: 'All' },
                            { key: 'morning', label: 'Morning' },
                            { key: 'afternoon', label: 'Afternoon' },
                            { key: 'evening', label: 'Evening' },
                          ].map(f => (
                            <button
                              key={f.key}
                              type="button"
                              onClick={() => setSlotFilter(f.key)}
                              className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-all ${
                                slotFilter === f.key 
                                  ? 'bg-white text-[var(--color-primary)] shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3 columns on mobile, 4 on tablet, 6 on desktop */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2">
                        {filteredTimeSlots.map(time => {
                          const isBooked = bookedSlots.includes(time);
                          const isPast = isSlotPassed(time, formData.date);
                          const isDisabled = isBooked || isPast;
                          const isSelected = formData.time === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => setFormData({ ...formData, time })}
                              className={`py-2 px-1.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs transition-all duration-200 border text-center truncate ${
                                isPast
                                  ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed opacity-50'
                                  : isBooked
                                  ? 'bg-slate-100 border-slate-200 text-slate-300 line-through cursor-not-allowed opacity-50'
                                  : isSelected
                                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20 scale-[1.02]'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95'
                              }`}
                              title={isPast ? 'Passed' : isBooked ? 'Booked' : time}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>

                      {formData.time && (
                        <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Selected Slot: {formData.time}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4 sm:pt-6 border-t border-slate-100">
                      <Button 
                        type="button" 
                        onClick={nextStep} 
                        className="w-full sm:w-auto h-11 sm:h-14 px-8 text-xs sm:text-base font-bold rounded-xl shadow-md shadow-[var(--color-primary)]/20 cursor-pointer active:scale-[0.99] transition-transform"
                      >
                        Next: Patient Info <ChevronRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Personal Details */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-heading)]">Patient Information</h3>
                        <p className="text-[11px] sm:text-xs text-slate-500">Enter patient contact details to confirm consultation.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setStep(1)} 
                        className="text-xs sm:text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                      >
                        &larr; Change Slot
                      </button>
                    </div>

                    {/* First Name & Last Name (2-in-1 on mobile) */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-6 mb-3 sm:mb-5">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700">First Name <span className="text-red-500">*</span></label>
                        <Input 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          placeholder="John" 
                          required 
                          className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700">Last Name</label>
                        <Input 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          placeholder="Doe" 
                          className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                        />
                      </div>
                    </div>

                    {/* Phone & Email (2-in-1 on mobile) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-6 mb-3 sm:mb-5">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400"/> Phone Number <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          name="phone" 
                          type="tel" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          placeholder="+91 98765 43210" 
                          required 
                          className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                        />
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400"/> Email Address
                        </label>
                        <Input 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          placeholder="john@example.com" 
                          className="h-9 sm:h-12 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-lg sm:rounded-xl" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                      <label className="text-[11px] sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-400"/> Reason for Visit (Optional)
                      </label>
                      <textarea 
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Briefly describe your symptoms..." 
                        rows={2}
                        className="w-full p-2.5 sm:p-3 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none font-medium"
                      ></textarea>
                    </div>

                    {/* Payment & Summary */}
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden mb-4 sm:mb-6 shadow-sm">
                      <div className="p-3 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</p>
                          <p className="text-[var(--color-heading)] font-bold text-xs sm:text-base leading-tight">
                            {formData.department} {formData.doctor && `• ${formData.doctor}`}
                          </p>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                            {formData.date} at {formData.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Fee</p>
                          <p className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-primary)]">₹500</p>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
                        <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Pay at Hospital or Online
                        </div>
                        <Button 
                          type="submit" 
                          className="h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-base font-bold rounded-xl shadow-md shadow-[var(--color-primary)]/20 w-full sm:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] cursor-pointer active:scale-[0.99] transition-transform"
                        >
                          Confirm & Book (₹500)
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
