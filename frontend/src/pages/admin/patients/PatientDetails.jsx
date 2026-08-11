import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import {
  ArrowLeft, Edit, Activity, Heart, Thermometer, Droplets, FileText,
  Clock, FilePlus, User, Phone, Mail, MapPin, Shield, Calendar,
  ExternalLink, Trash2, Microscope, Pill, CheckCircle2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function calculateAge(dob) {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 'N/A';
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const [profileRes, aptRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/profile/${id}`),
          axios.get(`http://localhost:5000/api/users/patients/${id}`).catch(() => null), // fallback
        ]);

        const data = profileRes.data;
        setPatient(data);

        // Fetch patient's appointments
        try {
          const { data: apts } = await axios.get(`http://localhost:5000/api/appointments/patient/${id}`);
          setAppointments(apts || []);
        } catch {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Failed to fetch patient details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPatientData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete patient "${patient?.name}"?`)) return;
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      navigate('/admin/patients');
    } catch (error) {
      console.error('Failed to delete patient:', error);
      alert('Failed to delete patient profile');
      setDeleting(false);
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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f6c4f] border-r-transparent mb-3" />
        <p className="text-slate-400 text-sm font-medium">Loading patient profile...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-red-500 font-bold text-lg">Patient Profile Not Found</p>
        <Link to="/admin/patients">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients Registry</Button>
        </Link>
      </div>
    );
  }

  const age = calculateAge(patient.dateOfBirth);
  const vitals = patient.vitals || {};
  const clinical = patient.clinicalRecord || {};
  const addressStr = [patient.address?.street, patient.address?.city, patient.address?.state, patient.address?.pinCode || patient.address?.zipCode].filter(Boolean).join(', ');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/patients">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full bg-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">{patient.name}</h2>
            <p className="text-slate-500 text-xs font-mono">
              Patient ID: {patient._id} • Registered {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 bg-white"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Patient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold mb-3">
                  {patient.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{patient.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{patient.email || 'No email provided'}</p>
                <div className="mt-2.5">
                  <Badge variant="success">Active Patient</Badge>
                </div>
              </div>

              {/* Details List */}
              <div className="py-4 space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Age / Gender</span>
                  <span className="font-bold text-slate-800">{age !== 'N/A' ? `${age} yrs` : 'N/A'} / {patient.gender || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Blood Group</span>
                  <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{patient.bloodGroup || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Phone</span>
                  <span className="font-bold text-slate-800">{patient.phone || 'N/A'}</span>
                </div>
                {patient.emergencyContact?.name && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Emergency Contact</span>
                    <span className="font-bold text-slate-800">{patient.emergencyContact.name} ({patient.emergencyContact.phone || 'N/A'})</span>
                  </div>
                )}
                {addressStr && (
                  <div className="py-1">
                    <span className="text-slate-400 font-medium block mb-1">Address</span>
                    <span className="font-semibold text-slate-700 block leading-relaxed">{addressStr}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Vitals & Appointments */}
        <div className="lg:col-span-2 space-y-6">

          {/* Current Vitals Cards */}
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#0f6c4f]" /> Current Patient Vitals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="bg-red-50/60 border-red-100 shadow-none">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Heart className="h-5 w-5 text-red-500 mb-1.5" />
                  <span className="text-xl font-bold text-slate-800">{vitals.heartRate || '--'}</span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Heart Rate (bpm)</span>
                </CardContent>
              </Card>

              <Card className="bg-blue-50/60 border-blue-100 shadow-none">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Activity className="h-5 w-5 text-blue-500 mb-1.5" />
                  <span className="text-xl font-bold text-slate-800">{vitals.bloodPressure || '--/--'}</span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Blood Pressure</span>
                </CardContent>
              </Card>

              <Card className="bg-amber-50/60 border-amber-100 shadow-none">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Thermometer className="h-5 w-5 text-amber-500 mb-1.5" />
                  <span className="text-xl font-bold text-slate-800">{vitals.temperature || '--'}</span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Temp (°F)</span>
                </CardContent>
              </Card>

              <Card className="bg-purple-50/60 border-purple-100 shadow-none">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Droplets className="h-5 w-5 text-purple-500 mb-1.5" />
                  <span className="text-xl font-bold text-slate-800">{vitals.sugarLevel || '--'}</span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Sugar Level (mg/dL)</span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Appointment History */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-50 pb-3">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0f6c4f]" /> Appointment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {appointments.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs font-medium">
                  No appointments booked by this patient yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {appointments.map((apt) => (
                    <div key={apt._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">{apt.doctor?.name || 'Assigned Doctor'}</span>
                          <span className="text-xs text-[#0f6c4f] font-semibold">({apt.doctor?.specialty || 'General'})</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>⏰ {apt.timeSlot}</span>
                          <span>💳 ₹{apt.fee || 500} ({apt.paymentMethod || 'Cash'})</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(apt.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical Record & Prescriptions */}
          {(clinical.chiefComplaint || clinical.diagnosis || (clinical.prescriptions && clinical.prescriptions.length > 0) || (clinical.labTests && clinical.labTests.length > 0)) && (
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="border-b border-slate-50 pb-3">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#0f6c4f]" /> Doctor Clinical Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {clinical.chiefComplaint && (
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Chief Complaint:</span>
                    <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{clinical.chiefComplaint}</p>
                  </div>
                )}

                {clinical.diagnosis && (
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Diagnosis:</span>
                    <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{clinical.diagnosis}</p>
                  </div>
                )}

                {clinical.prescriptions && clinical.prescriptions.length > 0 && (
                  <div>
                    <span className="text-slate-400 font-semibold block mb-2">Prescribed Medicines:</span>
                    <div className="space-y-1.5">
                      {clinical.prescriptions.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 text-emerald-800 p-2.5 rounded-xl font-medium">
                          <div className="flex items-center gap-2">
                            <Pill className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="font-bold">{m.medicineName}</span>
                          </div>
                          <span>{m.dosage} • {m.frequency} • {m.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </motion.div>
  );
}
