import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { Input } from '../../../components/Input';
import {
  FileText, Download, Filter, Search, Plus, Eye, RefreshCw, X,
  Microscope, DollarSign, Users, Calendar, CheckCircle2, AlertCircle,
  FileSpreadsheet, FilePlus, ExternalLink, Shield
} from 'lucide-react';
import axios from 'axios';

// Helper to open PDF (handles base64 & HTTP links)
function openPdf(pdfUrl) {
  if (!pdfUrl) return alert('No PDF attachment available.');
  if (pdfUrl.startsWith('http')) {
    window.open(pdfUrl, '_blank');
    return;
  }
  if (pdfUrl.startsWith('data:')) {
    try {
      const [header, base64] = pdfUrl.split(',');
      const mimeMatch = header.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const byteChars = atob(base64);
      const byteNums = new Array(byteChars.length).fill(0).map((_, i) => byteChars.charCodeAt(i));
      const byteArray = new Uint8Array(byteNums);
      const blob = new Blob([byteArray], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Failed to open PDF:', err);
      alert('Could not open PDF file.');
    }
    return;
  }
  window.open(pdfUrl, '_blank');
}

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [labReports, setLabReports] = useState([]);
  const [systemReports, setSystemReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Data stores for custom report generation
  const [patientsData, setPatientsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);

  // Generate Report Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [genConfig, setGenConfig] = useState({
    type: 'Financial Summary',
    format: 'CSV'
  });
  const [generating, setGenerating] = useState(false);

  const fetchAllReportData = async () => {
    try {
      setLoading(true);
      const [pRes, dRes, aRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/patients'),
        axios.get('http://localhost:5000/api/users/doctors'),
        axios.get('http://localhost:5000/api/appointments').catch(() => ({ data: [] }))
      ]);

      const patients = pRes.data || [];
      const doctors = dRes.data || [];
      const appointments = aRes.data || [];

      setPatientsData(patients);
      setDoctorsData(doctors);
      setAppointmentsData(appointments);

      // Extract all Lab PDF reports uploaded by technicians/doctors for patients
      const extractedLabReports = [];
      patients.forEach(patient => {
        const tests = patient.clinicalRecord?.labTests || [];
        tests.forEach((test, idx) => {
          if (test && test.trim()) {
            const hasPdf = test.includes('###PDF_DATA###');
            let testName = test;
            let pdfUrl = '';

            if (hasPdf) {
              const parts = test.split('###PDF_DATA###');
              testName = parts[0].split('(Attached')[0].split('- (Report')[0].trim();
              pdfUrl = parts[1] || '';
            }

            extractedLabReports.push({
              id: `LAB-RPT-${patient._id.slice(-4).toUpperCase()}-${String(idx + 1).padStart(2, '0')}`,
              name: testName || 'Laboratory Test',
              patientName: patient.name,
              patientId: patient._id,
              category: 'Laboratory',
              hasPdf,
              pdfUrl,
              date: patient.updatedAt
                ? new Date(patient.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Recent',
              size: hasPdf ? 'PDF File' : 'Clinical Record'
            });
          }
        });
      });

      setLabReports(extractedLabReports);

      // System generated administrative reports
      const generatedSysReports = [
        {
          id: 'SYS-RPT-001',
          name: 'Monthly Financial & Revenue Summary',
          category: 'Financial',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          size: `${appointments.length} Records`,
          type: 'Financial'
        },
        {
          id: 'SYS-RPT-002',
          name: 'Registered Patients Registry & Demographics',
          category: 'Clinical',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          size: `${patients.length} Patients`,
          type: 'Patients'
        },
        {
          id: 'SYS-RPT-003',
          name: 'Medical Staff & Doctor Roster Audit',
          category: 'Operations',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          size: `${doctors.length} Doctors`,
          type: 'Staff'
        },
        {
          id: 'SYS-RPT-004',
          name: 'Hospital Appointments Audit Log',
          category: 'Operations',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          size: `${appointments.length} Entries`,
          type: 'Appointments'
        }
      ];

      setSystemReports(generatedSysReports);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReportData();
  }, []);

  // Combined reports list
  const allCombinedReports = useMemo(() => {
    return [...labReports, ...systemReports];
  }, [labReports, systemReports]);

  // Filtered list
  const filteredReports = useMemo(() => {
    return allCombinedReports.filter(rpt => {
      const matchSearch =
        rpt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rpt.patientName && rpt.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        rpt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rpt.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'All' || rpt.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [allCombinedReports, searchTerm, categoryFilter]);

  // Dynamic Export Handler for System Reports
  const handleDownloadSystemReport = (reportType) => {
    let headers = [];
    let rows = [];
    let filename = `Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'Financial' || reportType === 'Appointments') {
      headers = ['Appointment ID', 'Patient Name', 'Doctor Name', 'Doctor Specialty', 'Date', 'Time Slot', 'Fee (₹)', 'Payment Method', 'Status'];
      rows = appointmentsData.map(a => [
        a._id,
        `"${a.patient?.name || ''}"`,
        `"${a.doctor?.name || ''}"`,
        `"${a.doctor?.specialty || ''}"`,
        a.date ? new Date(a.date).toISOString().split('T')[0] : '',
        `"${a.timeSlot || ''}"`,
        a.fee || 500,
        a.paymentMethod || 'Cash',
        a.status || 'Scheduled'
      ]);
    } else if (reportType === 'Patients') {
      headers = ['Patient ID', 'Full Name', 'Email', 'Phone', 'Gender', 'Date of Birth', 'Blood Group'];
      rows = patientsData.map(p => [
        p._id,
        `"${p.name || ''}"`,
        p.email || '',
        p.phone || '',
        p.gender || '',
        p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
        p.bloodGroup || ''
      ]);
    } else if (reportType === 'Staff') {
      headers = ['Doctor ID', 'Name', 'Specialty', 'Email', 'Phone', 'Gender'];
      rows = doctorsData.map(d => [
        d._id,
        `"${d.name || ''}"`,
        `"${d.specialty || ''}"`,
        d.email || '',
        d.phone || '',
        d.gender || ''
      ]);
    }

    if (rows.length === 0) return alert('No data available for this report.');

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Custom Report Trigger
  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      let rType = 'Financial';
      if (genConfig.type === 'Patient Registry') rType = 'Patients';
      if (genConfig.type === 'Doctor Staff Roster') rType = 'Staff';
      if (genConfig.type === 'Appointments Audit Log') rType = 'Appointments';

      handleDownloadSystemReport(rType);
      setGenerating(false);
      setIsGenerateModalOpen(false);
    }, 600);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Reports Central</h2>
          <p className="text-slate-500 text-sm mt-1">Access, review lab PDF reports and generate hospital audit reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchAllReportData} disabled={loading} className="bg-white border-slate-200">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={() => setIsGenerateModalOpen(true)} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
            <FilePlus className="mr-2 h-4 w-4" /> Generate New Report
          </Button>
        </div>
      </div>

      {/* Stats Header Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Microscope className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{labReports.length}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Patient Lab Reports</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{appointmentsData.length}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Financial Audits</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{patientsData.length}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Patient Census Files</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{systemReports.length}</p>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">System Reports</p>
          </div>
        </div>
      </div>

      {/* Main Reports Table & Toolbar */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search reports by title, patient name or ID..."
              className="pl-10 h-10 bg-white border-slate-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Tabs */}
            <div className="flex items-center bg-slate-200/60 p-1 rounded-xl">
              {['All', 'Laboratory', 'Financial', 'Operations', 'Clinical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold">Report Name / File</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Details / Patient</th>
                <th className="px-6 py-4 font-bold">Date Generated</th>
                <th className="px-6 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-16">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f6c4f] border-r-transparent mb-2" />
                    <p className="text-slate-400 text-sm font-medium">Loading reports...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-slate-400">
                    <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No reports found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isLab = report.category === 'Laboratory';

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            isLab ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {isLab ? <Microscope className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{report.name}</p>
                            <span className="font-mono text-[10px] text-slate-400">{report.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          report.category === 'Laboratory'
                            ? 'bg-purple-50 text-purple-700 border border-purple-100'
                            : report.category === 'Financial'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {report.category}
                        </span>
                      </td>

                      {/* Details / Patient */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {isLab ? (
                          <div>
                            <span className="text-slate-800">Patient: {report.patientName}</span>
                            {report.hasPdf && (
                              <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Attached PDF
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">{report.size}</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {report.date}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {isLab ? (
                          report.hasPdf && report.pdfUrl ? (
                            <Button
                              onClick={() => openPdf(report.pdfUrl)}
                              size="sm"
                              className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View PDF
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No Attachment</span>
                          )
                        ) : (
                          <Button
                            onClick={() => handleDownloadSystemReport(report.type)}
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-white text-[#0f6c4f] border-[#0f6c4f]/40 hover:bg-emerald-50 rounded-lg"
                          >
                            <Download className="h-3.5 w-3.5 mr-1" /> Download CSV
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Generate Custom Report Modal */}
      <AnimatePresence>
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <FilePlus className="h-5 w-5 text-[#0f6c4f]" /> Generate Hospital Audit Report
                </h3>
                <button onClick={() => setIsGenerateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleGenerateSubmit} className="p-6 space-y-5 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Select Report Type</label>
                  <select
                    value={genConfig.type}
                    onChange={(e) => setGenConfig({ ...genConfig, type: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl font-medium text-slate-700 bg-white"
                  >
                    <option value="Financial Summary">Financial & Revenue Summary (CSV)</option>
                    <option value="Patient Registry">Registered Patients Census (CSV)</option>
                    <option value="Doctor Staff Roster">Doctor & Medical Staff Directory (CSV)</option>
                    <option value="Appointments Audit Log">Appointments Schedule Audit Log (CSV)</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-700">Export Information:</p>
                  <p className="text-slate-500 leading-relaxed">
                    This will extract all real-time MongoDB database records according to your chosen report type and trigger an instant download.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={generating} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
                    {generating ? 'Generating...' : 'Download Report'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
