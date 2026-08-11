import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Filter, Download, Eye, CheckCircle, Clock,
  X, ChevronDown, AlertCircle, Microscope, User, Calendar,
  ExternalLink, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import axios from 'axios';

// ─── Parse a labTest string into structured data ───────────────────────────────
function parseLabTest(raw, patientId, patientName, gender) {
  const hasPdf = raw.includes('###PDF_DATA###');
  let label = raw;
  let pdfUrl = '';
  let uploadedAt = null;

  if (hasPdf) {
    const parts = raw.split('###PDF_DATA###');
    label = parts[0].split('(Attached')[0].split('- (Report')[0].trim();
    pdfUrl = parts[1] || '';

    // Extract date from label if it was appended like "(Attached: DD/MM/YYYY)"
    const dateMatch = parts[0].match(/\(Attached[^)]*(\d{2}\/\d{2}\/\d{4})/);
    if (dateMatch) {
      const [d, m, y] = dateMatch[1].split('/');
      uploadedAt = new Date(`${y}-${m}-${d}`);
    }
  }

  return { raw, label: label || 'Lab Report', pdfUrl, hasPdf, patientId, patientName, gender, uploadedAt };
}

// ─── Open PDF in new tab (handles both HTTP URLs and base64 data URIs) ────────
function openPdf(pdfUrl) {
  if (!pdfUrl) return;

  if (pdfUrl.startsWith('http')) {
    // Cloudinary / remote URL — open directly
    window.open(pdfUrl, '_blank');
    return;
  }

  if (pdfUrl.startsWith('data:')) {
    // Base64 data URL — convert to Blob URL and open
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
      alert('Could not open PDF. The file may be corrupted.');
    }
    return;
  }

  // Fallback
  window.open(pdfUrl, '_blank');
}

// ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
function PdfModal({ report, onClose }) {
  const openPdf = () => {
    if (report.pdfUrl.startsWith('http')) {
      window.open(report.pdfUrl, '_blank');
    } else {
      const win = window.open();
      if (win) {
        win.document.write(`<html><body style="margin:0"><iframe src="${report.pdfUrl}" width="100%" height="100%" style="border:none"/></body></html>`);
        win.document.close();
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{report.label}</h3>
                <p className="text-xs text-slate-500">Patient: {report.patientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open Full Screen
              </button>
              <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* PDF Iframe */}
          <div className="flex-1 bg-slate-100 overflow-hidden min-h-0">
            {report.pdfUrl ? (
              report.pdfUrl.startsWith('http') ? (
                <iframe
                  src={report.pdfUrl}
                  title="Lab Report PDF"
                  className="w-full h-full border-none"
                  style={{ minHeight: '60vh' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-10 text-center">
                  <div className="space-y-3">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm">PDF stored locally. Click "Open Full Screen" to view.</p>
                    <button onClick={openPdf} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                      Open PDF
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">No PDF available.</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DoctorReports() {
  const [loading, setLoading] = useState(true);
  const [allReports, setAllReports] = useState([]);
  const [reviewedIds, setReviewedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('doctor_reviewed_reports') || '[]'); }
    catch { return []; }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data: patients } = await axios.get('http://localhost:5000/api/users/patients');

      const reports = [];
      patients.forEach(patient => {
        const tests = patient.clinicalRecord?.labTests || [];
        tests.forEach((raw, idx) => {
          if (raw && raw.trim()) {
            const parsed = parseLabTest(raw, patient._id, patient.name, patient.gender);
            const reportId = `RPT-${patient._id.slice(-4).toUpperCase()}-${String(idx + 1).padStart(2, '0')}`;
            
            // If report is published/has PDF, use updatedAt (when lab tech published it), else use createdAt
            let pDate = parsed.uploadedAt;
            if (!pDate || isNaN(pDate.getTime())) {
              const isPublished = parsed.hasPdf || raw.includes('- (');
              pDate = new Date(isPublished ? (patient.updatedAt || patient.createdAt) : (patient.createdAt || patient.updatedAt));
            }

            const formattedDate = pDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            reports.push({ ...parsed, uploadedAt: pDate, formattedDate, reportId, idx });
          }
        });
      });

      // Sort: most recent first (those without date go to bottom)
      reports.sort((a, b) => {
        if (!a.uploadedAt && !b.uploadedAt) return 0;
        if (!a.uploadedAt) return 1;
        if (!b.uploadedAt) return -1;
        return b.uploadedAt - a.uploadedAt;
      });

      setAllReports(reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const markReviewed = (reportId) => {
    setReviewedIds(prev => {
      const updated = prev.includes(reportId) ? prev.filter(id => id !== reportId) : [...prev, reportId];
      localStorage.setItem('doctor_reviewed_reports', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredReports = useMemo(() => {
    const list = allReports.filter(r => {
      const matchSearch =
        r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reportId.toLowerCase().includes(searchTerm.toLowerCase());
      const isReviewed = reviewedIds.includes(r.reportId);
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Pending' && !isReviewed) ||
        (statusFilter === 'Reviewed' && isReviewed);
      return matchSearch && matchStatus;
    });

    // Pure Newest-First Date/Time Sorting: Newest reports ALWAYS stay at the TOP!
    return list.sort((a, b) => {
      const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : (a.idx || 0);
      const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : (b.idx || 0);
      return timeB - timeA;
    });
  }, [allReports, searchTerm, statusFilter, reviewedIds]);

  const pendingCount = allReports.filter(r => !reviewedIds.includes(r.reportId)).length;
  const reviewedCount = allReports.filter(r => reviewedIds.includes(r.reportId)).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">Medical Reports</h2>
          <p className="text-[var(--color-muted-foreground)] text-sm mt-0.5">Review lab results and uploaded reports from patients.</p>
        </div>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Reports', value: allReports.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: FileText },
          { label: 'Pending Review', value: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
          { label: 'Reviewed', value: reviewedCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle }
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <Card key={label} className="border-slate-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by patient name, report type or ID..."
            className="pl-10 h-11 bg-white border-slate-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(p => !p)}
            className={`flex items-center gap-2 h-11 px-4 rounded-lg border text-sm font-semibold transition-colors shadow-sm ${statusFilter !== 'All' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
          >
            <Filter className="h-4 w-4" />
            {statusFilter === 'All' ? 'All Status' : statusFilter}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden">
              {['All', 'Pending', 'Reviewed'].map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {s === 'All' ? '🗂️ All Reports' : s === 'Pending' ? '⏳ Pending Review' : '✅ Reviewed'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reports Table */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent mb-3" />
            <p className="text-sm text-slate-400">Loading patient reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <FileText className="h-7 w-7 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-500">No reports found</p>
            <p className="text-sm text-slate-400">
              {searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'No lab reports have been uploaded by patients yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Report ID</th>
                  <th className="px-5 py-3.5 font-semibold">Patient</th>
                  <th className="px-5 py-3.5 font-semibold">Report / Test Name</th>
                  <th className="px-5 py-3.5 font-semibold">Uploaded</th>
                  <th className="px-5 py-3.5 font-semibold">PDF</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredReports.map((report) => {
                  const isReviewed = reviewedIds.includes(report.reportId);
                  return (
                    <tr key={report.reportId} className="hover:bg-slate-50/60 transition-colors">
                      {/* Report ID & Uploaded Date */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-1 rounded inline-block">
                          {report.reportId}
                        </span>
                        <span className="block text-[11px] font-bold text-slate-500 mt-1">
                          {report.formattedDate}
                        </span>
                      </td>

                      {/* Patient */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {report.patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{report.patientName}</p>
                            {report.gender && <p className="text-xs text-slate-400">{report.gender}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Report Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Microscope className="h-4 w-4 text-purple-500 shrink-0" />
                          <span className="font-medium text-slate-700 max-w-[180px] truncate" title={report.label}>
                            {report.label}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-500 text-xs">
                        {report.uploadedAt
                          ? report.uploadedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : <span className="text-slate-300">—</span>}
                      </td>

                      {/* PDF Available */}
                      <td className="px-5 py-4">
                        {report.hasPdf && report.pdfUrl ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle className="h-3 w-3" /> PDF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                            <AlertCircle className="h-3 w-3" /> None
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {isReviewed ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                            <CheckCircle className="h-3.5 w-3.5" /> Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                            <Clock className="h-3.5 w-3.5" /> Pending Review
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* View PDF — opens directly in new tab */}
                          {report.hasPdf && report.pdfUrl && (
                            <button
                              onClick={() => openPdf(report.pdfUrl)}
                              title="View Report PDF"
                              className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {/* Open External */}
                          {report.pdfUrl && report.pdfUrl.startsWith('http') && (
                            <button
                              onClick={() => window.open(report.pdfUrl, '_blank')}
                              title="Download / Open in new tab"
                              className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          {/* Mark Reviewed Toggle */}
                          <button
                            onClick={() => markReviewed(report.reportId)}
                            title={isReviewed ? 'Mark as Pending' : 'Mark as Reviewed'}
                            className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${isReviewed
                              ? 'bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                          >
                            {isReviewed ? <><X className="h-3.5 w-3.5" /> Undo</> : <><CheckCircle className="h-3.5 w-3.5" /> Mark Reviewed</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!loading && filteredReports.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
            <p className="text-xs text-slate-400 font-medium">
              Showing {filteredReports.length} of {allReports.length} report{allReports.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
