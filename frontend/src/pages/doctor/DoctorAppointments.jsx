import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, MoreVertical, Search, CheckCircle, XCircle, FileEdit, User } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';

export default function DoctorAppointments() {
  const [filter, setFilter] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo._id) {
        const { data } = await axios.get(`http://localhost:5000/api/appointments/doctor/${userInfo._id}`);
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  // Map DB statuses to filter tabs
  const getFilterCategory = (status) => {
    if (status === 'Completed') return 'completed';
    if (status === 'Cancelled') return 'cancelled';
    return 'upcoming'; // Scheduled, In Progress, Waiting
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesFilter = filter === 'all' || getFilterCategory(app.status) === filter;
    const matchesSearch = app.patient && app.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    const isDoneA = a.status === 'Completed' || a.status === 'Cancelled' ? 1 : 0;
    const isDoneB = b.status === 'Completed' || b.status === 'Cancelled' ? 1 : 0;
    return isDoneA - isDoneB;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'In Progress': return <Badge variant="warning">In Progress</Badge>;
      case 'Waiting': return <Badge variant="danger">Waiting</Badge>;
      case 'Cancelled': return <Badge variant="outline" className="text-red-500 border-red-500">Cancelled</Badge>;
      default: return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">Appointments</h2>
          <p className="text-[var(--color-muted-foreground)]">Manage your schedule and consultations.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-muted-foreground)]" />
            <Input 
              placeholder="Search patient..." 
              className="pl-9 h-10 border-slate-200" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-[var(--color-muted)]/30 rounded-xl max-w-md border border-[var(--color-border)]">
        {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg capitalize transition-all ${
              filter === tab 
                ? 'bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm' 
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <Card className="border-[var(--color-border)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-secondary)]/50 text-[var(--color-muted-foreground)] text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Consultation Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--color-muted-foreground)]">
                    Loading appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--color-muted-foreground)]">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const aptDate = new Date(apt.date);
                  return (
                    <tr key={apt._id} className="hover:bg-[var(--color-secondary)]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-[var(--color-primary)]">
                              {apt.patient ? apt.patient.name.split(' ').map(n => n[0]).join('') : 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[var(--color-foreground)]">{apt.patient ? apt.patient.name : 'Unknown'}</p>
                            <p className="text-xs text-[var(--color-muted-foreground)]">
                              Blood Group: {apt.patient?.bloodGroup || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-[var(--color-foreground)] flex items-center gap-1.5">
                            <CalendarIcon className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
                            {aptDate.toLocaleDateString()}
                          </span>
                          <span className="text-[var(--color-muted-foreground)] flex items-center gap-1.5 text-xs">
                            <Clock className="h-3.5 w-3.5" />
                            {apt.timeSlot}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[var(--color-foreground)]">
                        {apt.type}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(apt.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {apt.status === 'Scheduled' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-none"
                              onClick={() => handleUpdateStatus(apt._id, 'Completed')}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Mark Done
                            </Button>
                          )}
                          {apt.status === 'Scheduled' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none"
                              onClick={() => handleUpdateStatus(apt._id, 'Cancelled')}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1.5" /> Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
