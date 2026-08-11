import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Search, Upload, Eye, CheckCircle, Clock, Check, Plus, AlertCircle, FileText, CheckCircle2, FlaskConical, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import axios from 'axios';

export default function LabRequestsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selection, Upload & PDF File states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [testResultText, setTestResultText] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [reportFileName, setReportFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const [{ data: allPatients }, { data: allAppointments }] = await Promise.all([
        axios.get('http://localhost:5000/api/users/patients'),
        axios.get('http://localhost:5000/api/appointments').catch(() => ({ data: [] }))
      ]);

      const validAppointments = Array.isArray(allAppointments) ? allAppointments : [];

      const assignedTechPatients = (allPatients || []).filter(p =>
        p.clinicalRecord?.labTests && p.clinicalRecord.labTests.length > 0
      ).map(p => {
        const patientApts = validAppointments.filter(a => 
          a.patient?._id?.toString() === p._id?.toString() || 
          a.patient?.toString() === p._id?.toString()
        );

        let exactAssignedDate = null;
        if (patientApts.length > 0) {
          const sortedApts = [...patientApts].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
          exactAssignedDate = new Date(sortedApts[0].date || sortedApts[0].createdAt);
        } else if (p.vitals?.lastUpdated) {
          exactAssignedDate = new Date(p.vitals.lastUpdated);
        } else {
          exactAssignedDate = new Date(p.createdAt || p.updatedAt || Date.now());
        }

        const prescribedDateStr = exactAssignedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        return { ...p, prescribedDateStr, exactAssignedDate };
      });

      // Sort newest requests to appear at the TOP
      assignedTechPatients.sort((a, b) => {
        const timeA = new Date(a.exactAssignedDate || a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.exactAssignedDate || b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setPatients(assignedTechPatients);
    } catch (error) {
      console.error('Error fetching patients for laboratory tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setTestResultText('');
    setReportFile(null);
    setReportFileName('');
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

  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    if (!testResultText.trim()) {
      alert('Please fill out the test results first.');
      return;
    }

    try {
      setUploading(true);

      const existingTests = selectedPatient.clinicalRecord?.labTests || [];
      const updatedTests = existingTests.map(t => {
        const cleanName = t.split('###PDF_DATA###')[0].split('(Attached PDF:')[0].trim();
        let formattedString = `${cleanName} - (${testResultText})`;
        if (reportFile) {
          formattedString += `###PDF_DATA###${reportFile}`;
        }
        return formattedString;
      });

      const updatedRecord = {
        ...selectedPatient.clinicalRecord,
        labTests: updatedTests
      };

      await axios.put(`http://localhost:5000/api/users/patients/${selectedPatient._id}/vitals`, {
        clinicalRecord: updatedRecord
      });

      alert(`Official lab test report successfully saved for ${selectedPatient.name}!`);
      setSelectedPatient(null);
      setTestResultText('');
      setReportFile(null);
      setReportFileName('');
      fetchPatients();
    } catch (error) {
      console.error('Error saving lab test report:', error);
      alert('Failed to upload report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openPdf = (testString) => {
    if (!testString.includes('###PDF_DATA###')) {
      alert('No PDF report attached.');
      return;
    }
    const parts = testString.split('###PDF_DATA###');
    const pdfData = parts[1];

    if (pdfData.startsWith('http://') || pdfData.startsWith('https://')) {
      window.open(pdfData, '_blank');
      return;
    }

    try {
      const base64Content = pdfData.includes(',') ? pdfData.split(',')[1] : pdfData;
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (e) {
      console.error('Error opening PDF blob:', e);
      alert('Unable to open PDF report.');
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.clinicalRecord?.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const hasCompletedReport = p.clinicalRecord?.labTests.some(t => t.includes('###PDF_DATA###') || t.includes('- ('));
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Pending' && !hasCompletedReport) ||
                          (statusFilter === 'Completed' && hasCompletedReport);

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const isCompletedA = a.clinicalRecord?.labTests.some(t => t.includes('###PDF_DATA###') || t.includes('- (')) ? 1 : 0;
    const isCompletedB = b.clinicalRecord?.labTests.some(t => t.includes('###PDF_DATA###') || t.includes('- (')) ? 1 : 0;
    return isCompletedA - isCompletedB; // 0 (pending) comes first, 1 (completed) moves to bottom!
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-16">
      
      {/* Page Banner Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0f6c4f] via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Microscope className="h-4 w-4" /> Laboratory Diagnostic Orders
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Patient Diagnostic Lab Requests
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm font-medium mt-1">
            Review physician test orders, perform pathology testing, and upload official PDF clinical reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Patient Lab Requests Table (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <Card className="border border-slate-200/80 shadow-md bg-white rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {['All', 'Pending', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-[#0f6c4f] text-white shadow-md shadow-[#0f6c4f]/20 font-extrabold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <CardContent className="p-0 overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-xs font-bold text-slate-400">Loading lab test requests...</div>
              ) : filteredPatients.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="p-4 pl-6">Patient</th>
                      <th className="p-4">Diagnosed For</th>
                      <th className="p-4">Recommended Tests</th>
                      <th className="p-4 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredPatients.map((p) => {
                      const isSelected = selectedPatient?._id === p._id;
                      return (
                        <tr
                          key={p._id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <td className="p-4 pl-6 font-bold text-slate-900">
                            <div className="text-sm">{p.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono font-semibold">ID: #{p._id?.substring(18).toUpperCase()}</span>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200/60">
                                📅 {p.prescribedDateStr}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-[#0f6c4f] font-bold text-[11px] border border-emerald-100/80 inline-block">
                              {p.clinicalRecord?.diagnosis || 'General Checkup'}
                            </span>
                          </td>
                          <td className="p-4 space-y-1.5">
                            {p.clinicalRecord?.labTests.map((t, idx) => {
                              let cleanTestName = t.split('###PDF_DATA###')[0].split('(Attached PDF:')[0].trim();
                              const hasPdf = t.includes('###PDF_DATA###') || t.includes('(Attached PDF:');
                              return (
                                <div key={idx} className="flex flex-wrap items-center gap-2">
                                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-[11px]">
                                    {cleanTestName}
                                  </span>
                                  {hasPdf && (
                                    <button
                                      type="button"
                                      onClick={() => openPdf(t)}
                                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold hover:bg-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <FileText className="h-3 w-3" /> View PDF Report
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <Button
                              onClick={() => handleSelectPatient(p)}
                              className={`h-9 px-4 text-xs font-bold rounded-xl whitespace-nowrap inline-flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                                isSelected
                                  ? 'bg-slate-900 text-white shadow-md'
                                  : 'bg-[#0f6c4f] hover:bg-emerald-800 text-white'
                              }`}
                            >
                              <Upload className="h-3.5 w-3.5" />
                              {isSelected ? 'Editing' : 'Update Report'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-16 text-center text-xs font-bold text-slate-400">
                  No pending lab requests found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive Report Upload / Findings Form (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          {selectedPatient ? (
            <Card className="border border-slate-200/80 shadow-xl bg-white rounded-3xl overflow-hidden sticky top-24">
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 via-white to-white flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Upload Clinical Findings</h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Patient: {selectedPatient.name}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#0f6c4f] text-white text-[10px] font-bold uppercase tracking-wider">Active</span>
              </div>

              <CardContent className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">Recommended Diagnostic Tests:</label>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 space-y-1.5">
                    {selectedPatient.clinicalRecord?.labTests.map((t, idx) => (
                      <p key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <span className="h-2 w-2 rounded-full bg-[#0f6c4f]" />
                        {t.split('###PDF_DATA###')[0].split('(Attached PDF:')[0].trim()}
                      </p>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleUploadReport} className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Test Observations / Remarks <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      value={testResultText}
                      onChange={(e) => setTestResultText(e.target.value)}
                      placeholder="e.g. Hemoglobin: 14.2 g/dL (Normal Range), Fasting Blood Sugar: 98 mg/dL..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Attach Official PDF Report (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-[#0f6c4f] transition-colors relative bg-slate-50/50">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="h-7 w-7 text-[#0f6c4f] mx-auto mb-1.5" />
                      <p className="font-extrabold text-slate-800 text-xs">
                        {reportFileName ? reportFileName : 'Click or Drag PDF file here'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">Maximum file size: 5MB (PDF only)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedPatient(null)}
                      className="flex-1 h-11 rounded-2xl text-xs font-bold border-slate-200 text-slate-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 h-11 rounded-2xl text-xs font-bold bg-[#0f6c4f] hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/10"
                    >
                      {uploading ? 'Saving...' : 'Save & Publish Report'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-slate-200 border-dashed bg-white p-8 text-center rounded-3xl shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#0f6c4f] flex items-center justify-center mx-auto mb-3">
                <Microscope className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Select a Patient Request</h4>
              <p className="text-slate-400 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
                Click <strong className="text-slate-700">"Update Report"</strong> on any patient request from the active list to input diagnostic test observations and attach PDF clinical reports.
              </p>
            </Card>
          )}
        </div>

      </div>
    </motion.div>
  );
}
