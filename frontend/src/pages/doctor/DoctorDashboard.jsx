import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Users, Calendar, Clock, Activity, FileText, CheckCircle2, X, Plus,
  Search, ArrowRight, ChevronRight, UserPlus, Pill, Microscope,
  TrendingUp, MapPin, Sparkles, AlertCircle, FilePlus, ChevronDown, User,
  Filter, CheckCircle, Flame, HeartHandshake, Zap, ArrowUpRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

function calculateAge(dob) {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 'N/A';
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'Doctor', specialty: 'General Physician', _id: null });
  const [dashboardStats, setDashboardStats] = useState(null);
  const [allDoctorAppointments, setAllDoctorAppointments] = useState([]);
  const [allPatientsList, setAllPatientsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table Filter & Search State
  const [scheduleFilter, setScheduleFilter] = useState('All');
  const [scheduleSearch, setScheduleSearch] = useState('');

  // Consultation Modal State
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [modalPatients, setModalPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [fetchingPatients, setFetchingPatients] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.name) {
      setUserData(userInfo);
      fetchDashboardData(userInfo._id);
    }
  }, []);

  const fetchDashboardData = async (doctorId) => {
    try {
      setLoading(true);
      const [statsRes, aptsRes, patientsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/appointments/doctor/${doctorId}/dashboard`).catch(() => ({ data: null })),
        axios.get(`http://localhost:5000/api/appointments/doctor/${doctorId}`).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/users/patients').catch(() => ({ data: [] }))
      ]);

      setDashboardStats(statsRes.data);
      setAllDoctorAppointments(aptsRes.data || []);
      setAllPatientsList(patientsRes.data || []);
    } catch (error) {
      console.error('Error fetching doctor dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConsultModal = async () => {
    setIsConsultModalOpen(true);
    setFetchingPatients(true);
    try {
      const { data: allPatients } = await axios.get('http://localhost:5000/api/users/patients');
      setModalPatients(allPatients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setFetchingPatients(false);
    }
  };

  const handleStartConsultation = () => {
    if (selectedPatientId) {
      setIsConsultModalOpen(false);
      navigate(`/doctor/patients/${selectedPatientId}`);
    }
  };

  // Schedule list & filtering
  const scheduleList = useMemo(() => {
    return dashboardStats?.schedule || [];
  }, [dashboardStats]);

  const filteredSchedule = useMemo(() => {
    const list = scheduleList.filter(apt => {
      const pName = apt.patient?.name || '';
      const matchSearch = pName.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
                          (apt.type || '').toLowerCase().includes(scheduleSearch.toLowerCase());
      const matchFilter = scheduleFilter === 'All' || apt.status === scheduleFilter;
      return matchSearch && matchFilter;
    });

    // Pending/Scheduled/In Progress appointments stay at TOP, Completed/Cancelled move to BOTTOM
    return list.sort((a, b) => {
      const isDoneA = a.status === 'Completed' || a.status === 'Cancelled' ? 1 : 0;
      const isDoneB = b.status === 'Completed' || b.status === 'Cancelled' ? 1 : 0;
      return isDoneA - isDoneB;
    });
  }, [scheduleList, scheduleSearch, scheduleFilter]);

  // Dynamic Recent Patients (Extracted from DB)
  const recentPatientsData = useMemo(() => {
    if (allPatientsList.length > 0) {
      return allPatientsList.slice(0, 5).map((p, idx) => ({
        _id: p._id,
        name: p.name,
        id: `PT-${p._id.slice(-4).toUpperCase()}`,
        info: `${calculateAge(p.dateOfBirth)} Y, ${p.gender || 'Male'}`,
        time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent',
        bg: ['bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'][idx % 5]
      }));
    }
    return [];
  }, [allPatientsList]);

  // Dynamic Pending Lab Reports (Extracted from Patients with lab tests in DB)
  const pendingLabReportsData = useMemo(() => {
    const reports = [];
    allPatientsList.forEach(p => {
      const tests = p.clinicalRecord?.labTests || [];
      tests.forEach(t => {
        if (t && t.trim()) {
          const hasPdf = t.includes('###PDF_DATA###');
          let testName = t;
          if (hasPdf) testName = t.split('###PDF_DATA###')[0].split('(Attached')[0].trim();

          reports.push({
            patientName: p.name,
            patientId: p._id,
            test: testName || 'Laboratory Test',
            date: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Today',
            tag: hasPdf ? 'Urgent' : 'Review',
            tagBg: hasPdf ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
          });
        }
      });
    });
    return reports.slice(0, 4);
  }, [allPatientsList]);

  // Dynamic Consultations Donut Chart Data
  const consultationPieData = useMemo(() => {
    const list = allDoctorAppointments.length > 0 ? allDoctorAppointments : scheduleList;
    const completed = list.filter(s => s.status === 'Completed').length;
    const upcoming = list.filter(s => s.status === 'Scheduled' || !s.status).length;
    const inProgress = list.filter(s => s.status === 'In Progress').length;
    const cancelled = list.filter(s => s.status === 'Cancelled').length;

    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Upcoming', value: upcoming, color: '#3b82f6' },
      { name: 'In Progress', value: inProgress, color: '#f59e0b' },
      { name: 'Cancelled', value: cancelled, color: '#ef4444' },
    ];
  }, [allDoctorAppointments, scheduleList]);

  const totalConsultationsCount = useMemo(() => {
    return consultationPieData.reduce((acc, item) => acc + item.value, 0);
  }, [consultationPieData]);

  // Dynamic Weekly Consultations Line Chart Data
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const countMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    allDoctorAppointments.forEach(app => {
      const appDate = app.date ? new Date(app.date) : new Date();
      const dayName = days[appDate.getDay()];
      if (countMap[dayName] !== undefined) {
        countMap[dayName] += 1;
      }
    });

    return [
      { day: 'Mon', count: countMap['Mon'] },
      { day: 'Tue', count: countMap['Tue'] },
      { day: 'Wed', count: countMap['Wed'] },
      { day: 'Thu', count: countMap['Thu'] },
      { day: 'Fri', count: countMap['Fri'] },
      { day: 'Sat', count: countMap['Sat'] },
      { day: 'Sun', count: countMap['Sun'] },
    ];
  }, [allDoctorAppointments]);

  // Dynamic Recent Activity Feed
  const recentActivityFeed = useMemo(() => {
    if (dashboardStats?.recentActivity && dashboardStats.recentActivity.length > 0) {
      return dashboardStats.recentActivity.slice(0, 4).map(act => ({
        name: act.patient?.name || 'Patient Consultation',
        act: `Status: ${act.status || 'Scheduled'} (${act.type || 'Checkup'})`,
        time: act.timeSlot || '09:30 AM',
        icon: act.status === 'Completed' ? CheckCircle2 : Calendar,
        color: act.status === 'Completed' ? 'text-emerald-600 bg-emerald-50' : 'text-[#0f6c4f] bg-emerald-50'
      }));
    }

    return [
      { name: 'Raj Tiwari', act: 'Consultation completed', time: '12:27 PM', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
      { name: 'Priya Sharma', act: 'Lab report uploaded', time: '11:45 AM', icon: FileText, color: 'text-blue-600 bg-blue-50' },
      { name: 'Amit Gupta', act: 'Prescription generated', time: '10:30 AM', icon: Pill, color: 'text-rose-600 bg-rose-50' },
      { name: 'Neha Verma', act: 'Appointment booked', time: '09:15 AM', icon: Calendar, color: 'text-purple-600 bg-purple-50' }
    ];
  }, [dashboardStats]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#0f6c4f] border-r-transparent mb-3 shadow-md" />
        <p className="text-slate-400 text-sm font-semibold tracking-wide">Loading Doctor Workspace...</p>
      </div>
    );
  }

  const doctorName = userData.name?.startsWith('Dr.') ? userData.name : `Dr. ${userData.name}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-16 max-w-[1600px] mx-auto"
    >
      
      {/* 1. TOP HERO WELCOME BANNER (Divided into 2 Separate Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Main Welcome Banner & Image Placeholder */}
        <div className="lg:col-span-8 xl:col-span-9 bg-gradient-to-r from-white via-slate-50/50 to-emerald-50/30 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-6 transition-all">
          
          {/* Decorative Background Accents */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl pointer-events-none -z-0" />

          {/* Left Welcome Info */}
          <div className="space-y-4 max-w-xl z-10 w-full text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-[#0f6c4f] text-xs font-bold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> Doctor Portal Overview
            </div>

            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug flex items-center justify-center sm:justify-start gap-2">
                Good morning, {doctorName} <span>👋</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                You have <strong className="text-slate-900 font-bold">{dashboardStats?.todaysAppointments || 0} appointments</strong> scheduled today and <strong className="text-slate-900 font-bold">{dashboardStats?.pendingReports || 0} lab reports</strong> awaiting your review.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              <Link to="/doctor/appointments">
                <Button className="bg-[#0f6c4f] hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center gap-2 transition-all hover:scale-105">
                  <Calendar className="h-4 w-4" /> View Schedule
                </Button>
              </Link>
              <Button
                onClick={handleOpenConsultModal}
                variant="outline"
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:scale-105"
              >
                <Activity className="h-4 w-4 text-[#0f6c4f]" /> Start Consultation
              </Button>
            </div>
          </div>

          {/* Doctor Vector Image (Aligned to Bottom Edge - Larger Size) */}
          <div className="hidden xl:flex items-end justify-center w-84 h-64 relative shrink-0 -mb-10 translate-y-3 self-end">
            <img
              src="/Doctor/doctorsvg.png"
              alt="Doctor Illustration"
              className="h-full w-auto object-contain object-bottom drop-shadow-md"
            />
          </div>

        </div>

        {/* Right Standalone Card: Clinic Hours & Location */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center space-y-4 text-xs text-slate-600 transition-all hover:shadow-md">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#0f6c4f] flex items-center justify-center shrink-0 font-bold border border-emerald-200 shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Clinic Hours</p>
              <p className="text-slate-500 font-semibold mt-0.5 text-[11px]">09:00 AM - 06:00 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold border border-blue-200 shadow-2xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Clinic OPD</p>
              <p className="text-slate-500 font-semibold mt-0.5 text-[11px]">Medisphere OPD - Room 102</p>
            </div>
          </div>
        </div>

      </div>

      {/* 2. TOP 4 KPI STAT CARDS ROW (Static Icons, No Hover Background Changes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Schedule */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Schedule</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight leading-none block">
              {dashboardStats?.todaysAppointments || 0}
            </span>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" /> Scheduled today
            </span>
          </div>
          <div className="h-13 w-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Total Patients */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Patients</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight leading-none block">
              {dashboardStats?.totalPatients || allPatientsList.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3.5 w-3.5" /> Registered in DB
            </span>
          </div>
          <div className="h-13 w-13 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Pending Reports */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Reports</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight leading-none block">
              {pendingLabReportsData.length || dashboardStats?.pendingReports || 0}
            </span>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3.5 w-3.5" /> Awaiting review
            </span>
          </div>
          <div className="h-13 w-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Consultations */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Consultations</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight leading-none block">
              {dashboardStats?.completedConsultations || 0}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed Today
            </span>
          </div>
          <div className="h-13 w-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* 3. MIDDLE ROW (Today's Schedule Table | Quick Actions | Recent Patients) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Today's Schedule Table (Wide - 6 Cols) */}
        <Card className="lg:col-span-6 border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Today's Schedule</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Live appointments queue for today</p>
              </div>

              {/* Status Filter Badges */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {['All', 'Scheduled', 'In Progress', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setScheduleFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      scheduleFilter === st
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredSchedule.length === 0 ? (
                <div className="py-14 text-center text-slate-400 text-xs font-semibold">
                  No appointments scheduled for today.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/80 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 font-bold">Time</th>
                        <th className="px-4 py-3 font-bold">Patient Details</th>
                        <th className="px-4 py-3 font-bold">Type</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 text-right font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSchedule.slice(0, 5).map((apt, idx) => {
                        const ptId = apt.patient?._id || apt.patient;
                        const patientFull = allPatientsList.find(p => p._id === ptId) || apt.patient;
                        const hasLabReport = patientFull?.clinicalRecord?.labTests?.some(t => t.includes('###PDF_DATA###') || t.includes('- (') || t.length > 0);

                        return (
                          <tr
                            key={apt._id || idx}
                            onClick={() => apt.patient?._id && navigate(`/doctor/patients/${apt.patient._id}`)}
                            className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                          >
                            {/* Time */}
                            <td className="px-4 py-3.5 font-bold text-slate-800">
                              <div className="text-xs">{apt.timeSlot || '09:30 AM'}</div>
                              <div className="text-[10px] text-slate-400 font-normal mt-0.5">09:50 AM</div>
                            </td>

                            {/* Patient */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-emerald-100 text-[#0f6c4f] flex items-center justify-center font-bold text-xs shrink-0">
                                  {apt.patient?.name?.charAt(0).toUpperCase() || 'P'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 group-hover:text-[#0f6c4f] transition-colors">
                                    {apt.patient?.name || 'Patient'}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    PT-{apt.patient?._id?.slice(-4).toUpperCase() || '1001'} • {apt.patient?.gender || 'Male'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Type Pill */}
                            <td className="px-4 py-3.5">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                apt.type === 'Follow-up'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : apt.type === 'New Patient'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-purple-50 text-purple-700 border border-purple-100'
                              }`}>
                                {apt.type || 'Checkup'}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                apt.status === 'In Progress'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : apt.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {apt.status || 'Scheduled'}
                              </span>
                            </td>

                            {/* Action Button */}
                            <td className="px-4 py-3.5 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3.5 text-[11px] font-bold text-slate-700 bg-white border-slate-200 hover:bg-[#0f6c4f] hover:text-white transition-all rounded-xl shadow-2xs inline-flex items-center gap-1"
                              >
                                View <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </div>

          <div className="p-3.5 border-t border-slate-100 text-center bg-slate-50/50">
            <Link to="/doctor/appointments" className="text-xs font-bold text-[#0f6c4f] hover:underline flex items-center justify-center gap-1">
              View Full Schedule <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Center Column: Quick Actions (3 Cols) */}
        <Card className="lg:col-span-3 border-slate-100 shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <button
              onClick={handleOpenConsultModal}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50 border border-slate-100 transition-all text-xs group shadow-2xs hover:border-emerald-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-[#0f6c4f] flex items-center justify-center font-bold shadow-inner">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-bold text-slate-800 group-hover:text-[#0f6c4f]">New Consultation</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0f6c4f]" />
            </button>

            <Link to="/doctor/patients" className="block">
              <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-blue-50 border border-slate-100 transition-all text-xs group shadow-2xs hover:border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-inner">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-slate-800 group-hover:text-blue-700">Add Patient</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-700" />
              </div>
            </Link>

            <Link to="/doctor/prescriptions" className="block">
              <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-rose-50 border border-slate-100 transition-all text-xs group shadow-2xs hover:border-rose-200">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-inner">
                    <Pill className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-slate-800 group-hover:text-rose-700">Write Prescription</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-rose-700" />
              </div>
            </Link>

            <Link to="/doctor/reports" className="block">
              <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50 border border-slate-100 transition-all text-xs group shadow-2xs hover:border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-inner">
                    <Microscope className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-slate-800 group-hover:text-purple-700">Request Lab Test</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-700" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Right Column: Recent Patients (Dynamic from DB) */}
        <Card className="lg:col-span-3 border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Recent Patients</CardTitle>
            <Link to="/doctor/patients" className="text-xs font-bold text-[#0f6c4f] hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {recentPatientsData.length === 0 ? (
              <div className="py-8 text-center text-slate-400">No patients found.</div>
            ) : (
              recentPatientsData.map((pt, idx) => (
                <div key={pt._id || idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full ${pt.bg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {pt.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{pt.name}</h4>
                      <p className="text-[10px] text-slate-400">{pt.id} • {pt.info}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{pt.time}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>

      {/* 4. BOTTOM GRID (Dynamic Pending Lab Reports | Consultations Overview | Weekly Consultations | Recent Activity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Card 1: Pending Lab Reports (Dynamic DB) */}
        <Card className="border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">Pending Lab Reports</CardTitle>
              <Link to="/doctor/reports" className="text-[11px] font-bold text-[#0f6c4f] hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              {pendingLabReportsData.length === 0 ? (
                <div className="py-8 text-center text-slate-400">No pending lab reports.</div>
              ) : (
                pendingLabReportsData.map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                        <Microscope className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{report.patientName}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{report.test}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${report.tagBg}`}>
                      {report.tag}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </div>
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <Link to="/doctor/reports" className="text-xs font-bold text-[#0f6c4f] hover:underline flex items-center justify-center gap-1">
              View All Reports <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 2: Consultations Overview (Dynamic Donut Chart) */}
        <Card className="border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">Consultations Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[140px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={consultationPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {consultationPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900 leading-none">{totalConsultationsCount}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Total</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-100">
                {consultationPieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <Link to="/doctor/appointments" className="text-xs font-bold text-[#0f6c4f] hover:underline flex items-center justify-center gap-1">
              View Analytics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Weekly Consultations (Dynamic Line Chart) */}
        <Card className="border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">Weekly Consultations</CardTitle>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                This Week <ChevronDown className="h-3 w-3" />
              </span>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="count" stroke="#0f6c4f" strokeWidth={3} dot={{ r: 4, fill: '#0f6c4f' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </div>
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <Link to="/doctor/appointments" className="text-xs font-bold text-[#0f6c4f] hover:underline flex items-center justify-center gap-1">
              View Full Analytics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 4: Recent Activity (Dynamic Feed) */}
        <Card className="border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">Recent Activity</CardTitle>
              <span className="text-[11px] font-bold text-[#0f6c4f] hover:underline cursor-pointer">
                View All
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              {recentActivityFeed.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[11px] truncate max-w-[120px]">{item.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{item.act}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400">{item.time}</span>
                  </div>
                );
              })}
            </CardContent>
          </div>
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <span className="text-xs font-bold text-slate-400">Live Activity Feed</span>
          </div>
        </Card>

      </div>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isConsultModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-base">Select Patient to Start Consultation</h3>
                <button onClick={() => setIsConsultModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {fetchingPatients ? (
                  <div className="py-8 text-center text-slate-400">Loading patients...</div>
                ) : modalPatients.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">No active patients found for consultation.</div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Choose Patient</label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white"
                    >
                      <option value="">Select patient</option>
                      {modalPatients.map(p => (
                        <option key={p._id} value={p._id}>{p.name} ({p.phone || p.email})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <Button variant="outline" onClick={() => setIsConsultModalOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleStartConsultation}
                    disabled={!selectedPatientId}
                    className="bg-[#0f6c4f] hover:bg-emerald-800 text-white"
                  >
                    Start Consultation
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
