import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Heart, Activity, Droplet, Scale, Thermometer, User, Mail, Phone, Calendar, Clock, ClipboardList, Stethoscope, Plus, Trash2, CheckSquare, Printer, FileText, Pill, Eye } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export default function DoctorPatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: '',
    heartRate: '',
    weight: '',
    sugarLevel: '',
    temperature: ''
  });

  const [clinicalForm, setClinicalForm] = useState({
    chiefComplaint: '',
    diagnosis: '',
    doctorNotes: '',
    followUpDate: ''
  });

  const [prescriptions, setPrescriptions] = useState([]);

  const [labTests, setLabTests] = useState({
    'CBC': false,
    'Blood Sugar': false,
    'ECG': false,
    'X-Ray': false,
    'MRI': false,
    'CT Scan': false
  });

  useEffect(() => {
    fetchPatientProfile();
  }, [id]);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/users/profile/${id}`);
      setPatient(data);

      if (data.vitals) {
        setVitalsForm({
          bloodPressure: data.vitals.bloodPressure || '',
          heartRate: data.vitals.heartRate || '',
          weight: data.vitals.weight || '',
          sugarLevel: data.vitals.sugarLevel || '',
          temperature: data.vitals.temperature || ''
        });
      }

      if (data.clinicalRecord) {
        setClinicalForm({
          chiefComplaint: data.clinicalRecord.chiefComplaint || '',
          diagnosis: data.clinicalRecord.diagnosis || '',
          doctorNotes: data.clinicalRecord.doctorNotes || '',
          followUpDate: data.clinicalRecord.followUpDate ? new Date(data.clinicalRecord.followUpDate).toISOString().split('T')[0] : ''
        });

        if (data.clinicalRecord.prescriptions) {
          setPrescriptions(data.clinicalRecord.prescriptions);
        }

        if (data.clinicalRecord.labTests) {
          const loadedTests = { ...labTests };
          const customTestsArr = [];
          data.clinicalRecord.labTests.forEach(test => {
            if (loadedTests[test] !== undefined) {
              loadedTests[test] = true;
            } else {
              customTestsArr.push(test);
            }
          });
          setLabTests(loadedTests);
          setCustomLabTests(customTestsArr);
        }
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      alert('Failed to load patient profile');
    } finally {
      setLoading(false);
    }
  };

  const [customLabTests, setCustomLabTests] = useState([]);
  const [customTestInput, setCustomTestInput] = useState('');

  const handleAddCustomLabTest = (e) => {
    e.preventDefault();
    if (customTestInput.trim()) {
      if (!customLabTests.includes(customTestInput.trim())) {
        setCustomLabTests([...customLabTests, customTestInput.trim()]);
      }
      setCustomTestInput('');
    }
  };

  const handleRemoveCustomLabTest = (testName) => {
    setCustomLabTests(customLabTests.filter(t => t !== testName));
  };

  const handleAddMedicine = () => {
    setPrescriptions([...prescriptions, { medicineName: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleRemoveMedicine = (index) => {
    const newP = [...prescriptions];
    newP.splice(index, 1);
    setPrescriptions(newP);
  };

  const handleMedicineChange = (index, field, value) => {
    const newP = [...prescriptions];
    newP[index][field] = value;
    setPrescriptions(newP);
  };

  const handleLabTestToggle = (testName) => {
    setLabTests({ ...labTests, [testName]: !labTests[testName] });
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();

    // Convert labTests object to array and combine with custom lab tests
    const selectedLabTests = [
      ...Object.keys(labTests).filter(test => labTests[test]),
      ...customLabTests
    ];

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const payload = {
      vitals: vitalsForm,
      consultationDate: new Date(),
      doctor: {
        id: userInfo._id,
        name: userInfo.name || 'Dr. Ritik Pandey',
        specialty: userInfo.specialty || 'General Physician'
      },
      clinicalRecord: {
        ...clinicalForm,
        prescriptions,
        labTests: selectedLabTests
      }
    };

    try {
      setSaving(true);
      // 1. Save Patient Clinical Records and Vitals
      await axios.put(`http://localhost:5000/api/users/patients/${id}/vitals`, payload);

      // 2. Automatically mark the patient's active appointment with this doctor as Completed
      if (userInfo._id) {
        // Fetch this doctor's appointments
        const { data: appointments } = await axios.get(`http://localhost:5000/api/appointments/doctor/${userInfo._id}`);
        if (Array.isArray(appointments)) {
          // Find the active (not completed/cancelled) appointment for this patient
          const activeApt = appointments.find(apt => 
            apt.patient?._id?.toString() === id && 
            apt.status !== 'Completed' && 
            apt.status !== 'Cancelled'
          );
          if (activeApt) {
            // Update status to 'Completed'
            await axios.put(`http://localhost:5000/api/appointments/${activeApt._id}/status`, { status: 'Completed' });
          }
        }
      }

      alert('Patient Clinical Record updated and appointment marked as Completed successfully!');
      fetchPatientProfile();
    } catch (error) {
      console.error('Error saving records:', error);
      alert('Failed to save details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-[var(--color-muted-foreground)]">Loading patient profile...</div>;
  if (!patient) return <div className="py-20 text-center text-[var(--color-muted-foreground)]">Patient not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pb-20">

      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="p-2 h-auto rounded-full bg-[var(--color-muted)] hover:bg-[var(--color-border)] transition-colors" onClick={() => navigate('/doctor/patients')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">Clinical Record</h2>
            <p className="text-[var(--color-muted-foreground)] text-sm">Comprehensive Electronic Medical Record (EMR)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-300">
            <Printer className="h-4 w-4 mr-2" /> Print Prescription
          </Button>
          <Button onClick={handleSaveAll} disabled={saving} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white border-none shadow-md">
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Patient Details'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar: Basic Info */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-[var(--color-border)] shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-emerald-100 flex items-center justify-center text-5xl font-bold text-emerald-700 mb-4 border-4 border-emerald-50 shadow-inner">
                {patient.name.charAt(0)}
              </div>
              <h3 className="font-bold text-xl text-slate-800">{patient.name}</h3>
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold mt-2 mb-6">
                ID: PT-{patient._id.substring(0, 6).toUpperCase()}
              </div>

              <div className="w-full text-left space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-slate-500 block text-xs">Age</span>
                    <span className="font-semibold text-slate-800">
                      {patient.dateOfBirth
                        ? `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} yrs`
                        : (patient.age || 'N/A')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Gender</span>
                    <span className="font-semibold text-slate-800">{patient.gender || 'N/A'}</span>
                  </div>
                  <div className="col-span-2 pt-2">
                    <span className="text-slate-500 block text-xs">Blood Group</span>
                    <span className="font-semibold text-slate-800">{patient.bloodGroup || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm pt-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Mail className="h-4 w-4" /></div>
                    <span className="text-slate-700 truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Phone className="h-4 w-4" /></div>
                    <span className="text-slate-700 truncate">{patient.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content: Comprehensive Forms */}
        <div className="lg:col-span-9 space-y-6">
          <form id="clinicalForm" onSubmit={handleSaveAll} className="space-y-6">

            {/* Section 2: Health Vitals */}
            <Card className="border-[var(--color-border)] shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-slate-800">Health Vitals</h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-red-400" /> Blood Pressure</label>
                    <div className="relative">
                      <Input placeholder="120/80" value={vitalsForm.bloodPressure} onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })} className="pl-3 h-10 border-slate-200" />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">mmHg</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-orange-400" /> Heart Rate</label>
                    <div className="relative">
                      <Input placeholder="72" value={vitalsForm.heartRate} onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })} className="pl-3 h-10 border-slate-200" />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">bpm</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5 text-yellow-500" /> Body Temp</label>
                    <div className="relative">
                      <Input placeholder="98.6" value={vitalsForm.temperature} onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })} className="pl-3 h-10 border-slate-200" />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">°F</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-blue-400" /> Weight</label>
                    <div className="relative">
                      <Input placeholder="70" value={vitalsForm.weight} onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })} className="pl-3 h-10 border-slate-200" />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Droplet className="h-3.5 w-3.5 text-purple-400" /> Blood Sugar</label>
                    <div className="relative">
                      <Input placeholder="95" value={vitalsForm.sugarLevel} onChange={(e) => setVitalsForm({ ...vitalsForm, sugarLevel: e.target.value })} className="pl-3 h-10 border-slate-200" />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">mg/dL</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 & 4: Chief Complaint & Diagnosis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="bg-red-50/50 border-b border-red-100 px-6 py-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold text-slate-800">Chief Complaint ⭐</h3>
                </div>
                <CardContent className="p-6">
                  <label className="text-xs text-slate-500 mb-2 block">What is the primary reason for the visit?</label>
                  <Input
                    placeholder="e.g., Severe Chest Pain, High Fever for 3 days"
                    value={clinicalForm.chiefComplaint}
                    onChange={(e) => setClinicalForm({ ...clinicalForm, chiefComplaint: e.target.value })}
                    className="border-slate-200"
                    required
                  />

                  {/* 10 Quick Select Capsules */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      💡 Quick Select Chief Complaints (Click Capsule)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'High Fever & Chills',
                        'Severe Chest Pain',
                        'Persistent Cough & Cold',
                        'Acute Abdominal Pain',
                        'Severe Headache & Migraine',
                        'Shortness of Breath',
                        'Joint & Back Pain',
                        'Skin Rash & Itching',
                        'Dizziness & Fatigue',
                        'Nausea & Vomiting'
                      ].map((complaint) => {
                        const isSelected = clinicalForm.chiefComplaint?.includes(complaint);
                        return (
                          <button
                            key={complaint}
                            type="button"
                            onClick={() => {
                              if (!clinicalForm.chiefComplaint) {
                                setClinicalForm({ ...clinicalForm, chiefComplaint: complaint });
                              } else if (clinicalForm.chiefComplaint.includes(complaint)) {
                                const updated = clinicalForm.chiefComplaint
                                  .replace(complaint, '')
                                  .replace(/^,\s*|,\s*$/g, '')
                                  .replace(/,\s*,/g, ',');
                                setClinicalForm({ ...clinicalForm, chiefComplaint: updated });
                              } else {
                                setClinicalForm({ ...clinicalForm, chiefComplaint: `${clinicalForm.chiefComplaint}, ${complaint}` });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs ${
                              isSelected
                                ? 'bg-red-500 border-red-500 text-white shadow-red-500/20 scale-105'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50/50'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{complaint}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="bg-emerald-50/50 border-b border-emerald-100 px-6 py-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">Diagnosis ⭐</h3>
                </div>
                <CardContent className="p-6">
                  <label className="text-xs text-slate-500 mb-2 block">Doctor's final diagnosis based on symptoms.</label>
                  <Input
                    placeholder="e.g., Viral Fever, Hypertension"
                    value={clinicalForm.diagnosis}
                    onChange={(e) => setClinicalForm({ ...clinicalForm, diagnosis: e.target.value })}
                    className="border-slate-200"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Section 5: Prescriptions */}
            <Card className="border-[var(--color-border)] shadow-sm overflow-hidden">
              <div className="bg-indigo-50/50 border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-bold text-slate-800">Prescription ⭐⭐⭐</h3>
                </div>
                <Button type="button" onClick={handleAddMedicine} variant="outline" size="sm" className="h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  <Plus className="h-4 w-4 mr-1" /> Add Medicine
                </Button>
              </div>
              <CardContent className="p-0">
                {prescriptions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No medicines prescribed yet. Click "Add Medicine" to prescribe.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {prescriptions.map((med, idx) => (
                      <div key={idx} className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-slate-50/50 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Medicine Name</label>
                            <Input placeholder="e.g. Paracetamol" value={med.medicineName} onChange={e => handleMedicineChange(idx, 'medicineName', e.target.value)} className="h-9 text-sm" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Dosage</label>
                            <Input placeholder="e.g. 500mg" value={med.dosage} onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)} className="h-9 text-sm" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Frequency</label>
                            <Input placeholder="e.g. Morning / Night" value={med.frequency} onChange={e => handleMedicineChange(idx, 'frequency', e.target.value)} className="h-9 text-sm" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Duration</label>
                            <Input placeholder="e.g. 5 Days" value={med.duration} onChange={e => handleMedicineChange(idx, 'duration', e.target.value)} className="h-9 text-sm" />
                          </div>
                        </div>
                        <Button type="button" variant="ghost" onClick={() => handleRemoveMedicine(idx)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 h-auto shrink-0 mt-4 md:mt-0">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 6: Lab Tests & Section 7: Doctor Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Card className="border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col">
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-teal-500" />
                  <h3 className="font-bold text-slate-800">Lab Test Recommendation</h3>
                </div>
                <CardContent className="p-6 flex-1 space-y-4">
                  {/* Default Checkbox Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(labTests).map((test) => (
                      <label key={test} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${labTests[test] ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                        <input
                          type="checkbox"
                          checked={labTests[test]}
                          onChange={() => handleLabTestToggle(test)}
                          className="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                        />
                        <span className="text-sm font-medium">{test}</span>
                      </label>
                    ))}
                  </div>

                  {/* Add Custom Test Box */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Or Add Custom Test</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type test name (e.g. Thyroid, Lipid Profile)"
                        value={customTestInput}
                        onChange={(e) => setCustomTestInput(e.target.value)}
                        className="h-9 text-sm flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddCustomLabTest} 
                        className="h-9 px-4 text-xs bg-[var(--color-primary)] text-white font-bold rounded-lg"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Custom Tests Badges list */}
                    {customLabTests.length > 0 && (
                      <div className="flex flex-col gap-2 pt-1">
                        {customLabTests.map((t, idx) => {
                          const hasPdf = t.includes('###PDF_DATA###');
                          let displayLabel = t;
                          let pdfUrl = '';
                          
                          if (hasPdf) {
                            const parts = t.split('###PDF_DATA###');
                            displayLabel = parts[0].split('(Attached')[0].trim();
                            pdfUrl = parts[1] || '';
                          }
                          
                          const cleanLabel = displayLabel.split('- (Report')[0].trim();

                          return (
                            <div key={idx} className="flex items-center justify-between bg-purple-50 text-purple-700 border border-purple-100 text-xs px-3 py-1.5 rounded-xl font-semibold">
                              <div className="flex items-center gap-2">
                                <span>🔬 {cleanLabel}</span>
                                <span className="text-[9px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold uppercase">
                                  {hasPdf ? 'Lab Report Uploaded' : 'Custom Test'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {hasPdf && pdfUrl && (
                                  <button
                                    type="button"
                                    title="View Report PDF"
                                    onClick={() => {
                                      if (pdfUrl.startsWith('http')) {
                                        window.open(pdfUrl, '_blank');
                                      } else {
                                        // Base64 local fallback
                                        const pdfWindow = window.open();
                                        if (pdfWindow) {
                                          pdfWindow.document.write(`
                                            <html>
                                              <head><title>Lab Report PDF</title></head>
                                              <body style="margin:0;">
                                                <iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>
                                              </body>
                                            </html>
                                          `);
                                          pdfWindow.document.close();
                                        } else {
                                          window.location.href = pdfUrl;
                                        }
                                      }
                                    }}
                                    className="text-purple-600 hover:text-purple-900 bg-purple-100 p-1 rounded"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveCustomLabTest(t)}
                                  className="hover:text-red-500 font-bold ml-1 text-base leading-none"
                                >
                                  &times;
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[var(--color-border)] shadow-sm flex flex-col">
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-slate-500" />
                  <h3 className="font-bold text-slate-800">Doctor Notes & Instructions</h3>
                </div>
                <CardContent className="p-6 flex flex-col gap-4 flex-1">
                  <textarea
                    className="w-full flex-1 min-h-[120px] p-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none text-sm"
                    placeholder="Enter additional instructions (e.g. Take medicines after food, rest for 3 days...)"
                    value={clinicalForm.doctorNotes}
                    onChange={(e) => setClinicalForm({ ...clinicalForm, doctorNotes: e.target.value })}
                  />

                  <div className="pt-2 border-t border-slate-100">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Follow-up Date</label>
                    <Input
                      type="date"
                      value={clinicalForm.followUpDate}
                      onChange={(e) => setClinicalForm({ ...clinicalForm, followUpDate: e.target.value })}
                      className="border-slate-200 w-full sm:w-1/2"
                    />
                  </div>
                </CardContent>
              </Card>

            </div>

          </form>
        </div>

      </div>
    </motion.div>
  );
}
