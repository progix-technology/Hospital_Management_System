import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, IndianRupee, Users, Activity, Stethoscope, RefreshCw,
  Calendar, CheckCircle2, Clock, PieChart as PieIcon, BarChart2, Filter
} from 'lucide-react';
import axios from 'axios';

const COLORS = ['#0f6c4f', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, docRes, patRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/users/doctors').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/users/patients').catch(() => ({ data: [] }))
      ]);

      setAppointments(aptRes.data || []);
      setDoctors(docRes.data || []);
      setPatients(patRes.data || []);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Calculate Monthly Revenue & Appointment Volume
  const monthlyAnalytics = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = { name: monthNames[d.getMonth()], revenue: 0, appointments: 0 };
    }

    appointments.forEach(app => {
      const appDate = app.date ? new Date(app.date) : (app.createdAt ? new Date(app.createdAt) : new Date());
      const key = `${monthNames[appDate.getMonth()]} ${appDate.getFullYear()}`;
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += (Number(app.fee) || 500);
        monthlyMap[key].appointments += 1;
      }
    });

    return Object.values(monthlyMap);
  }, [appointments]);

  // 2. Day of Week Traffic Analytics
  const dayOfWeekTraffic = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const countMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    appointments.forEach(app => {
      const appDate = app.date ? new Date(app.date) : new Date();
      const dayName = days[appDate.getDay()];
      if (countMap[dayName] !== undefined) {
        countMap[dayName] += 1;
      }
    });

    return [
      { name: 'Mon', count: countMap['Mon'] },
      { name: 'Tue', count: countMap['Tue'] },
      { name: 'Wed', count: countMap['Wed'] },
      { name: 'Thu', count: countMap['Thu'] },
      { name: 'Fri', count: countMap['Fri'] },
      { name: 'Sat', count: countMap['Sat'] },
      { name: 'Sun', count: countMap['Sun'] },
    ];
  }, [appointments]);

  // 3. Specialty Distribution
  const specialtyDistribution = useMemo(() => {
    const map = {};
    appointments.forEach(app => {
      const spec = app.doctor?.specialty || 'General Medicine';
      map[spec] = (map[spec] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  // 4. Payment Method Breakdown
  const paymentMethodData = useMemo(() => {
    const map = { Cash: 0, Card: 0, UPI: 0 };
    appointments.forEach(app => {
      const pm = app.paymentMethod || 'Cash';
      if (map[pm] !== undefined) map[pm] += 1;
      else map[pm] = 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  // Key KPI Numbers
  const totalRevenue = useMemo(() => {
    return appointments.reduce((sum, a) => sum + (Number(a.fee) || 500), 0);
  }, [appointments]);

  const completedCount = useMemo(() => {
    return appointments.filter(a => a.status === 'Completed').length;
  }, [appointments]);

  const completionRate = appointments.length > 0
    ? Math.round((completedCount / appointments.length) * 100)
    : 0;

  const avgFee = appointments.length > 0
    ? Math.round(totalRevenue / appointments.length)
    : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Analytics & Performance</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time hospital metrics, financial insights and appointment distribution.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="bg-white border-slate-200">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Analytics
        </Button>
      </div>

      {/* Top 4 Key KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Live Consultation Earnings
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <IndianRupee className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Consultations</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{appointments.length}</p>
            <p className="text-[11px] font-semibold text-blue-600 mt-1">Booked in System</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Consultation Fee</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₹{avgFee}</p>
            <p className="text-[11px] font-semibold text-purple-600 mt-1">Per Patient Visit</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <BarChart2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{completionRate}%</p>
            <p className="text-[11px] font-semibold text-amber-600 mt-1">{completedCount} Completed</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
              <span>Financial Revenue Growth (₹)</span>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50">Monthly Data</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(val) => [`₹${val}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#0f6c4f" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Traffic Line Chart */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
              <span>Appointment Traffic by Day of Week</span>
              <Badge variant="outline" className="text-blue-700 bg-blue-50">Day Distribution</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dayOfWeekTraffic}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row 2: Specialty & Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialty Distribution Pie Chart */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-purple-600" /> Specialty Demand Share
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {specialtyDistribution.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-medium">
                No specialty data recorded yet.
              </div>
            ) : (
              <div className="h-[280px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specialtyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {specialtyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Bar Chart */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-emerald-600" /> Payment Methods Preferred
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </motion.div>
  );
}
