import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Printer, ArrowLeft, FileText, CheckCircle, ShieldAlert, Eye, Download } from 'lucide-react';
import axios from 'axios';

// Injecting print specific styling for single page output with multi-page support for lab attachments
const printStyles = `
@media print {
  html, body {
    height: auto !important;
    overflow: visible !important;
    font-size: 11px !important;
    background: white !important;
    color: black !important;
  }
  .print\\:hidden, header, nav, footer, sidebar, button {
    display: none !important;
  }
  .max-w-3xl {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .shadow-lg {
    box-shadow: none !important;
  }
  /* Outer professional border for printing main summary only */
  .border-slate-100 {
    border: 1px solid #000000 !important;
    border-radius: 8px !important;
  }
  .p-8, .sm\\:p-12 {
    padding: 20px !important;
  }
  
  .print-page-break {
    page-break-before: always !important;
    break-before: page !important;
  }
  .print-full-width {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }
  .print-header-hidden {
    display: none !important;
  }
  
  /* Ensure the iframe fills the printing viewport completely */
  .print-iframe-pdf {
    width: 100% !important;
    height: 297mm !important; /* Standard A4 height exactly */
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  @page {
    size: A4 portrait;
    margin: 0 !important; /* Zero margin on page to let PDF print full scale */
  }
}
`;

