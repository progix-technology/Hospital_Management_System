import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pill, Calendar as CalendarIcon, FileText, Search, Printer, Send, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DoctorPrescriptions() {
  const [showNewForm, setShowNewForm] = useState(false);
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [fetchingPatients, setFetchingPatients] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [medsList, setMedsList] = useState([{ medicineName: '', dosage: '1-0-1', frequency: 'After Food', duration: '5 Days' }]);
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo._id) {
        // Fetch all patients directly to find who has an active prescription
        const { data: allPatients } = await axios.get('http://localhost:5000/api/users/patients');
        if (Array.isArray(allPatients)) {
          const list = [];
          for (let patient of allPatients) {
            if (patient.clinicalRecord?.prescriptions?.length > 0) {
              list.push({
                id: 'RX-' + patient._id.substring(18).toUpperCase(),
                patientId: patient._id,
                patientName: patient.name,
                // Use actual date recorded if available, fallback to today
                date: patient.vitals?.lastUpdated ? new Date(patient.vitals.lastUpdated).toLocaleDateString() : new Date().toLocaleDateString(),
                medCount: patient.clinicalRecord.prescriptions.length,
                status: 'Active'
              });
            }
          }
          setPrescriptionsList(list);
        }
      }
    } catch (err) {
      console.error('Error loading prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setFetchingPatients(true);
      const { data } = await axios.get('http://localhost:5000/api/users/patients');
      setPatients(data || []);
    } catch (err) {
      console.error('Error fetching patients dropdown:', err);
    } finally {
      setFetchingPatients(false);
    }
  };

  const handleAddMedicine = () => {
    setMedsList([...medsList, { medicineName: '', dosage: '1-0-1', frequency: 'After Food', duration: '5 Days' }]);
  };

  const handleRemoveMedicine = (idx) => {
    const arr = [...medsList];
    arr.splice(idx, 1);
    setMedsList(arr);
  };

  const handleMedChange = (idx, field, val) => {
    const arr = [...medsList];
    arr[idx][field] = val;
    setMedsList(arr);
  };

  const handleSendPrescription = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      alert('Please select a patient.');
      return;
    }
    const emptyMed = medsList.some(m => !m.medicineName.trim());
    if (emptyMed) {
      alert('Please fill out all medicine names.');
      return;
    }

    try {
      setSubmitLoading(true);
      const payload = {
        clinicalRecord: {
          chiefComplaint: 'Prescription Issued',
          diagnosis: 'General Care Prescription',
          doctorNotes: advice,
          followUpDate: followUpDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          prescriptions: medsList,
          labTests: []
        }
      };

      await axios.put(`http://localhost:5000/api/users/patients/${selectedPatientId}/vitals`, payload);
      alert('Prescription successfully created and synchronized with Patient portal!');
      
      // Reset form
      setSelectedPatientId('');
      setMedsList([{ medicineName: '', dosage: '1-0-1', frequency: 'After Food', duration: '5 Days' }]);
      setAdvice('');
      setFollowUpDate('');
      setShowNewForm(false);
      fetchPrescriptions();
    } catch (err) {
      console.error('Error saving prescription:', err);
      alert('Failed to send prescription');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredList = prescriptionsList.filter(rx => 
    rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">Prescriptions</h2>
          <p className="text-[var(--color-muted-foreground)]">Manage and write patient prescriptions.</p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)} className="shadow-md bg-[var(--color-primary)] text-white hover:bg-emerald-800 border-none">
          <Plus className="mr-2 h-4 w-4" /> {showNewForm ? 'View All Prescriptions' : 'Write Prescription'}
        </Button>
      </div>

      {showNewForm ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <form onSubmit={handleSendPrescription}>
            <Card className="border-[var(--color-border)] shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]">
                  <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Pill className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">New e-Prescription</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Digital prescription form</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-foreground)]">Select Patient *</label>
                    <select 
                      required
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    >
                      <option value="">-- Choose Patient --</option>
                      {patients.map(p => (
                        <option key={p._id} value={p._id}>{p.name} (ID: #{p._id.substring(18).toUpperCase()})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-foreground)]">Date</label>
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="h-11" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-foreground)]">Follow-up Date</label>
                    <Input 
                      type="date" 
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="h-11 border-slate-200" 
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[var(--color-foreground)] text-sm uppercase tracking-wider text-slate-500">Medications</h4>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddMedicine} className="h-8 text-xs"><Plus className="h-3.5 w-3.5 mr-1"/> Add Medicine</Button>
                  </div>
                  
                  <div className="space-y-3">
                    {medsList.map((med, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-secondary)]/50 flex flex-col md:flex-row gap-4 items-end relative">
                        <div className="flex-1 w-full space-y-1.5">
                          <label className="text-xs font-medium text-[var(--color-muted-foreground)]">Medicine Name</label>
                          <Input 
                            required
                            placeholder="e.g. Amoxicillin 500mg" 
                            value={med.medicineName}
                            onChange={(e) => handleMedChange(idx, 'medicineName', e.target.value)}
                            className="bg-white h-10" 
                          />
                        </div>
                        <div className="w-full md:w-32 space-y-1.5">
                          <label className="text-xs font-medium text-[var(--color-muted-foreground)]">Dosage</label>
                          <select 
                            value={med.dosage}
                            onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-white text-sm"
                          >
                            <option>1-0-1</option>
                            <option>1-1-1</option>
                            <option>0-0-1</option>
                            <option>1-0-0</option>
                          </select>
                        </div>
                        <div className="w-full md:w-32 space-y-1.5">
                          <label className="text-xs font-medium text-[var(--color-muted-foreground)]">Frequency</label>
                          <select 
                            value={med.frequency}
                            onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-white text-sm"
                          >
                            <option>After Food</option>
                            <option>Before Food</option>
                            <option>Empty Stomach</option>
                          </select>
                        </div>
                        <div className="w-full md:w-32 space-y-1.5">
                          <label className="text-xs font-medium text-[var(--color-muted-foreground)]">Duration</label>
                          <Input 
                            placeholder="e.g. 5 days" 
                            value={med.duration}
                            onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                            className="bg-white h-10" 
                          />
                        </div>
                        {medsList.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => handleRemoveMedicine(idx)} 
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-sm font-semibold text-[var(--color-foreground)]">Doctor's Advice / Notes</label>
                  <textarea 
                    className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none h-32"
                    placeholder="Drink plenty of water. Return if fever persists..."
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitLoading}>
                    {submitLoading ? 'Sending...' : 'Send Prescription'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </motion.div>
      ) : (
        <Card>
          <div className="p-4 border-b border-[var(--color-border)] flex gap-4">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-muted-foreground)]" />
                <Input 
                  placeholder="Search prescriptions by ID or Patient..." 
                  className="pl-9 h-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--color-muted-foreground)] uppercase bg-[var(--color-muted)]/30 border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Prescription ID</th>
                  <th className="px-6 py-4 font-medium">Patient Name</th>
                  <th className="px-6 py-4 font-medium">Date Issued</th>
                  <th className="px-6 py-4 font-medium">Medications</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">Loading prescriptions...</td>
                  </tr>
                ) : filteredList.length > 0 ? (
                  filteredList.map((rx) => (
                    <tr key={rx.id} className="hover:bg-[var(--color-muted)]/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--color-primary)]">{rx.id}</td>
                      <td className="px-6 py-4 font-medium text-[var(--color-foreground)]">{rx.patientName}</td>
                      <td className="px-6 py-4 text-[var(--color-muted-foreground)] flex items-center gap-1.5"><CalendarIcon className="h-3 w-3"/> {rx.date}</td>
                      <td className="px-6 py-4"><Badge variant="outline">{rx.medCount} items</Badge></td>
                      <td className="px-6 py-4">
                        <Badge variant={rx.status === 'Active' ? 'success' : 'outline'}>{rx.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/doctor/patients/${rx.patientId}`}>
                          <Button variant="ghost" size="sm" className="text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 flex items-center justify-end w-full">Edit Record</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">No prescriptions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </motion.div>
  );
}
