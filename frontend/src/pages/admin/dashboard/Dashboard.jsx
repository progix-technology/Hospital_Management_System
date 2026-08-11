import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import {
  Users, Activity, TrendingUp, IndianRupee, Stethoscope, UserCheck,
  Calendar, Clock, CheckCircle2, AlertCircle, RefreshCw, ArrowUpRight,
  ShieldCheck, FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalTechs: 0,
    totalAppointments: 0,
    todaysAppointmentsCount: 0,
    pendingAppointmentsCount: 0,
    completedAppointmentsCount: 0,
    totalRevenue: 0,
    monthlyData: [],
    recentPatients: [],
    recentAppointments: []
  });

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/appointments/admin/dashboard');
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch admin dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const {
    totalPatients,
    totalDoctors,
    totalTechs,
    totalAppointments,
    todaysAppointmentsCount,
    pendingAppointmentsCount,
    completedAppointmentsCount,
    totalRevenue,
    monthlyData,
    recentPatients,
    recentAppointments
  } = dashboardData;

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: `${totalAppointments} total appointments booked`
    },
    {
      title: "Active Patients",
      value: totalPatients.toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: `${recentPatients.length} recent registrations`
    },
    {
      title: "Today's Appointments",
      value: todaysAppointmentsCount.toString(),
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: `${pendingAppointmentsCount} pending / in progress`
    },
    {
      title: "Medical Staff",
      value: (totalDoctors + totalTechs).toString(),
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: `${totalDoctors} Doctors • ${totalTechs} Lab Techs`
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'In Progress': return <Badge variant="warning">In Progress</Badge>;
      case 'Cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="outline">{status || 'Scheduled'}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Admin Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time overview of hospital operations, staff, patients & revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchDashboardStats} disabled={loading} variant="outline" className="bg-white border-slate-200">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
          </Button>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-slate-800 tracking-tight">
                    {loading ? '...' : stat.value}
                  </span>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    {stat.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue & Appointments Chart */}
        <Card className="lg:col-span-4 border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Revenue & Booking Trends</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Monthly revenue collected from consultations</p>
            </div>
            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-100 font-semibold">
              Live DB Data
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f6c4f" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f6c4f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0f6c4f" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Operational Overview & Quick Metrics */}
        <Card className="lg:col-span-3 border-slate-100 shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-lg font-bold text-slate-800">Hospital Metrics</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Real-time status breakdown</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Patients Count */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600">Registered Patients</span>
                <span className="text-blue-600 font-bold">{totalPatients} Patients</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(totalPatients * 10, 100)}%` }}></div>
              </div>
            </div>

            {/* Doctors Count */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600">Active Doctors</span>
                <span className="text-teal-600 font-bold">{totalDoctors} Doctors</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(totalDoctors * 15, 100)}%` }}></div>
              </div>
            </div>

            {/* Lab Technicians */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600">Lab Technicians</span>
                <span className="text-purple-600 font-bold">{totalTechs} Technicians</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(totalTechs * 25, 100)}%` }}></div>
              </div>
            </div>

            {/* Completed Consultations */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600">Completed Consultations</span>
                <span className="text-emerald-600 font-bold">{completedAppointmentsCount} / {totalAppointments}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAppointments > 0 ? (completedAppointmentsCount / totalAppointments) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Pending Appointments */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-600">Pending Appointments</span>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                {pendingAppointmentsCount} Pending
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Recent Appointments & Recent Patients */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Appointments Table */}
        <Card className="lg:col-span-4 border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Recent Appointments</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Latest booked appointments in the system</p>
            </div>
            <Link to="/admin/appointments" className="text-xs font-bold text-[#0f6c4f] hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentAppointments.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No appointments booked yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Patient</th>
                      <th className="px-5 py-3 font-semibold">Doctor</th>
                      <th className="px-5 py-3 font-semibold">Date & Time</th>
                      <th className="px-5 py-3 font-semibold">Fee</th>
                      <th className="px-5 py-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentAppointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-800 text-xs">{apt.patient?.name || 'Patient'}</p>
                          <p className="text-[10px] text-slate-400">{apt.type || 'Consultation'}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-700 text-xs">{apt.doctor?.name || 'Doctor'}</p>
                          <p className="text-[10px] text-slate-400">{apt.doctor?.specialty || 'General'}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600">
                          <div className="font-medium">
                            {apt.date ? new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                          </div>
                          <div className="text-[10px] text-slate-400">{apt.timeSlot || '09:00 AM'}</div>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-slate-800">
                          ₹{apt.fee || 500}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {getStatusBadge(apt.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Registered Patients */}
        <Card className="lg:col-span-3 border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Newly Registered Patients</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Recent patient account creations</p>
            </div>
            <Link to="/admin/patients" className="text-xs font-bold text-[#0f6c4f] hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            {recentPatients.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No patients registered yet.</div>
            ) : (
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {patient.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{patient.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{patient.email || patient.phone || 'No email'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        Patient
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1">
                        {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
