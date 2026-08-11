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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[var(--color-heading)] mb-4">Appointment Confirmed!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Thank you, <span className="font-bold text-slate-700">{formData.firstName}</span>. Your appointment has been successfully scheduled for <br/>
            <span className="font-bold text-[var(--color-primary)]">{formData.date} at {formData.time}</span>.
          </p>
          <Link to="/">
            <Button className="w-full h-12 text-base font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl">
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-24 pb-20">
      
      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-heading)] mb-4">Book an Appointment</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Schedule a consultation with our expert doctors. Fast, easy, and secure.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 max-w-xs mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full z-0"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-[var(--color-primary)] -translate-y-1/2 rounded-full z-0 transition-all duration-500 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
          
          <div className="flex justify-between w-full relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= 1 ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' : 'bg-slate-200 text-slate-400'}`}>1</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= 2 ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' : 'bg-slate-200 text-slate-500'}`}>2</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Medical Details */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-heading)] mb-8 border-b border-slate-100 pb-4">Medical Consultation Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    
                    {/* Department */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Activity className="h-4 w-4 text-[var(--color-primary)]"/> Department <span className="text-red-500">*</span></label>
                      <select 
                        name="department" 
                        value={formData.department} 
                        onChange={handleChange}
                        className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                      </select>
                    </div>

                    {/* Doctor (Optional based on dept) */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><User className="h-4 w-4 text-[var(--color-primary)]"/> Doctor (Optional)</label>
                      <select 
                        name="doctor" 
                        value={formData.doctor} 
                        onChange={handleChange}
                        disabled={!formData.department}
                        className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium disabled:opacity-50"
                      >
                        <option value="">Any Available Doctor</option>
                        {formData.department && doctors[formData.department]?.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                      </select>
                    </div>

                    {/* Date */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-[var(--color-primary)]"/> Preferred Date <span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => {
                          handleChange(e);
                          setFormData(prev => ({ ...prev, date: e.target.value, time: '' }));
                        }}
                        className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="mb-10">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4"><Clock className="h-4 w-4 text-[var(--color-primary)]"/> Available Time Slots <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2.5">
                      {timeSlots.map(time => {
                        const isBooked = bookedSlots.includes(time);
                        const isPast = isSlotPassed(time, formData.date);
                        const isDisabled = isBooked || isPast;
                        const isSelected = formData.time === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setFormData({...formData, time})}
                            className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 border ${
                              isPast
                                ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed opacity-60'
                                : isBooked
                                ? 'bg-slate-100 border-slate-200 text-slate-300 line-through cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                            }`}
                          >
                            {time} {isPast ? '(Closed ⛔)' : isBooked ? '(Booked 🔒)' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-slate-100">
                    <Button type="button" onClick={nextStep} className="h-14 px-8 text-base font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20">
                      Next Step <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Personal Details */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <h3 className="text-2xl font-serif font-bold text-[var(--color-heading)]">Patient Information</h3>
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-[var(--color-primary)] hover:underline">
                      &larr; Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">First Name <span className="text-red-500">*</span></label>
                      <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required className="h-14 bg-slate-50 border-slate-200 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Last Name</label>
                      <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="h-14 bg-slate-50 border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400"/> Phone Number <span className="text-red-500">*</span></label>
                      <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required className="h-14 bg-slate-50 border-slate-200 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400"/> Email Address</label>
                      <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="h-14 bg-slate-50 border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-10">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400"/> Reason for Visit (Optional)</label>
                    <textarea 
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Briefly describe your symptoms or reason for visit..." 
                      rows={3}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none font-medium"
                    ></textarea>
                  </div>

                  {/* Payment & Summary */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
                    <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Appointment Summary</p>
                        <p className="text-[var(--color-heading)] font-bold text-lg">
                          {formData.department} {formData.doctor && `with ${formData.doctor}`}
                        </p>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          {formData.date} at {formData.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Consultation Fee</p>
                        <p className="text-3xl font-serif font-bold text-[var(--color-primary)]">₹500</p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Secure Payment
                        </div>
                      </div>
                      <Button type="submit" className="h-14 px-8 text-base font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 w-full md:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">
                        Pay ₹500 & Book Appointment
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
