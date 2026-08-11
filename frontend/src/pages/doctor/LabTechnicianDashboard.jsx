import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Microscope, FlaskConical, FileCheck2, FileCode, Search, Upload, Eye,
  CheckCircle2, Clock, AlertTriangle, ArrowRight, Sparkles, Database, Plus,
  IndianRupee, TrendingUp, Calendar, DollarSign, BarChart3, PieChart as PieChartIcon,
  ArrowUpRight, ArrowDownRight, Layers, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

export default function LabTechnicianDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueTimeframe, setRevenueTimeframe] = useState('monthly'); // 'monthly' | 'weekly' | 'category'

  // Dynamic calculated metrics (100% from MongoDB)
  const [metrics, setMetrics] = useState({
    totalLabTests: 0,
    pendingCount: 0,
    completedCount: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    topTests: [],
    monthlyChartData: [],
    weeklyChartData: [],
    categoryShareData: []
  });

  const testPricesMap = {
    'Complete Blood Count (CBC)': 350,
    'Lipid Profile Panel': 800,
    'Thyroid Profile (TSH)': 750,
    'Liver Function Test (LFT)': 800,
    'Fasting Blood Sugar (FBS)': 200,
    'Renal Function Test (KFT)': 850,
    'Urine Routine & Microscopy': 250,
    'HbA1c Glycated Hemoglobin': 600,
    'Vitamin D (25-OH)': 1200,
    'Vitamin B12 Serum': 950,
    'D-Dimer Quantitative': 1400,
    'CRP (C-Reactive Protein)': 450,
    'Dengue NS1 Antigen': 600,
    'Malaria Antigen Smear': 350
  };

  const getTestPrice = (testRawName) => {
    const cleanName = testRawName.split('###PDF_DATA###')[0].split('(Attached PDF:')[0].trim();
    for (const [key, price] of Object.entries(testPricesMap)) {
      if (cleanName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName.toLowerCase())) {
        return price;
      }
    }
    return 500;
  };

  useEffect(() => {
    fetchPatientsAndCalculate();
  }, []);

  const fetchPatientsAndCalculate = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/users/patients');
      const allPatients = data || [];
      const assignedTechPatients = allPatients.filter(p =>
        p.clinicalRecord?.labTests && p.clinicalRecord.labTests.length > 0
      );

      assignedTechPatients.sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setPatients(assignedTechPatients);

      let pending = 0;
      let completed = 0;
      let totalTests = 0;
      let todayRev = 0;
      let weeklyRev = 0;
      let monthlyRev = 0;

      const testFrequencyMap = {};
      const categoryRevMap = {
        'Hematology (CBC)': { value: 0, color: '#0f6c4f' },
        'Biochemistry (Lipid/LFT)': { value: 0, color: '#2563eb' },
        'Endocrinology (TSH)': { value: 0, color: '#9333ea' },
        'Diabetology (FBS)': { value: 0, color: '#d97706' },
        'Clinical Pathology (Urine)': { value: 0, color: '#dc2626' }
      };

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyMap = {};
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyMap = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mName = monthNames[d.getMonth()];
        monthlyMap[mName] = { month: mName, revenue: 0, tests: 0 };
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());

      assignedTechPatients.forEach(p => {
        const pDate = new Date(p.updatedAt || p.createdAt || Date.now());
        const mName = monthNames[pDate.getMonth()];
        const dayName = dayNames[pDate.getDay()];

        const isToday = pDate >= todayStart;
        const isThisWeek = pDate >= weekStart;

        p.clinicalRecord.labTests.forEach(test => {
          totalTests++;
          const cleanName = test.split('###PDF_DATA###')[0].split('(Attached PDF:')[0].trim();
          const isDone = test.includes('###PDF_DATA###') || test.includes('(Attached PDF:');

          if (isDone) completed++;
          else pending++;

          const price = getTestPrice(cleanName);
          monthlyRev += price;

          if (isThisWeek) weeklyRev += price;
          if (isToday) todayRev += price;

          // Monthly map
          if (monthlyMap[mName]) {
            monthlyMap[mName].revenue += price;
            monthlyMap[mName].tests += 1;
          }

          // Weekly map
          if (weeklyMap[dayName] !== undefined) {
            weeklyMap[dayName] += price;
          }

          // Category map
          if (cleanName.toLowerCase().includes('cbc') || cleanName.toLowerCase().includes('blood count')) {
            categoryRevMap['Hematology (CBC)'].value += price;
          } else if (cleanName.toLowerCase().includes('lipid') || cleanName.toLowerCase().includes('lft') || cleanName.toLowerCase().includes('liver')) {
            categoryRevMap['Biochemistry (Lipid/LFT)'].value += price;
          } else if (cleanName.toLowerCase().includes('tsh') || cleanName.toLowerCase().includes('thyroid')) {
            categoryRevMap['Endocrinology (TSH)'].value += price;
          } else if (cleanName.toLowerCase().includes('fbs') || cleanName.toLowerCase().includes('sugar')) {
            categoryRevMap['Diabetology (FBS)'].value += price;
          } else {
            categoryRevMap['Clinical Pathology (Urine)'].value += price;
          }

          // Test Frequency Map
          if (!testFrequencyMap[cleanName]) {
            testFrequencyMap[cleanName] = { volume: 0, price, name: cleanName };
          }
          testFrequencyMap[cleanName].volume += 1;
        });
      });

      // Build Top Diagnostic Tests Table dynamically
      const sortedTests = Object.values(testFrequencyMap).sort((a, b) => b.volume - a.volume);
      const topTestsCalculated = sortedTests.map(t => ({
        name: t.name,
        price: `₹ ${t.price}`,
        volume: t.volume,
        totalRevenue: `₹ ${(t.volume * t.price).toLocaleString()}`,
        trend: '+100%'
      }));

      // Monthly Chart Data
      const dynamicMonthlyChart = Object.values(monthlyMap);

      // Weekly Chart Data
      const dynamicWeeklyChart = [
        { day: 'Mon', revenue: weeklyMap['Mon'] },
        { day: 'Tue', revenue: weeklyMap['Tue'] },
        { day: 'Wed', revenue: weeklyMap['Wed'] },
        { day: 'Thu', revenue: weeklyMap['Thu'] },
        { day: 'Fri', revenue: weeklyMap['Fri'] },
        { day: 'Sat', revenue: weeklyMap['Sat'] },
        { day: 'Sun', revenue: weeklyMap['Sun'] },
      ];

      // Category Share Data
      const dynamicCategoryShare = Object.entries(categoryRevMap).map(([name, obj]) => ({
        name,
        value: obj.value,
        color: obj.color
      }));

      setMetrics({
        totalLabTests: totalTests,
        pendingCount: pending,
        completedCount: completed,
        todayRevenue: todayRev,
        weeklyRevenue: weeklyRev,
        monthlyRevenue: monthlyRev,
        topTests: topTestsCalculated,
        monthlyChartData: dynamicMonthlyChart,
        weeklyChartData: dynamicWeeklyChart,
        categoryShareData: dynamicCategoryShare
      });
    } catch (error) {
      console.error('Error fetching patients for laboratory dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16">
      
      {/* Top Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#0f6c4f] via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide border border-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Pathology Laboratory Executive Dashboard
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome to Lab Portal 🔬
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm font-medium leading-relaxed">
            You currently have <strong className="text-white font-bold">{metrics.pendingCount} pending test requests</strong> awaiting processing and <strong className="text-white font-bold">{metrics.completedCount} lab reports</strong> successfully published.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/lab/requests">
              <Button className="bg-white hover:bg-emerald-50 text-[#0f6c4f] px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
                <Microscope className="h-4 w-4" /> View Lab Requests
              </Button>
            </Link>
            <Link to="/lab/samples">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-transform hover:scale-105">
                <FlaskConical className="h-4 w-4 text-emerald-300" /> Specimen Tracker
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Nav Cards right */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 z-10">
          <Link to="/lab/tests" className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 shadow-md transition-all group">
            <div className="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <FileCode className="h-4.5 w-4.5" />
            </div>
            <p className="font-extrabold text-white text-xs">Test Catalog</p>
            <p className="text-[10px] text-emerald-200 font-semibold mt-0.5">28 Master Tests</p>
          </Link>

          <Link to="/lab/results" className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 shadow-md transition-all group">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <FileCheck2 className="h-4.5 w-4.5" />
            </div>
            <p className="font-extrabold text-white text-xs">Results Archive</p>
            <p className="text-[10px] text-emerald-200 font-semibold mt-0.5">PDF Uploads</p>
          </Link>
        </div>
      </div>

      {/* KPI Operational Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-slate-100 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Lab Requests</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">{metrics.pendingCount}</h3>
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-2">Needs Action</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-inner">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reports Published</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">{metrics.completedCount}</h3>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">Verified PDF</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#0f6c4f] flex items-center justify-center font-bold shadow-inner">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Specimens</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">{metrics.totalLabTests}</h3>
              <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-2">In Pipeline</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-inner">
              <FlaskConical className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgent STAT Tests</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">2</h3>
              <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block mt-2">Emergency</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold shadow-inner">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 💰 REVENUE ANALYTICS & FINANCIAL OVERVIEW SECTION 💰 */}
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 pt-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-[#0f6c4f]" /> Laboratory Revenue & Diagnostics Financials
            </h2>
            <p className="text-xs text-slate-400 font-medium">Real-time daily, weekly, and monthly earnings breakdown calculated directly from patient records.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" /> Dynamic Live Billing
            </span>
          </div>
        </div>

        {/* 3 Revenue Breakdown Cards (Daily, Weekly, Monthly) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Daily Revenue Card */}
          <Card className="border border-emerald-100 shadow-md bg-gradient-to-br from-emerald-50/60 to-white relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Today's Revenue</span>
                <span className="p-2 rounded-xl bg-emerald-100 text-[#0f6c4f] font-bold text-xs"><Calendar className="h-4 w-4" /></span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-3 font-serif">₹ {metrics.todayRevenue.toLocaleString()}</h3>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" /> Live DB Today
                </span>
                <span className="text-slate-500 font-medium">Active Billing</span>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Revenue Card */}
          <Card className="border border-blue-100 shadow-md bg-gradient-to-br from-blue-50/60 to-white relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Weekly Revenue</span>
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs"><TrendingUp className="h-4 w-4" /></span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-3 font-serif">₹ {metrics.weeklyRevenue.toLocaleString()}</h3>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" /> Live DB Week
                </span>
                <span className="text-slate-500 font-medium">Weekly Total</span>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Card */}
          <Card className="border border-purple-100 shadow-md bg-gradient-to-br from-purple-50/60 to-white relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Monthly Revenue</span>
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs"><Award className="h-4 w-4" /></span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-3 font-serif">₹ {metrics.monthlyRevenue.toLocaleString()}</h3>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-purple-700 font-bold flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" /> Live DB Month
                </span>
                <span className="text-slate-500 font-medium">Month Total</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Financial Charts & Department Share Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Interactive Revenue Graph (Recharts) */}
          <Card className="lg:col-span-8 border border-slate-200/80 shadow-md bg-white rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0f6c4f]" /> Revenue Performance Trend
                </CardTitle>
                <p className="text-xs text-slate-400">Pathology diagnostic revenue collections calculated from patient records.</p>
              </div>

              {/* Timeframe Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setRevenueTimeframe('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    revenueTimeframe === 'monthly' ? 'bg-white text-[#0f6c4f] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setRevenueTimeframe('weekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    revenueTimeframe === 'weekly' ? 'bg-white text-[#0f6c4f] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Weekly (Days)
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-8">
              <div className="h-72 w-full">
                {revenueTimeframe === 'monthly' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.monthlyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip
                        formatter={(val) => [`₹ ${val.toLocaleString()}`, 'Revenue']}
                        contentStyle={{ backgroundColor: '#0f6c4f', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="revenue" fill="#0f6c4f" radius={[8, 8, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.weeklyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip
                        formatter={(val) => [`₹ ${val.toLocaleString()}`, 'Daily Earnings']}
                        contentStyle={{ backgroundColor: '#1e3a8a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Category Share (Pie Breakdown) */}
          <Card className="lg:col-span-4 border border-slate-200/80 shadow-md bg-white rounded-3xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-6 border-b border-slate-100">
              <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" /> Test Specialty Share
              </CardTitle>
              <p className="text-xs text-slate-400">Revenue split across pathology departments.</p>
            </CardHeader>

            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={metrics.categoryShareData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                      {metrics.categoryShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`₹ ${val.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-2 mt-4 text-xs">
                {metrics.categoryShareData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-none">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-900">₹ {cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Top Diagnostic Tests Revenue Table */}
        <Card className="border border-slate-200/80 shadow-md bg-white rounded-3xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900">Top Revenue Generating Diagnostic Tests</CardTitle>
              <p className="text-xs text-slate-400 font-medium">Test ranking computed directly from live MongoDB patient records.</p>
            </div>
            <Link to="/lab/tests">
              <Button variant="outline" className="text-xs font-bold border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
                Manage Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {metrics.topTests.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Test Name</th>
                    <th className="p-4">Standard Fee</th>
                    <th className="p-4">Tests Performed</th>
                    <th className="p-4">Growth</th>
                    <th className="p-4 pr-6 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {metrics.topTests.map((test) => (
                    <tr key={test.name} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-900 text-sm">
                        {test.name}
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{test.price}</td>
                      <td className="p-4 font-bold text-slate-900">{test.volume} tests</td>
                      <td className="p-4">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" /> Live
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right font-black text-[#0f6c4f] text-sm font-serif">
                        {test.totalRevenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">No test data recorded yet.</div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Recent Diagnostic Requests Section */}
      <Card className="border border-slate-200/80 shadow-md bg-white rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold text-slate-900">Recent Diagnostic Requests</CardTitle>
            <p className="text-xs text-slate-400">Latest patient test recommendations from consulting physicians.</p>
          </div>
          <Link to="/lab/requests">
            <Button variant="outline" className="text-xs font-bold border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
              View All Requests <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading lab overview...</div>
          ) : patients.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Patient Name</th>
                  <th className="p-4">Diagnosis</th>
                  <th className="p-4">Recommended Tests</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {patients.slice(0, 5).map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">
                      {p.name}
                      <span className="block text-[10px] text-slate-400 font-semibold">ID: #{p._id?.substring(18).toUpperCase()}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#0f6c4f] font-bold text-[10.5px]">
                        {p.clinicalRecord?.diagnosis || 'General Checkup'}
                      </span>
                    </td>
                    <td className="p-4 space-y-1">
                      {p.clinicalRecord?.labTests.map((t, idx) => (
                        <span key={idx} className="inline-block mr-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10.5px]">
                          {t.split('###PDF_DATA###')[0]}
                        </span>
                      ))}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link to="/lab/requests">
                        <Button className="bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold text-[11px] h-8 px-3 rounded-xl shadow-2xs">
                          Open Request
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">No active lab requests found.</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
