import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import {
  Calendar, Clock, MapPin, User, Video, X, CreditCard, FileText, Printer,
  ShieldCheck, Smartphone, Building2, Lock, CheckCircle2, QrCode, Sparkles, AlertCircle
} from 'lucide-react';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlipApt, setSelectedSlipApt] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [bookingData, setBookingData] = useState({
    complaint: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    type: 'Checkup',
    fee: 500,
    paymentMethod: 'Cash'
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Razorpay Payment Gateway Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayTab, setRazorpayTab] = useState('card'); // 'card' | 'upi'
  const [razorpayProcessing, setRazorpayProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '4532 8921 4401 8921', expiry: '08/28', cvv: '482', name: 'Cardholder Name' });
  const [upiForm, setUpiForm] = useState({ vpa: 'patient@upi' });

  useEffect(() => {
    if (bookingData.date) {
      axios.get(`http://localhost:5000/api/appointments/booked-slots?doctorId=${bookingData.doctorId}&date=${bookingData.date}`)
        .then(({ data }) => setBookedSlots(data || []))
        .catch(err => console.error('Error fetching booked slots:', err));
    } else {
      setBookedSlots([]);
    }
  }, [bookingData.doctorId, bookingData.date]);

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

  // Check if a time slot has already passed for TODAY's date
  const isSlotPassed = (slotStr, selectedDateStr) => {
    if (!selectedDateStr || !slotStr) return false;
    const now = new Date();
    
    // Parse selected date from input (YYYY-MM-DD)
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const isToday = (
      year === now.getFullYear() &&
      (month - 1) === now.getMonth() &&
      day === now.getDate()
    );
    
    if (!isToday) return false; // Future date: all slots are open

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

  // Complaint → Specialty mapping
  const complaintSpecialtyMap = [
    { complaint: 'Heart problem / Chest pain', specialty: 'Cardiology' },
    { complaint: 'Brain / Nervous system issue', specialty: 'Neurology' },
    { complaint: 'Bone / Joint pain', specialty: 'Orthopedics' },
    { complaint: 'Skin problem / Rash', specialty: 'Dermatology' },
    { complaint: 'Eye problem / Vision', specialty: 'Ophthalmology' },
    { complaint: 'Ear / Nose / Throat issue', specialty: 'ENT' },
    { complaint: 'Stomach / Digestive problem', specialty: 'Gastroenterology' },
    { complaint: 'Child health issue', specialty: 'Pediatrics' },
    { complaint: 'Women health / Pregnancy', specialty: 'Gynecology' },
    { complaint: 'Cancer / Tumor concern', specialty: 'Oncology' },
    { complaint: 'Kidney / Urine problem', specialty: 'Nephrology' },
    { complaint: 'Hormone / Thyroid issue', specialty: 'Endocrinology' },
    { complaint: 'Mental health / Anxiety', specialty: 'Psychiatry' },
    { complaint: 'Lung / Breathing problem', specialty: 'Pulmonology' },
    { complaint: 'Fever / General illness', specialty: 'General Physician' },
    { complaint: 'Other / Not sure', specialty: '' },
  ];

  const selectedSpecialty = complaintSpecialtyMap.find(c => c.complaint === bookingData.complaint)?.specialty ?? null;

  const filteredDoctors = bookingData.complaint
    ? (selectedSpecialty === ''
      ? doctors  // "Other" → show all doctors
      : doctors.filter(d => d.specialty && d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())))
    : [];

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo._id) {
        const { data } = await axios.get(`http://localhost:5000/api/appointments/patient/${userInfo._id}`);
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookingData.doctorId || !bookingData.date || !bookingData.timeSlot) {
      alert('Please fill out all required appointment details.');
      return;
    }

    // If online payment (Card or UPI), launch Razorpay Payment Modal inside same popup!
    if (bookingData.paymentMethod === 'Card' || bookingData.paymentMethod === 'UPI') {
      setRazorpayTab(bookingData.paymentMethod === 'UPI' ? 'upi' : 'card');
      setShowRazorpayModal(true);
      return;
    }

    // Otherwise directly execute Cash Booking
    await executeBooking('Cash');
  };

  const executeBooking = async (pmMethod, txnId = null) => {
    try {
      setBookingLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const payload = {
        patient: userInfo._id,
        doctor: bookingData.doctorId,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        type: bookingData.type,
        fee: 500,
        paymentMethod: txnId ? `Razorpay (${pmMethod})` : pmMethod
      };

      const { data: createdApt } = await axios.post('http://localhost:5000/api/appointments', payload);

      setIsModalOpen(false);
      setShowRazorpayModal(false);
      setBookingData({ complaint: '', doctorId: '', date: '', timeSlot: '', type: 'Checkup', fee: 500, paymentMethod: 'Cash' });
      fetchAppointments();

      if (txnId) {
        alert(`Payment ₹500 Successful via Razorpay! (Txn ID: ${txnId})\nAppointment booked!`);
      } else {
        alert('Appointment booked successfully!');
      }

      if (createdApt) {
        setSelectedSlipApt(createdApt);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookingLoading(false);
      setRazorpayProcessing(false);
    }
  };

  const handleRazorpayPayNow = () => {
    setRazorpayProcessing(true);
    const mockTxnId = `pay_rzp_${Math.random().toString(36).substring(2, 10)}`;

    setTimeout(() => {
      executeBooking(razorpayTab === 'upi' ? 'UPI' : 'Card', mockTxnId);
    }, 1200);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'In Progress': return <Badge variant="warning">In Progress</Badge>;
      case 'Cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="outline">{status || 'Scheduled'}</Badge>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative">

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">My Appointments</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Manage your upcoming and past consultations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90">
          Book New Appointment
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[var(--color-muted-foreground)]">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-muted-foreground)]">You have no appointments yet.</div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => {
            const aptDate = new Date(apt.date);
            const month = aptDate.toLocaleString('default', { month: 'short' });
            const day = aptDate.getDate();
            const year = aptDate.getFullYear();

            return (
              <Card key={apt._id} className={`border-[var(--color-border)] shadow-sm ${apt.status === 'Completed' || apt.status === 'Cancelled' ? 'opacity-70' : ''}`}>
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">

                  {/* Date Cube */}
                  <div className="flex flex-col items-center justify-center h-24 w-24 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-center shrink-0">
                    <span className="text-xs uppercase font-bold tracking-wider">{month} {year}</span>
                    <span className="font-bold text-3xl leading-none mt-1">{day}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3 w-full text-center md:text-left">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-foreground)]">{apt.doctor ? apt.doctor.name : 'Unknown Doctor'}</h3>
                      <p className="text-sm font-medium text-[var(--color-primary)]">{apt.type}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-[var(--color-muted-foreground)]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {apt.type === 'Video Consult' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                        <span>{apt.type === 'Video Consult' ? 'Online' : 'Hospital Visit'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
                        <CreditCard className="h-4 w-4" />
                        <span>₹{apt.fee || 500} ({apt.paymentMethod || 'Cash'})</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Status & Slip) */}
                  <div className="shrink-0 flex flex-col items-center md:items-end gap-2.5">
                    {getStatusBadge(apt.status)}
                    {(() => {
                      const isDone = apt.status === 'Completed' || apt.status === 'Cancelled';
                      return (
                        <Button
                          variant="outline"
                          onClick={() => !isDone && setSelectedSlipApt(apt)}
                          disabled={isDone}
                          title={isDone ? `Slip not available for ${apt.status} appointments` : 'View Appointment Slip'}
                          className={`rounded-xl py-1.5 px-3.5 h-auto text-xs transition-all ${isDone
                            ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60'
                            : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer'
                            }`}
                        >
                          <FileText className="mr-1.5 h-3.5 w-3.5" />
                          {isDone ? 'Slip N/A' : 'Slip'}
                        </Button>
                      );
                    })()}
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && !showRazorpayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="p-6 space-y-5">
                {/* Step 1: Chief Complaint */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-600">What is your chief complaint? <span className="text-red-400">*</span></label>
                  <select
                    required
                    value={bookingData.complaint}
                    onChange={(e) => setBookingData({ ...bookingData, complaint: e.target.value, doctorId: '' })}
                    className="w-full h-11 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 text-slate-700"
                  >
                    <option value="" disabled>Select your symptom / problem</option>
                    {complaintSpecialtyMap.map(({ complaint, specialty }) => (
                      <option key={complaint} value={complaint}>
                        {complaint}{specialty ? ` → ${specialty}` : ' → All Doctors'}
                      </option>
                    ))}
                  </select>
                  {bookingData.complaint && selectedSpecialty && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      ✅ Showing <strong>{selectedSpecialty}</strong> specialists
                    </p>
                  )}
                  {bookingData.complaint && selectedSpecialty === '' && (
                    <p className="text-xs text-blue-500 font-medium mt-1">📋 Showing all available doctors</p>
                  )}
                </div>

                {/* Step 2: Select Doctor (filtered by complaint) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-600">Select Doctor <span className="text-red-400">*</span></label>
                  <select
                    required
                    disabled={!bookingData.complaint}
                    value={bookingData.doctorId}
                    onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                    className={`w-full h-11 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 ${!bookingData.complaint ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'text-slate-700'
                      }`}
                  >
                    <option value="" disabled>
                      {!bookingData.complaint ? 'Select complaint first' : filteredDoctors.length === 0 ? 'No doctors available for this specialty' : 'Select a doctor'}
                    </option>
                    {filteredDoctors.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} {doc.specialty ? `— ${doc.specialty}` : ''}
                      </option>
                    ))}
                  </select>
                  {bookingData.complaint && filteredDoctors.length === 0 && (
                    <p className="text-xs text-amber-500 font-medium">⚠️ No specialist found. Try "Other / Not sure" to see all doctors.</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600">Date</label>
                    <Input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value, timeSlot: '' })}
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600">Time Slot (20-min interval)</label>
                    <select
                      required
                      value={bookingData.timeSlot}
                      onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                      className="w-full h-11 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 font-medium text-slate-700"
                    >
                      <option value="" disabled>Select time slot</option>
                      {generateTimeSlots().map(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        const isPast = isSlotPassed(slot, bookingData.date);
                        const isDisabled = isBooked || isPast;

                        let label = slot;
                        if (isPast) {
                          label = `${slot} (Closed / Time Passed ⛔)`;
                        } else if (isBooked) {
                          label = `${slot} (Already Booked 🔒)`;
                        }

                        return (
                          <option
                            key={slot}
                            value={slot}
                            disabled={isDisabled}
                            className={isDisabled ? 'bg-slate-100 text-slate-400 font-semibold italic' : 'text-slate-800 font-medium'}
                          >
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-600">Consultation Type</label>
                  <select
                    required
                    value={bookingData.type}
                    onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                    className="w-full h-11 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                  >
                    <option value="Checkup">General Checkup</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Video Consult">Video Consult</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600">Appointment Fee (₹)</label>
                    <input
                      type="text"
                      readOnly
                      value="₹ 500"
                      className="w-full h-11 px-3 border border-slate-200 rounded-md bg-slate-100/80 font-bold text-slate-800 cursor-not-allowed select-none outline-none"
                    />
                    <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">
                      Standard OPD Consultation & Doctor Registration Charge.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600">Payment Method</label>
                    <select
                      required
                      value={bookingData.paymentMethod}
                      onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                      className="w-full h-11 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 font-semibold text-slate-700"
                    >
                      <option value="Cash">Cash (Pay at Desk)</option>
                      <option value="Card">💳 Credit / Debit Card (Razorpay)</option>
                      <option value="UPI">📱 UPI / QR Code (Razorpay)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={bookingLoading} className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90">
                    {bookingLoading ? 'Processing...' : (bookingData.paymentMethod === 'Cash' ? 'Confirm Booking' : 'Proceed to Razorpay (₹500)')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Razorpay Step - Opens inside exact same modal design frame */}
      <AnimatePresence>
        {isModalOpen && showRazorpayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              {/* Modal Header matching Appointment Modal */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#0c2340] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      Razorpay Gateway <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-mono font-bold uppercase">Test Mode</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Step 2: Secure Payment Confirmation</p>
                  </div>
                </div>
                <button onClick={() => setShowRazorpayModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body matching Appointment Form Padding */}
              <div className="p-6 space-y-5">
                
                {/* Amount Summary Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Payable Consultation Fee</span>
                    <span className="text-2xl font-bold text-slate-900 font-serif">₹ 500.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium block">Time Slot</span>
                    <span className="text-xs font-bold text-[var(--color-primary)] block">{bookingData.timeSlot || '09:00 AM'}</span>
                  </div>
                </div>

                {/* Razorpay Tab Selection */}
                <div className="flex border border-slate-200 rounded-xl bg-slate-50 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setRazorpayTab('card')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      razorpayTab === 'card' ? 'bg-white text-[var(--color-primary)] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" /> Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setRazorpayTab('upi')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      razorpayTab === 'upi' ? 'bg-white text-[var(--color-primary)] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" /> UPI / QR Code
                  </button>
                </div>

                {/* TAB CONTENTS */}
                {razorpayTab === 'card' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Card Number</label>
                      <Input
                        type="text"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        placeholder="4532 •••• •••• 8921"
                        className="h-11 border-slate-200 font-mono text-xs bg-slate-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Expiry Date</label>
                        <Input
                          type="text"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="h-11 border-slate-200 text-center font-mono text-xs bg-slate-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">CVV</label>
                        <Input
                          type="password"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          placeholder="•••"
                          maxLength={4}
                          className="h-11 border-slate-200 text-center font-mono text-xs bg-slate-50"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {razorpayTab === 'upi' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                      <QrCode className="h-6 w-6 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 text-xs">Scan & Pay via GPay / PhonePe / Paytm</p>
                        <p className="text-[10px] text-emerald-700 font-medium">Instant 256-Bit Razorpay Auto Verification</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Virtual Payment Address (VPA / UPI ID)</label>
                      <Input
                        type="text"
                        value={upiForm.vpa}
                        onChange={(e) => setUpiForm({ ...upiForm, vpa: e.target.value })}
                        placeholder="mobile@upi / username@okhdfcbank"
                        className="h-11 border-slate-200 font-mono text-xs bg-slate-50"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Footer Buttons matching Modal Button style */}
                <div className="pt-3 flex justify-between items-center border-t border-slate-100 gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowRazorpayModal(false)}>
                    &larr; Back
                  </Button>
                  <Button
                    onClick={handleRazorpayPayNow}
                    disabled={razorpayProcessing}
                    className="bg-[#0c2340] hover:bg-blue-950 text-white font-extrabold text-xs h-11 px-6 rounded-xl shadow-lg shadow-blue-950/20 flex items-center gap-2"
                  >
                    {razorpayProcessing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" /> Pay ₹ 500.00 via Razorpay
                      </>
                    )}
                  </Button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slip Modal */}
      <AnimatePresence>
        {selectedSlipApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden border border-slate-100 relative print:shadow-none print:border-none print:w-full print:max-w-none"
            >
              {/* Close and Print Actions */}
              <div className="absolute right-3 top-3 flex items-center gap-1.5 print:hidden z-10">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 bg-slate-50 text-slate-600 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all"
                  title="Print Slip"
                >
                  <Printer className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setSelectedSlipApt(null)}
                  className="p-1.5 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Printable Area */}
              <div className="p-5 print:p-0" id="printable-slip">
                {/* Header Brand */}
                <div className="text-center pb-4 border-b border-dashed border-slate-200">
                  <div className="inline-flex items-center gap-1.5 mb-1">
                    <img src="/applogo.png" alt="Logo" className="h-6 w-6 object-contain" />
                    <span className="font-bold text-lg tracking-tight text-[#0d2a21] font-serif">Medisphere</span>
                  </div>
                  <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold leading-none">Hospital & Research Center</p>
                  <div className="mt-2.5 inline-block bg-[#1b4d3e]/10 text-[#1b4d3e] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Appointment Slip
                  </div>
                </div>

                {/* Token Block */}
                <div className="my-4 text-center bg-slate-50/50 rounded-xl py-2.5 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Token Number</span>
                  <h1 className="text-3xl font-black text-[#1b4d3e] mt-0.5 font-mono">
                    #{selectedSlipApt._id.slice(-4).toUpperCase()}
                  </h1>
                </div>

                {/* Details Grid */}
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Doctor</span>
                    <span className="font-bold text-slate-800">{selectedSlipApt.doctor ? selectedSlipApt.doctor.name : 'Doctor'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Department</span>
                    <span className="font-bold text-slate-800">
                      {selectedSlipApt.doctor?.specialty || 'General Medicine'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Date</span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedSlipApt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Time Slot</span>
                    <span className="font-bold text-slate-800">{selectedSlipApt.timeSlot}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Type</span>
                    <span className="font-bold text-slate-800">{selectedSlipApt.type}</span>
                  </div>

                  <div className="pt-2.5 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-slate-400">Fee Amount</span>
                      <span className="font-bold text-slate-800">₹{selectedSlipApt.fee || 500}.00</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-slate-400">Payment Mode</span>
                      <span className="font-bold text-slate-800">{selectedSlipApt.paymentMethod || 'Cash'}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-slate-400">Payment Status</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${selectedSlipApt.paymentMethod?.includes('Razorpay') || selectedSlipApt.paymentMethod === 'Card' || selectedSlipApt.paymentMethod === 'UPI'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                        }`}>
                        {selectedSlipApt.paymentMethod?.includes('Razorpay') || selectedSlipApt.paymentMethod === 'Card' || selectedSlipApt.paymentMethod === 'UPI' ? 'Paid (Razorpay)' : 'Pending (Pay at Desk)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-6 text-center pt-4 border-t border-slate-100 text-[9px] text-slate-400">
                  <p className="font-medium">Please report 15 mins before your time.</p>
                  <p className="mt-0.5 font-semibold text-[#1b4d3e]">Thank you for choosing Medisphere.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
