import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Search, Filter, CheckCircle2, Clock, AlertTriangle,
  FileCheck, Download, RefreshCw, Database, Tag, X, Plus, ChevronDown,
  FileText, Sparkles, Activity, Layers, ArrowRight, ShieldCheck, QrCode,
  Eye, Upload, Check, CreditCard, Smartphone, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import axios from 'axios';

const getTestPrice = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('cbc') || lower.includes('blood count')) return 350;
  if (lower.includes('sugar') || lower.includes('fbs') || lower.includes('glucose')) return 150;
  if (lower.includes('lipid')) return 750;
  if (lower.includes('thyroid') || lower.includes('tsh')) return 900;
  if (lower.includes('lft') || lower.includes('liver')) return 850;
  if (lower.includes('kft') || lower.includes('rft') || lower.includes('kidney')) return 800;
  if (lower.includes('urine')) return 200;
  if (lower.includes('dengue')) return 950;
  if (lower.includes('vitamin d')) return 1400;
  if (lower.includes('vitamin b12')) return 1100;
  if (lower.includes('widal') || lower.includes('typhoid')) return 300;
  if (lower.includes('fever')) return 350;
  return 400;
};

export default function LabSamplesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [samples, setSamples] = useState([]);
  const [patients, setPatients] = useState([]);

  // Register Specimen Modal State
  const [showModal, setShowModal] = useState(false);
  const [newSample, setNewSample] = useState({
    patientId: '',
    testName: 'Complete Blood Count (CBC)',
    sampleType: 'Whole Blood (EDTA)',
    priority: 'Routine'
  });

  // Razorpay Gateway Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedPaySample, setSelectedPaySample] = useState(null);
  const [razorpayTab, setRazorpayTab] = useState('card'); // 'card' | 'upi'
  const [razorpayProcessing, setRazorpayProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '4532 8921 7843 1092', expiry: '12/28', cvv: '849' });
  const [upiForm, setUpiForm] = useState({ vpa: 'patient@okhdfcbank' });

  // Upload Report Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentUploadSample, setCurrentUploadSample] = useState(null);
  const [testResultText, setTestResultText] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [reportFileName, setReportFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDynamicSamples();
  }, []);

  const fetchDynamicSamples = async () => {
    try {
      setLoading(true);
      const [{ data: allPatients }, { data: allAppointments }] = await Promise.all([
        axios.get('http://localhost:5000/api/users/patients'),
        axios.get('http://localhost:5000/api/appointments').catch(() => ({ data: [] }))
      ]);

      const validPatients = allPatients || [];
      const validAppointments = Array.isArray(allAppointments) ? allAppointments : [];
      setPatients(validPatients);

      // Load paid sample barcodes from localStorage
      const paidSampleIds = (() => {
        try { return JSON.parse(localStorage.getItem('lab_paid_samples') || '[]'); }
        catch { return []; }
      })();

      const dynamicList = [];
      let counter = 8901;

      validPatients.forEach(p => {
        const labTestsArr = p.clinicalRecord?.labTests;
        if (Array.isArray(labTestsArr) && labTestsArr.length > 0) {
          // Find this patient's doctor consultation appointments
          const patientApts = validAppointments.filter(a => 
            a.patient?._id?.toString() === p._id?.toString() || 
            a.patient?.toString() === p._id?.toString()
          );

          let exactAssignedDate = null;
          let exactTimeSlot = null;

          if (patientApts.length > 0) {
            const sortedApts = [...patientApts].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
            exactAssignedDate = new Date(sortedApts[0].date || sortedApts[0].createdAt);
            exactTimeSlot = sortedApts[0].timeSlot;
          } else if (p.vitals?.lastUpdated) {
            exactAssignedDate = new Date(p.vitals.lastUpdated);
          } else {
            exactAssignedDate = new Date(p.createdAt || p.updatedAt || Date.now());
          }

          const prescribedDate = exactAssignedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
          const prescribedTime = exactTimeSlot || exactAssignedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          labTestsArr.forEach((test, idx) => {
            if (!test || !test.trim()) return;

            const sampleBarcode = `SMP-${8900 + (parseInt(p._id?.slice(-3), 16) || 1) % 900 + idx}`;
            let rawName = test.split('###PDF_DATA###')[0].trim();
            const hasPdf = test.includes('###PDF_DATA###') || test.includes('(Attached PDF:');

            // Clean raw test name
            let cleanTestName = rawName
              .split('(Attached PDF:')[0]
              .split('- (Report Uploaded')[0]
              .split('- (')[0]
              .trim();

            let specimen = 'Whole Blood (EDTA)';
            if (cleanTestName.toLowerCase().includes('urine')) specimen = 'Clean Catch Urine';
            else if (cleanTestName.toLowerCase().includes('sugar') || cleanTestName.toLowerCase().includes('fbs')) specimen = 'Fluoride Blood';
            else if (cleanTestName.toLowerCase().includes('lipid') || cleanTestName.toLowerCase().includes('tsh') || cleanTestName.toLowerCase().includes('lft')) specimen = 'Serum / Plasma';

            const price = getTestPrice(cleanTestName);
            
            // Check strictly in Database if this specific test was paid for this patient
            const isPaidInDb = Array.isArray(p.paidLabTests) && p.paidLabTests.some(item => 
              item.testName?.toLowerCase().trim() === cleanTestName.toLowerCase().trim()
            );

            const isPaid = hasPdf || isPaidInDb;

            let currentStatus = 'Done by Doctor';
            if (hasPdf) {
              currentStatus = 'Completed';
            } else if (isPaid) {
              currentStatus = 'In Testing';
            } else {
              currentStatus = 'Done by Doctor';
            }

            dynamicList.push({
              sampleId: sampleBarcode,
              patientDbId: p._id,
              patientName: p.name || 'Patient',
              patientId: `PT-${p._id?.substring(18).toUpperCase() || 'E5EAC6'}`,
              testName: cleanTestName || 'Routine Diagnostics',
              price,
              isPaid,
              hasPdfAttached: hasPdf,
              rawLabTestString: test,
              sampleType: specimen,
              rawPrescribedDate: exactAssignedDate,
              prescribedDate,
              prescribedTime,
              collectedTime: prescribedTime,
              status: currentStatus,
              priority: idx === 0 && !hasPdf ? 'STAT (Urgent)' : 'Routine',
              technician: 'Vasu Rajpoot'
            });
          });
        }
      });

      // Sort dynamicList: Pending Payment & In-Testing at TOP, Completed at BOTTOM, Newest first
      dynamicList.sort((a, b) => {
        const isCompletedA = a.status === 'Completed' || a.hasPdfAttached ? 1 : 0;
        const isCompletedB = b.status === 'Completed' || b.hasPdfAttached ? 1 : 0;
        if (isCompletedA !== isCompletedB) {
          return isCompletedA - isCompletedB;
        }

        const timeA = new Date(a.rawPrescribedDate || 0).getTime();
        const timeB = new Date(b.rawPrescribedDate || 0).getTime();
        if (timeA !== timeB) {
          return timeB - timeA;
        }

        const isStatA = a.priority?.includes('Urgent') || a.priority?.includes('STAT') ? 1 : 0;
        const isStatB = b.priority?.includes('Urgent') || b.priority?.includes('STAT') ? 1 : 0;
        return (isStatB || 0) - (isStatA || 0);
      });

      // If database has no samples yet, add sample defaults
      if (dynamicList.length === 0) {
        dynamicList.push(
          { sampleId: 'SMP-8901', patientName: 'Raj Tiwari', patientId: 'PT-FBEB71', testName: 'Complete Blood Count (CBC)', price: 350, isPaid: false, hasPdfAttached: false, sampleType: 'Whole Blood (EDTA)', prescribedDate: '10 Aug 2026', prescribedTime: '09:20 AM', collectedTime: '09:20 AM', status: 'Done by Doctor', priority: 'Routine' },
          { sampleId: 'SMP-8902', patientName: 'Mahendra Yadav', patientId: 'PT-E5EAC6', testName: 'ECG', price: 400, isPaid: false, hasPdfAttached: false, sampleType: 'Whole Blood (EDTA)', prescribedDate: '11 Aug 2026', prescribedTime: '01:20 PM', collectedTime: '01:20 PM', status: 'Done by Doctor', priority: 'STAT (Urgent)' },
          { sampleId: 'SMP-8903', patientName: 'Raj Tiwari', patientId: 'PT-FBEB71', testName: 'Simple Fever', price: 350, isPaid: true, hasPdfAttached: true, sampleType: 'Whole Blood (EDTA)', prescribedDate: '10 Aug 2026', prescribedTime: '09:20 AM', collectedTime: '09:20 AM', status: 'Completed', priority: 'Routine' }
        );
      }

      setSamples(dynamicList);
    } catch (error) {
      console.error('Error fetching specimens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSample = (e) => {
    e.preventDefault();
    const selectedPt = patients.find(p => p._id === newSample.patientId) || { name: 'Walk-in Patient', _id: 'PT-100' };
    const barcode = `SMP-${Math.floor(8900 + Math.random() * 1000)}`;
    const price = getTestPrice(newSample.testName);

    const addedSpecimen = {
      sampleId: barcode,
      patientDbId: selectedPt._id,
      patientName: selectedPt.name,
      patientId: `PT-${selectedPt._id?.substring(18).toUpperCase() || 'NEW'}`,
      testName: newSample.testName,
      price,
      isPaid: false,
      hasPdfAttached: false,
      sampleType: newSample.sampleType,
      rawPrescribedDate: new Date(),
      prescribedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      prescribedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      collectedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Done by Doctor',
      priority: newSample.priority,
      technician: 'Vasu Rajpoot'
    };

    setSamples(prev => [addedSpecimen, ...prev]);
    setShowModal(false);
  };

  // Launch Razorpay Payment Gateway Modal
  const handleLaunchPaymentGateway = (sample) => {
    setSelectedPaySample(sample);
    setShowRazorpayModal(true);
  };

  // Process Razorpay Payment & Persist to MongoDB
  const handleRazorpayPayNow = async () => {
    if (!selectedPaySample) return;
    try {
      setRazorpayProcessing(true);
      const mockTxnId = `pay_mock_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const methodLabel = razorpayTab === 'upi' ? 'UPI / QR' : 'Card';

      // 1. Update localStorage
      const sampleId = selectedPaySample.sampleId;
      try {
        const existing = JSON.parse(localStorage.getItem('lab_paid_samples') || '[]');
        if (!existing.includes(sampleId)) {
          existing.push(sampleId);
          localStorage.setItem('lab_paid_samples', JSON.stringify(existing));
        }
      } catch (e) {}

      // 2. Persist in MongoDB Database
      const patientDbId = selectedPaySample.patientDbId;
      if (patientDbId && typeof patientDbId === 'string' && patientDbId.length === 24) {
        try {
          await axios.post(`http://localhost:5000/api/users/patients/${patientDbId}/lab-payment`, {
            testName: selectedPaySample.testName || 'Diagnostic Lab Test',
            amount: selectedPaySample.price || 350,
            paymentMethod: `Razorpay (${methodLabel})`,
            transactionId: mockTxnId
          });
        } catch (err) {
          console.error('Error recording payment in MongoDB:', err);
        }
      }

      // Simulate Gateway Verification network delay
      await new Promise(r => setTimeout(r, 1000));

      // 3. Update local state
      setSamples(prev => prev.map(s => {
        if (s.sampleId === sampleId) {
          return { ...s, status: 'In Testing', isPaid: true };
        }
        return s;
      }));

      setShowRazorpayModal(false);
      alert(`🎉 Payment of ₹${selectedPaySample.price || 350}.00 Successful via Razorpay!\nTransaction ID: ${mockTxnId}\nStatus changed to: In Testing`);
    } catch (error) {
      console.error('Error processing Razorpay payment:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setRazorpayProcessing(false);
    }
  };

  // Open Upload Report Modal
  const handleOpenUploadModal = (sample) => {
    setCurrentUploadSample(sample);
    setTestResultText('');
    setReportFile(null);
    setReportFileName('');
    setUploadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload only PDF report files.');
        return;
      }
      setReportFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setReportFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Report Submit -> Saves to MongoDB & marks Completed
  const handleUploadReportSubmit = async (e) => {
    e.preventDefault();
    if (!currentUploadSample) return;
    if (!testResultText.trim()) {
      alert('Please enter diagnostic findings or test summary.');
      return;
    }

    try {
      setUploading(true);
      const patientId = currentUploadSample.patientDbId;

      if (patientId && typeof patientId === 'string' && patientId.length === 24) {
        const { data: patientData } = await axios.get(`http://localhost:5000/api/users/patients/${patientId}`);
        const existingTests = patientData.clinicalRecord?.labTests || [];

        let found = false;
        const updatedTests = existingTests.map(t => {
          const cleanName = t.split('###PDF_DATA###')[0].split('- (')[0].trim();
          if (cleanName.toLowerCase() === currentUploadSample.testName.toLowerCase()) {
            found = true;
            let formattedString = `${cleanName} - (${testResultText})`;
            if (reportFile) {
              formattedString += `###PDF_DATA###${reportFile}`;
            }
            return formattedString;
          }
          return t;
        });

        if (!found) {
          let formattedString = `${currentUploadSample.testName} - (${testResultText})`;
          if (reportFile) formattedString += `###PDF_DATA###${reportFile}`;
          updatedTests.push(formattedString);
        }

        await axios.put(`http://localhost:5000/api/users/patients/${patientId}/vitals`, {
          clinicalRecord: {
            ...patientData.clinicalRecord,
            labTests: updatedTests
          }
        });
      }

      // Update state locally
      setSamples(prev => prev.map(s => {
        if (s.sampleId === currentUploadSample.sampleId) {
          return {
            ...s,
            status: 'Completed',
            hasPdfAttached: true,
            rawLabTestString: `${s.testName} - (${testResultText})${reportFile ? `###PDF_DATA###${reportFile}` : ''}`
          };
        }
        return s;
      }));

      setUploadModalOpen(false);
      alert('Diagnostic Lab Report uploaded and marked Completed successfully!');
    } catch (err) {
      console.error('Error uploading lab report:', err);
      alert('Failed to upload report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Open / View Completed PDF Report
  const handleOpenReportView = (sample) => {
    if (sample.rawLabTestString && sample.rawLabTestString.includes('###PDF_DATA###')) {
      const pdfPart = sample.rawLabTestString.split('###PDF_DATA###')[1];
      if (pdfPart) {
        if (pdfPart.startsWith('http')) {
          window.open(pdfPart, '_blank');
          return;
        }
        try {
          const base64Content = pdfPart.includes(',') ? pdfPart.split(',')[1] : pdfPart;
          const byteCharacters = atob(base64Content);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    alert(`Report for ${sample.patientName} (${sample.testName}) is verified and completed.`);
  };

  const filteredSamples = samples.filter(s => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q ||
      (s.patientName || '').toLowerCase().includes(q) ||
      (s.sampleId || '').toLowerCase().includes(q) ||
      (s.testName || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const isCompletedA = a.status === 'Completed' || a.hasPdfAttached ? 1 : 0;
    const isCompletedB = b.status === 'Completed' || b.hasPdfAttached ? 1 : 0;
    if (isCompletedA !== isCompletedB) {
      return isCompletedA - isCompletedB;
    }

    const timeA = new Date(a.rawPrescribedDate || 0).getTime();
    const timeB = new Date(b.rawPrescribedDate || 0).getTime();
    if (timeA !== timeB) {
      return timeB - timeA;
    }

    const isStatA = (a.priority || '').includes('Urgent') || (a.priority || '').includes('STAT') ? 1 : 0;
    const isStatB = (b.priority || '').includes('Urgent') || (b.priority || '').includes('STAT') ? 1 : 0;
    return isStatB - isStatA;
  });

  const totalCount = samples.length;
  const doneByDoctorCount = samples.filter(s => s.status === 'Done by Doctor').length;
  const inTestingCount = samples.filter(s => s.status === 'In Testing').length;
  const completedCount = samples.filter(s => s.status === 'Completed').length;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16">

      {/* Page Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-[#0f6c4f] to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
            <FlaskConical className="h-4 w-4" /> Laboratory Specimen Management System
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Laboratory Specimens & Samples
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm font-medium mt-1 max-w-2xl">
            Real-time specimen collection barcode tracker, status processing pipeline, and STAT emergency priorities.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-white hover:bg-emerald-50 text-[#0f6c4f] font-extrabold text-xs rounded-2xl h-12 px-6 flex items-center gap-2 shadow-lg shadow-black/20 hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> Register New Specimen
          </Button>
        </div>
      </div>

      {/* Dynamic KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1 */}
        <Card className="border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Specimens Today</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">{totalCount}</h3>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-2">Active Intake</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-inner">
              <Database className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Done by Doctor</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">{doneByDoctorCount}</h3>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-2">Awaiting Payment</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-inner">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Testing Pipeline</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">{inTestingCount}</h3>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-2">In Diagnostics</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-inner">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Analyzed</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-serif">{completedCount}</h3>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">Verified & Ready</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#0f6c4f] flex items-center justify-center font-bold shadow-inner">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200/80 shadow-md bg-white rounded-3xl overflow-hidden">
        
        {/* Table Controls Bar */}
        <CardHeader className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Barcode ID (SMP-XXXX), Patient or Test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Done by Doctor', 'In Testing', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-[#0f6c4f] text-white shadow-md shadow-[#0f6c4f]/20 font-extrabold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </CardHeader>

        {/* Table Content */}
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-xs font-bold text-slate-400">Loading live specimen data...</div>
          ) : filteredSamples.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Sample Barcode</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Requested Test</th>
                  <th className="p-4">Specimen Container</th>
                  <th className="p-4">Prescribed Date & Time</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredSamples.map((s) => (
                  <tr key={s.sampleId} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Barcode */}
                    <td className="p-4 pl-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 font-mono font-bold text-xs border border-slate-200 shadow-2xs">
                        <Tag className="h-3.5 w-3.5 text-[#0f6c4f]" /> {s.sampleId}
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="p-4 font-bold text-slate-900">
                      <div className="text-sm">{s.patientName}</div>
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">{s.patientId}</span>
                    </td>

                    {/* Requested Test */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span>{s.testName}</span>
                        {s.hasPdfAttached && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9.5px] font-bold border border-emerald-200 inline-flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Report Uploaded
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Specimen Type (Static Text) */}
                    <td className="p-4 font-semibold text-slate-800 text-xs">
                      {s.sampleType}
                    </td>

                    {/* Doctor Prescribed Date & Time */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-xs">{s.prescribedDate}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{s.prescribedTime}</div>
                    </td>

                    {/* Priority (Static Text) */}
                    <td className="p-4 text-xs font-semibold">
                      {s.priority.includes('Urgent') || s.priority.includes('STAT') ? (
                        <span className="text-red-600 font-bold">STAT (Urgent)</span>
                      ) : (
                        <span className="text-slate-600 font-medium">Routine</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {s.status === 'Done by Doctor' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold border bg-amber-50 text-amber-800 border-amber-200 shadow-2xs">
                          <span className="h-2 w-2 rounded-full bg-amber-500" /> Done by Doctor
                        </span>
                      )}
                      {s.status === 'In Testing' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold border bg-blue-50 text-blue-700 border-blue-200 shadow-2xs">
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" /> In Testing
                        </span>
                      )}
                      {s.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="p-4 pr-6 text-right">
                      {s.status === 'Done by Doctor' && (
                        <Button
                          onClick={() => handleLaunchPaymentGateway(s)}
                          className="h-9 px-4 text-xs font-extrabold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs inline-flex items-center justify-center gap-1.5 hover:scale-105 transition-transform"
                        >
                          💳 Pay ₹{s.price || 350}
                        </Button>
                      )}
                      {s.status === 'In Testing' && (
                        <Button
                          onClick={() => handleOpenUploadModal(s)}
                          className="h-9 px-4 text-xs font-extrabold bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-xl shadow-xs inline-flex items-center justify-center gap-1.5 hover:scale-105 transition-transform"
                        >
                          <Upload className="h-3.5 w-3.5" /> View / Upload Report
                        </Button>
                      )}
                      {s.status === 'Completed' && (
                        <Button
                          onClick={() => handleOpenReportView(s)}
                          variant="outline"
                          className="h-9 px-4 text-xs font-bold border-emerald-200 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 text-emerald-600" /> View Report
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center text-xs font-bold text-slate-400">No matching specimens found.</div>
          )}
        </CardContent>
      </Card>

      {/* Upload Diagnostic Report Modal */}
      <AnimatePresence>
        {uploadModalOpen && currentUploadSample && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/90 to-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#0f6c4f] text-white flex items-center justify-center font-bold shadow-md">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Upload Laboratory Test Report</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Patient: <span className="text-[#0f6c4f] font-bold">{currentUploadSample.patientName}</span> ({currentUploadSample.patientId})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUploadReportSubmit} className="p-6 space-y-4 text-xs">
                
                {/* Specimen & Test summary pill */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Diagnostic Test</span>
                    <span className="font-extrabold text-slate-800 text-xs">{currentUploadSample.testName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Barcode</span>
                    <span className="font-mono font-bold text-slate-700 text-xs">{currentUploadSample.sampleId}</span>
                  </div>
                </div>

                {/* Findings / Summary Text Input */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Diagnostic Findings & Results <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={testResultText}
                    onChange={(e) => setTestResultText(e.target.value)}
                    placeholder="E.g., Fasting Blood Sugar: 95 mg/dL (Normal). HbA1c: 5.4%."
                    className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20 transition-all text-xs"
                    required
                  />
                </div>

                {/* PDF File Upload */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Upload Official Laboratory PDF Report
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      accept=".pdf"
                      id="labReportFileInput"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="labReportFileInput"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <Upload className="h-6 w-6 text-[#0f6c4f]" />
                      <span className="font-bold text-slate-700 text-xs">
                        {reportFileName ? reportFileName : 'Click to select PDF document'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Standard Hospital Lab Proforma (.pdf format)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-3 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUploadModalOpen(false)}
                    className="flex-1 h-11 rounded-xl font-bold border-slate-200"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl font-bold bg-[#0f6c4f] hover:bg-emerald-800 text-white shadow-md flex items-center justify-center gap-1.5"
                    disabled={uploading}
                  >
                    {uploading ? (
                      'Publishing...'
                    ) : (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" /> Save & Mark Completed
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Specimen Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#0f6c4f] text-white flex items-center justify-center font-bold shadow-md">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Register New Specimen</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Generate Barcode ID & Enter Pipeline</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterSample} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Select Patient <span className="text-red-500">*</span></label>
                  <select
                    value={newSample.patientId}
                    onChange={(e) => setNewSample({ ...newSample, patientId: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                    required
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.phone || p.email || 'Patient'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Diagnostic Test Name</label>
                  <select
                    value={newSample.testName}
                    onChange={(e) => setNewSample({ ...newSample, testName: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                    <option value="Fasting Blood Sugar (FBS)">Fasting Blood Sugar (FBS)</option>
                    <option value="Lipid Profile Panel">Lipid Profile Panel</option>
                    <option value="Thyroid Profile (TSH)">Thyroid Profile (TSH)</option>
                    <option value="Liver Function Test (LFT)">Liver Function Test (LFT)</option>
                    <option value="Urine Routine & Microscopy">Urine Routine & Microscopy</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Specimen Container / Tube</label>
                  <select
                    value={newSample.sampleType}
                    onChange={(e) => setNewSample({ ...newSample, sampleType: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="Whole Blood (EDTA)">Whole Blood (EDTA - Purple Top)</option>
                    <option value="Serum / Plasma">Serum / Plasma (Yellow/Red Top)</option>
                    <option value="Fluoride Blood">Fluoride Blood (Grey Top)</option>
                    <option value="Clean Catch Urine">Clean Catch Urine Container</option>
                    <option value="Throat / Nasal Swab">Throat / Nasal Swab</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Priority Level</label>
                  <select
                    value={newSample.priority}
                    onChange={(e) => setNewSample({ ...newSample, priority: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="Routine">Routine (Normal)</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT (Urgent)">STAT (Emergency)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-11 rounded-xl font-bold border-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl font-bold bg-[#0f6c4f] hover:bg-emerald-800 text-white shadow-md"
                  >
                    Register & Barcode
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Razorpay Payment Gateway Modal */}
      <AnimatePresence>
        {showRazorpayModal && selectedPaySample && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#0c2340] text-white flex items-center justify-center font-bold shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                      Razorpay Gateway <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-mono font-bold uppercase">Test Mode</span>
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">Diagnostic Investigation Payment</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRazorpayModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-xs">
                
                {/* Amount Summary Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/30 border border-slate-200/80 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Payable Lab Investigation Fee
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-serif">
                      ₹ {(selectedPaySample.price || 350).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#0f6c4f] font-bold block mt-0.5">
                      {selectedPaySample.testName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient</span>
                    <span className="text-xs font-bold text-slate-800 block">{selectedPaySample.patientName}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{selectedPaySample.patientId}</span>
                  </div>
                </div>

                {/* Razorpay Tab Selection */}
                <div className="flex border border-slate-200 rounded-xl bg-slate-50 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setRazorpayTab('card')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      razorpayTab === 'card' ? 'bg-white text-[#0c2340] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" /> Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setRazorpayTab('upi')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      razorpayTab === 'upi' ? 'bg-white text-[#0c2340] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" /> UPI / QR Code
                  </button>
                </div>

                {/* CARD TAB */}
                {razorpayTab === 'card' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Card Number</label>
                      <Input
                        type="text"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        placeholder="4532 •••• •••• 8921"
                        className="h-11 border-slate-200 font-mono text-xs bg-slate-50 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Expiry Date</label>
                        <Input
                          type="text"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="h-11 border-slate-200 text-center font-mono text-xs bg-slate-50 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">CVV</label>
                        <Input
                          type="password"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          placeholder="•••"
                          maxLength={4}
                          className="h-11 border-slate-200 text-center font-mono text-xs bg-slate-50 rounded-xl"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPI TAB */}
                {razorpayTab === 'upi' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                      <QrCode className="h-7 w-7 text-emerald-700 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 text-xs">Scan & Pay via GPay / PhonePe / Paytm</p>
                        <p className="text-[10px] text-emerald-700 font-medium">Instant 256-Bit Razorpay Auto Verification</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Virtual Payment Address (VPA / UPI ID)</label>
                      <Input
                        type="text"
                        value={upiForm.vpa}
                        onChange={(e) => setUpiForm({ ...upiForm, vpa: e.target.value })}
                        placeholder="mobile@upi / username@okhdfcbank"
                        className="h-11 border-slate-200 font-mono text-xs bg-slate-50 rounded-xl"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Footer Buttons */}
                <div className="pt-3 flex justify-between items-center border-t border-slate-100 gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowRazorpayModal(false)} className="rounded-xl font-bold">
                    &larr; Cancel
                  </Button>
                  <Button
                    onClick={handleRazorpayPayNow}
                    disabled={razorpayProcessing}
                    className="bg-[#0c2340] hover:bg-blue-950 text-white font-extrabold text-xs h-11 px-6 rounded-xl shadow-lg shadow-blue-950/20 flex items-center gap-2"
                  >
                    {razorpayProcessing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" /> Pay ₹ {(selectedPaySample.price || 350).toFixed(2)} via Razorpay
                      </>
                    )}
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
