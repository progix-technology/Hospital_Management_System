import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { Input } from '../../../components/Input';
import {
  Calendar as CalendarIcon, Clock, User, ChevronRight, Plus, Search,
  Filter, CheckCircle2, AlertCircle, RefreshCw, X, CreditCard, Video,
  MapPin, Printer, FileText, Trash2, Stethoscope, ChevronDown
} from 'lucide-react';
import axios from 'axios';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedSlipApt, setSelectedSlipApt] = useState(null);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [bookingData, setBookingData] = useState({
    patientId: '',
    complaint: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    type: 'Checkup',
    fee: 500,
    paymentMethod: 'Cash'
  });

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

  const filteredDoctors = bookingData.complaint
    ? (selectedSpecialty === ''
        ? doctors
        : doctors.filter(d => d.specialty && d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())))
    : [];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(data || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffAndPatients = async () => {
    try {
      const [pRes, dRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/patients'),
        axios.get('http://localhost:5000/api/users/doctors')
      ]);
      setPatients(pRes.data || []);
      setDoctors(dRes.data || []);
    } catch (error) {
      console.error('Failed to fetch patients/doctors:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchStaffAndPatients();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookingData.patientId || !bookingData.doctorId) {
      alert('Please select both patient and doctor.');
      return;
    }

    try {
      setBookingLoading(true);
      const payload = {
        patient: bookingData.patientId,
        doctor: bookingData.doctorId,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        type: bookingData.type,
        fee: bookingData.fee,
        paymentMethod: bookingData.paymentMethod
      };

      await axios.post('http://localhost:5000/api/appointments', payload);
      setIsModalOpen(false);
      setBookingData({
        patientId: '',
        complaint: '',
        doctorId: '',
        date: '',
        timeSlot: '',
        type: 'Checkup',
        fee: 500,
        paymentMethod: 'Cash'
      });
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status: newStatus });
      setAppointments(prev =>
        prev.map(apt => (apt._id === id ? { ...apt, status: newStatus } : apt))
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      setAppointments(prev => prev.filter(apt => apt._id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'In Progress': return <Badge variant="warning">In Progress</Badge>;
      case 'Cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="outline">{status || 'Scheduled'}</Badge>;
    }
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const pName = apt.patient?.name || '';
      const dName = apt.doctor?.name || '';
      const spec = apt.doctor?.specialty || '';
      const type = apt.type || '';

      const matchSearch =
        pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt._id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || apt.status === statusFilter;
      const matchType = typeFilter === 'All' || apt.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [appointments, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const todayStr = new Date().toDateString();
  const todaysCount = appointments.filter(a => a.date && new Date(a.date).toDateString() === todayStr).length;
  const pendingCount = appointments.filter(a => a.status === 'Scheduled' || a.status === 'In Progress').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Appointments Schedule</h2>
          <p className="text-slate-500 text-sm mt-1">Manage, schedule and track all hospital consultations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchAppointments} disabled={loading} className="bg-white border-slate-200">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
            <Plus className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{appointments.length}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Booked</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{todaysCount}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today's Appointments</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{pendingCount}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending / Scheduled</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{completedCount}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by patient, doctor, specialty or type..."
            className="pl-10 h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
          >
            <option value="All">All Types</option>
            <option value="Checkup">Checkup</option>
            <option value="Consultation">Consultation</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Video Consult">Video Consult</option>
          </select>
        </div>
      </div>

      {/* Main Appointments List Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f6c4f] border-r-transparent mb-2" />
            <p className="text-slate-400 text-sm font-medium">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
            <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-lg">No appointments found</h3>
            <p className="text-slate-400 text-sm">
              {searchTerm || statusFilter !== 'All' || typeFilter !== 'All'
                ? 'Try adjusting your search query or filters.'
                : 'No appointments have been booked yet.'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt, i) => {
            const aptDate = apt.date ? new Date(apt.date) : new Date(apt.createdAt);
            const month = aptDate.toLocaleString('default', { month: 'short' });
            const day = aptDate.getDate();
            const year = aptDate.getFullYear();
            const isCompleted = apt.status === 'Completed' || apt.status === 'Cancelled';

            return (
              <motion.div
                key={apt._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className={`border-slate-100 shadow-sm hover:shadow-md transition-all ${isCompleted ? 'opacity-85' : ''}`}>
                  <CardContent className="p-5 flex flex-col md:flex-row items-center gap-5">
                    
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center h-20 w-24 rounded-2xl bg-[#0f6c4f]/10 text-[#0f6c4f] text-center shrink-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider">{month} {year}</span>
                      <span className="font-bold text-2xl leading-none mt-1">{day}</span>
                    </div>

                    {/* Details Block */}
                    <div className="flex-1 space-y-2 w-full text-center md:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-800 text-base flex items-center justify-center md:justify-start gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            {apt.patient?.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-xs font-semibold text-[#0f6c4f] flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
                            <Stethoscope className="h-3.5 w-3.5" />
                            {apt.doctor?.name || 'Assigned Doctor'}
                            {apt.doctor?.specialty && <span className="text-slate-400 font-normal">({apt.doctor.specialty})</span>}
                          </p>
                        </div>

                        <div className="flex items-center justify-center md:justify-end gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                            ₹{apt.fee || 500} ({apt.paymentMethod || 'Cash'})
                          </span>
                          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                            {apt.type || 'Checkup'}
                          </span>
                        </div>
                      </div>

                      {/* Sub-info Row */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-1.5 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{apt.timeSlot || '09:00 AM'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          {apt.type === 'Video Consult' ? <Video className="h-3.5 w-3.5 text-blue-500" /> : <MapPin className="h-3.5 w-3.5 text-amber-500" />}
                          <span>{apt.type === 'Video Consult' ? 'Online Video' : 'Hospital Visit'}</span>
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          ID: {apt._id.slice(-6).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions Dropdown */}
                    <div className="shrink-0 flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-between md:justify-end">
                      {/* Update Status Select */}
                      <select
                        value={apt.status || 'Scheduled'}
                        onChange={(e) => handleUpdateStatus(apt._id, e.target.value)}
                        className="h-8 px-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {/* View Slip */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isCompleted}
                        onClick={() => !isCompleted && setSelectedSlipApt(apt)}
                        title={isCompleted ? `Slip N/A for ${apt.status}` : 'View Token Slip'}
                        className={`h-8 px-3 text-xs rounded-xl ${
                          isCompleted
                            ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                            : 'border-[#0f6c4f] text-[#0f6c4f] hover:bg-[#0f6c4f] hover:text-white'
                        }`}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        {isCompleted ? 'Slip N/A' : 'Slip'}
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === apt._id}
                        onClick={() => handleDelete(apt._id)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-xl"
                        title="Delete Appointment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Book New Appointment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
                {/* Select Patient */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Select Patient <span className="text-red-400">*</span></label>
                  <select
                    required
                    value={bookingData.patientId}
                    onChange={(e) => setBookingData({ ...bookingData, patientId: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
                  >
                    <option value="" disabled>Select patient</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.phone || p.email})</option>
                    ))}
                  </select>
                </div>

                {/* Complaint Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Chief Complaint / Symptom <span className="text-red-400">*</span></label>
                  <select
                    required
                    value={bookingData.complaint}
                    onChange={(e) => setBookingData({ ...bookingData, complaint: e.target.value, doctorId: '' })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
                  >
                    <option value="" disabled>Select problem</option>
                    {complaintSpecialtyMap.map(({ complaint, specialty }) => (
                      <option key={complaint} value={complaint}>
                        {complaint}{specialty ? ` → ${specialty}` : ' → All Doctors'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Doctor (Filtered) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Select Doctor <span className="text-red-400">*</span></label>
                  <select
                    required
                    disabled={!bookingData.complaint}
                    value={bookingData.doctorId}
                    onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                    className={`w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40 ${
                      !bookingData.complaint ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'text-slate-700'
                    }`}
                  >
                    <option value="" disabled>
                      {!bookingData.complaint ? 'Select complaint first' : filteredDoctors.length === 0 ? 'No doctor found' : 'Select doctor'}
                    </option>
                    {filteredDoctors.map(d => (
                      <option key={d._id} value={d._id}>{d.name} ({d.specialty || 'General'})</option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Date <span className="text-red-400">*</span></label>
                    <Input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value, timeSlot: '' })}
                      className="h-10 border-slate-200 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Time Slot <span className="text-red-400">*</span></label>
                    <select
                      required
                      value={bookingData.timeSlot}
                      onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
                    >
                      <option value="" disabled>Select time</option>
                      {generateTimeSlots().map(slot => {
                        const isPast = isSlotPassed(slot, bookingData.date);
                        return (
                          <option
                            key={slot}
                            value={slot}
                            disabled={isPast}
                            className={isPast ? 'bg-slate-100 text-slate-400 font-semibold italic' : 'text-slate-800 font-medium'}
                          >
                            {slot} {isPast ? '(Closed ⛔)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Type, Fee & Payment */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Type</label>
                    <select
                      value={bookingData.type}
                      onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                      className="w-full h-10 px-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white"
                    >
                      <option value="Checkup">Checkup</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Video Consult">Video</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Fee (₹)</label>
                    <Input
                      type="number"
                      required
                      value={bookingData.fee}
                      onChange={(e) => setBookingData({ ...bookingData, fee: Number(e.target.value) })}
                      className="h-10 border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Payment</label>
                    <select
                      value={bookingData.paymentMethod}
                      onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                      className="w-full h-10 px-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={bookingLoading} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Appointment Slip Modal */}
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
                  className="p-1.5 bg-slate-50 text-slate-600 hover:text-[#0f6c4f] hover:bg-emerald-50 rounded-lg transition-all"
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

              {/* Printable Slip Content */}
              <div className="p-5 print:p-0" id="printable-slip">
                <div className="text-center pb-4 border-b border-dashed border-slate-200">
                  <div className="inline-flex items-center gap-1.5 mb-1">
                    <img src="/applogo.png" alt="Logo" className="h-6 w-6 object-contain" />
                    <span className="font-bold text-lg tracking-tight text-[#0d2a21]">Medisphere</span>
                  </div>
                  <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold leading-none">Hospital & Research Center</p>
                  <div className="mt-2.5 inline-block bg-[#0f6c4f]/10 text-[#0f6c4f] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Appointment Token Slip
                  </div>
                </div>

                <div className="my-4 text-center bg-slate-50/50 rounded-xl py-2.5 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Token Number</span>
                  <h1 className="text-3xl font-black text-[#0f6c4f] mt-0.5 font-mono">
                    #{selectedSlipApt._id.slice(-4).toUpperCase()}
                  </h1>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Patient</span>
                    <span className="font-bold text-slate-800">{selectedSlipApt.patient?.name || 'Patient'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Doctor</span>
                    <span className="font-bold text-slate-800">{selectedSlipApt.doctor?.name || 'Doctor'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Specialty</span>
                    <span className="font-bold text-slate-800">{selectedSlipApt.doctor?.specialty || 'General'}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-medium text-slate-400">Date & Time</span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedSlipApt.date).toLocaleDateString()} • {selectedSlipApt.timeSlot}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-dashed border-slate-200">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-slate-400">Fee Amount</span>
                      <span className="font-bold text-slate-800">₹{selectedSlipApt.fee || 500}.00</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-slate-400">Payment Mode</span>
                      <span className="font-bold text-slate-800">{selectedSlipApt.paymentMethod || 'Cash'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-center pt-3 border-t border-slate-100 text-[9px] text-slate-400">
                  <p className="font-medium">Please report 15 mins before time.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
