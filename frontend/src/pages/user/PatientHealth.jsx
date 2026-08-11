import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Activity, HeartPulse, Pill, User, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatientHealth() {
  const [vitals, setVitals] = useState({
    bloodPressure: '--/--',
    heartRate: '--',
    sugarLevel: '--',
    weight: '--'
  });

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo._id) {
        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`);
        if (data.vitals) {
          setVitals({
            bloodPressure: data.vitals.bloodPressure || '--/--',
            heartRate: data.vitals.heartRate || '--',
            sugarLevel: data.vitals.sugarLevel || '--',
            weight: data.vitals.weight || '--'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  const bpData = [
    { name: 'Mon', systolic: 120, diastolic: 80 },
    { name: 'Tue', systolic: 122, diastolic: 82 },
    { name: 'Wed', systolic: 118, diastolic: 79 },
    { name: 'Thu', systolic: 125, diastolic: 85 },
    { name: 'Fri', systolic: 119, diastolic: 81 },
    { name: 'Sat', systolic: 121, diastolic: 80 },
    { name: 'Sun', systolic: parseInt(vitals.bloodPressure.split('/')[0]) || 120, diastolic: parseInt(vitals.bloodPressure.split('/')[1]) || 80 },
  ];

  const hrData = [
    { name: 'Mon', value: 72 },
    { name: 'Tue', value: 75 },
    { name: 'Wed', value: 71 },
    { name: 'Thu', value: 78 },
    { name: 'Fri', value: 74 },
    { name: 'Sat', value: 70 },
    { name: 'Sun', value: parseInt(vitals.heartRate) || 72 },
  ];

  const metrics = [
    { title: 'Blood Pressure', value: vitals.bloodPressure, unit: 'mmHg', icon: Activity, trend: 'down', trendVal: 'Current', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Heart Rate', value: vitals.heartRate, unit: 'bpm', icon: HeartPulse, trend: 'stable', trendVal: 'Current', color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Blood Sugar', value: vitals.sugarLevel, unit: 'mg/dL', icon: Pill, trend: 'up', trendVal: 'Current', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Body Weight', value: vitals.weight, unit: 'kg', icon: User, trend: 'down', trendVal: 'Current', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Health Metrics</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Track your vital signs and overall health progress.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className={`h-12 w-12 rounded-full ${metric.bg} flex items-center justify-center mb-4`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <h3 className="text-sm font-medium text-[var(--color-muted-foreground)]">{metric.title}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-foreground)]">{metric.value}</span>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)]">{metric.unit}</span>
              </div>
              <div className={`mt-2 flex items-center text-xs font-semibold ${metric.trend === 'down' ? 'text-green-500' : metric.trend === 'up' ? 'text-red-500' : 'text-slate-500'}`}>
                {metric.trend === 'down' ? <ArrowDownRight className="h-3 w-3 mr-1" /> : metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                {metric.trend !== 'stable' ? `${metric.trendVal} vs last week` : 'Stable this week'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bpData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSys)" name="Systolic" />
                  <Area type="monotone" dataKey="diastolic" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorDia)" name="Diastolic" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Heart Rate History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="BPM" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </motion.div>
  );
}