export default function RecordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patientDbId, setPatientDbId] = useState(null);

  // Load doctor-reviewed report IDs from localStorage
  const reviewedIds = (() => {
    try { return JSON.parse(localStorage.getItem('doctor_reviewed_reports') || '[]'); }
    catch { return []; }
  })();

  useEffect(() => {
    const fetchRecordDetail = async () => {
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

          if (data) {
            setPatientDbId(data._id || userInfo._id);

            // 1. Check if ID matches a medicalRecords entry
            let targetRec = null;
            if (data.medicalRecords && Array.isArray(data.medicalRecords)) {
              targetRec = data.medicalRecords.find(r => r.recordId === id);
            }

            // 2. Check if ID matches an appointment
            if (!targetRec && id.startsWith('APT-REC-')) {
              const aptId = id.replace('APT-REC-', '');
              const targetApt = appointments.find(a => a._id === aptId);
              if (targetApt) {
                const aptDate = new Date(targetApt.date || targetApt.createdAt);
                targetRec = {
                  recordId: id,
                  date: aptDate,
                  doctor: {
                    name: targetApt.doctor?.name || 'Dr. Ritik Pandey',
                    specialty: targetApt.doctor?.specialty || 'General Physician'
                  },
                  chiefComplaint: targetApt.complaint || targetApt.type || 'Consultation Visit',
                  diagnosis: targetApt.complaint || 'Doctor Consultation',
                  doctorNotes: targetApt.type ? `Consultation Type: ${targetApt.type}. Routine checkup completed.` : 'Clinical consultation completed.',
                  followUpDate: null,
                  prescriptions: data.clinicalRecord?.prescriptions || [],
                  labTests: data.clinicalRecord?.labTests || []
                };
              }
            }

            if (targetRec) {
              const recDate = targetRec.date ? new Date(targetRec.date) : new Date();
              setRecord({
                id: targetRec.recordId || id,
                name: `Consultation Record (${targetRec.diagnosis || 'Clinical Visit'})`,
                type: 'Comprehensive Report',
                date: recDate.toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }),
                doctor: targetRec.doctor?.name || 'Dr. Ritik Pandey',
                details: {
                  chiefComplaint: targetRec.chiefComplaint || 'N/A',
                  diagnosis: targetRec.diagnosis || 'General Checkup',
                  notes: targetRec.doctorNotes || 'No specific notes recorded.',
                  followUp: targetRec.followUpDate ? new Date(targetRec.followUpDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : 'None Scheduled'
                },
                prescriptions: targetRec.prescriptions || [],
                labTests: targetRec.labTests || []
              });
            } else if (data.clinicalRecord) {
              const cr = data.clinicalRecord;
              setRecord({
                id: id,
                name: `Consultation Record (${cr.diagnosis || 'Health Summary'})`,
                type: 'Comprehensive Report',
                date: data.vitals?.lastUpdated ? new Date(data.vitals.lastUpdated).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) : new Date().toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }),
                doctor: 'Dr. Ritik Pandey',
                details: {
                  chiefComplaint: cr.chiefComplaint || 'N/A',
                  diagnosis: cr.diagnosis || 'General Checkup',
                  notes: cr.doctorNotes || 'No specific notes recorded.',
                  followUp: cr.followUpDate ? new Date(cr.followUpDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : 'None Scheduled'
                },
                prescriptions: cr.prescriptions || [],
                labTests: cr.labTests || []
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching record detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading document details...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">Document Not Found</h3>
        <p className="text-slate-500 text-sm">The medical record requested could not be found.</p>
        <Button onClick={() => navigate('/portal/records')} className="bg-[#0f6c4f] text-white">
          Back to Medical Records
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-3xl mx-auto space-y-6 pb-12"
    >
      <style>{printStyles}</style>
      {/* Back button and actions (Hidden when printing) */}
      <div className="flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate('/portal/records')} 
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Records
        </button>
        <Button 
          onClick={() => window.print()} 
          className="bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-lg flex items-center gap-2"
        >
          <Printer className="h-4 w-4" /> Print / Save PDF
        </Button>
      </div>

      {/* Main Medical Document */}
      <Card className="shadow-lg border-slate-100 rounded-3xl overflow-hidden print:shadow-none print:border-none print:m-0">
        <CardContent className="p-8 sm:p-12 space-y-8">
          
          {/* Institution Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img src="/applogo.png" alt="Medisphere Logo" className="h-12 w-12 object-contain" />
              <div className="text-left">
                <h2 className="font-extrabold text-2xl font-serif text-slate-800 tracking-tight leading-none mb-1">Medisphere</h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Hospital & Research Center</p>
              </div>
            </div>
            <div className="text-center sm:text-right text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">Phone: +91 89532 08952</p>
              <p>info@progixtechnology.com</p>
              <p>Lucknow, Uttar Pradesh</p>
            </div>
          </div>

          {/* Record Title metadata block */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0f6c4f]">{record.type}</span>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">{record.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Ref ID: #{record.id.toUpperCase()}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500">Date Issued</p>
              <p className="font-bold text-slate-800 mt-0.5">{record.date}</p>
              <Badge className="bg-emerald-100 text-emerald-800 border-transparent mt-2 text-[10px]">Official EHR Record</Badge>
            </div>
          </div>

          {/* Content Block displaying everything on one page */}
          <div className="space-y-6">
            
            {/* Clinical Overview Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 col-span-2">Clinical Details & Diagnosis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr>
                    <td className="px-5 py-3 font-semibold text-slate-400 w-1/3">Chief Complaint</td>
                    <td className="px-5 py-3 text-slate-700 font-medium">{record.details.chiefComplaint}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-semibold text-slate-400">Diagnosis Summary</td>
                    <td className="px-5 py-3 text-emerald-800 font-bold bg-emerald-50/20">{record.details.diagnosis}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-semibold text-slate-400">Doctor's Observations</td>
                    <td className="px-5 py-3 text-slate-600 italic">"{record.details.notes}"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Prescribed Medicines (Rx) Table */}
            {record.prescriptions.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Prescribed Medications (Rx)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">Medicine Name</th>
                        <th className="px-5 py-3">Dosage</th>
                        <th className="px-5 py-3">Frequency</th>
                        <th className="px-5 py-3">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {record.prescriptions.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-800">{med.medicineName}</td>
                          <td className="px-5 py-3.5 text-slate-600 font-medium">{med.dosage}</td>
                          <td className="px-5 py-3.5 text-slate-600">{med.frequency}</td>
                          <td className="px-5 py-3.5 text-slate-500 font-semibold">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lab Investigations Table */}
            {record.labTests.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 w-1/2">Investigation / Test Name</th>
                      <th className="px-5 py-3 w-1/2">Assigned / Updated By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {record.labTests.map((test, idx) => {
                      const hasPdfSeparator = test.includes('###PDF_DATA###');
                      let testName = test;

                      if (hasPdfSeparator) {
                        const parts = test.split('###PDF_DATA###');
                        testName = parts[0];
                      }

                      const isTechUploaded = test.includes('Uploaded by Lab Tech') || hasPdfSeparator || test.includes('(Attached PDF:');

                      // Check if doctor reviewed this specific report
                      const shortId = patientDbId ? patientDbId.slice(-4).toUpperCase() : '';
                      const reportId = shortId ? `RPT-${shortId}-${String(idx + 1).padStart(2, '0')}` : null;
                      const isReviewedByDoctor = isTechUploaded && reportId && reviewedIds.includes(reportId);

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-medium">
                            🔬 {testName.split('(Attached')[0].split('- (Report')[0].trim()}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-500">
                                {isTechUploaded ? 'Lab Technician' : 'Prescribed by Doctor'}
                              </span>
                              {isReviewedByDoctor && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  <CheckCircle className="h-3 w-3" /> Reviewed by Doctor
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Follow up Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody className="text-xs">
                  <tr>
                    <td className="px-5 py-3 font-semibold text-slate-400 w-1/3">Suggested Follow-up Date</td>
                    <td className="px-5 py-3 text-emerald-800 font-bold bg-emerald-50/10">{record.details.followUp}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* EHR Footer Signature */}
          <div className="pt-6 border-t border-dashed border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
            <div>
              <p className="font-bold text-slate-600">Issued by: {record.doctor}</p>
              <p className="mt-0.5">Medisphere EHR Authorized</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="flex items-center gap-1.5 justify-center sm:justify-end text-emerald-600 font-semibold">
                <CheckCircle className="h-3.5 w-3.5" /> Digitally Verified EHR Document
              </p>
              <p className="mt-0.5">Secure PDF Generation</p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Render uploaded laboratory report PDF documents directly below the main EHR summary card */}
      {record.labTests.some(t => t.includes('###PDF_DATA###')) && (
        <div className="space-y-6 pt-12 print-page-break print-full-width">
          {record.labTests
            .filter(t => t.includes('###PDF_DATA###'))
            .map((test, idx) => {
              const parts = test.split('###PDF_DATA###');
              const testTitle = parts[0].split('(Attached')[0].trim();
              const pdfUrl = parts[1] || '';

              if (!pdfUrl) return null;

              // Check if doctor has reviewed this report (uses same reportId as DoctorReports.jsx)
              const shortId = patientDbId ? patientDbId.slice(-4).toUpperCase() : '';
              const reportId = shortId ? `RPT-${shortId}-${String(idx + 1).padStart(2, '0')}` : null;
              const isReviewedByDoctor = reportId && reviewedIds.includes(reportId);

              return (
                <Card key={idx} className="border-slate-200 overflow-hidden shadow-sm mt-8 print-full-width print:mt-0 print:border-none">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print-header-hidden">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      🔬 Lab Investigation Report Attachment: {testTitle}
                    </h4>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Official Uploaded PDF
                    </span>
                  </div>
                  <CardContent className="p-0 print-full-width">
                    <iframe
                      src={pdfUrl}
                      title={`Report PDF - ${testTitle}`}
                      className="w-full min-h-[800px] border-0 print-iframe-pdf"
                    />
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </motion.div>
  );
}
