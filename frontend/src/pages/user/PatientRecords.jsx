import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { FileText, Download, Eye, Search, Calendar, X, Printer } from 'lucide-react';
import { Input } from '../../components/Input';
import axios from 'axios';

export default function PatientRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo._id) {
          const [profileRes, aptsRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`).catch(() => ({ data: null })),
            axios.get(`http://localhost:5000/api/appointments/patient/${userInfo._id}`).catch(() => ({ data: [] }))
          ]);

          const data = profileRes.data;
          const appointments = Array.isArray(aptsRes.data) ? aptsRes.data : [];
          const recordsList = [];
          const seenDates = new Set();

          // 1. If date-wise medicalRecords exist in DB
          if (data && data.medicalRecords && Array.isArray(data.medicalRecords) && data.medicalRecords.length > 0) {
            data.medicalRecords.forEach((rec, idx) => {
              const recDate = rec.date ? new Date(rec.date) : new Date();
              const dateKey = recDate.toDateString();
              seenDates.add(dateKey);
              recordsList.push({
                id: rec.recordId || `REC-${idx + 1}`,
                name: `Consultation Record (${rec.diagnosis || 'Clinical Visit'})`,
                type: 'Health File',
                rawDate: recDate,
                date: recDate.toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }),
                followUp: rec.followUpDate ? new Date(rec.followUpDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) : 'None Scheduled',
                doctor: rec.doctor?.name || 'Dr. Ritik Pandey',
                size: '2.4 MB',
                icon: FileText,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
              });
            });
          } else if (data && data.clinicalRecord) {
            const cr = data.clinicalRecord;
            if (cr.diagnosis || cr.chiefComplaint || cr.doctorNotes || (cr.prescriptions && cr.prescriptions.length > 0) || (cr.labTests && cr.labTests.length > 0)) {
              const crDate = data.vitals?.lastUpdated ? new Date(data.vitals.lastUpdated) : new Date(data.updatedAt || Date.now());
              seenDates.add(crDate.toDateString());
              recordsList.push({
                id: 'REC-EHR-' + userInfo._id.substring(18),
                name: `Consultation Record (${cr.diagnosis || 'Health Summary'})`,
                type: 'Health File',
                rawDate: crDate,
                date: crDate.toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }),
                followUp: cr.followUpDate ? new Date(cr.followUpDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) : 'None Scheduled',
                doctor: 'Dr. Ritik Pandey',
                size: '2.8 MB',
                icon: FileText,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
              });
            }
          }

          // 2. Add past/completed appointments as historical medical record files
          appointments.forEach((apt) => {
            const aptDate = new Date(apt.date || apt.createdAt);
            const dateKey = aptDate.toDateString();
            
            if (!seenDates.has(dateKey) || apt.status === 'Completed') {
              seenDates.add(dateKey);
              recordsList.push({
                id: `APT-REC-${apt._id}`,
                name: `Visit Record (${apt.complaint || apt.type || 'Doctor Consultation'})`,
                type: 'Appointment File',
                rawDate: aptDate,
                date: aptDate.toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }),
                followUp: 'None Scheduled',
                doctor: apt.doctor?.name || 'Dr. Ritik Pandey',
                size: '1.9 MB',
                icon: FileText,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              });
            }
          });

          // Sort records newest first
          recordsList.sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0));
          setRecords(recordsList);
        }
      } catch (error) {
        console.error('Error fetching patient records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Medical Records</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Access and download your test results and visit summaries.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search records..." 
            className="pl-9 bg-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/75 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider">Document Name</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider">Date Created</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider">Follow-up Date</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider">Consultant</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-400 text-sm">
                      Loading your medical records...
                    </td>
                  </tr>
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                            <FileText className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{record.name}</p>
                            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5 block">{record.type} ({record.size})</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 text-emerald-700 font-semibold text-sm">
                        {record.followUp}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                        {record.doctor}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8.5 px-3 rounded-lg text-slate-600 hover:text-[var(--color-primary)] hover:bg-slate-50 border border-slate-100 text-xs font-semibold"
                            onClick={() => navigate(`/portal/records/${record.id}`)}
                          >
                            View Record
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8.5 w-8.5 rounded-lg text-slate-400 hover:text-slate-600 border border-slate-100"
                            onClick={() => navigate(`/portal/records/${record.id}`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400 text-sm">
                      No medical records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {filteredRecords.length > 5 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" className="w-full max-w-sm">Load More Records</Button>
        </div>
      )}

    </motion.div>
  );
}
