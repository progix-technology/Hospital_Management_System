import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2, Search, Filter, Eye, Download, Calendar,
  CheckCircle2, User, FileText, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import axios from 'axios';

export default function LabResultsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/users/patients');
      // Filter patients with completed lab reports
      const completedList = (data || []).filter(p => 
        p.clinicalRecord?.labTests && p.clinicalRecord.labTests.length > 0
      );
      setPatients(completedList);
    } catch (error) {
      console.error('Error fetching lab results archive:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPdfReport = (testString) => {
    if (!testString.includes('###PDF_DATA###')) {
      alert('No attached PDF report found for this test.');
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

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.clinicalRecord?.diagnosis || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Completed Lab Test Results Archive
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Search processed diagnostic reports, PDF downloads, and patient records.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, diagnosis or test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading lab test results...</div>
          ) : filteredPatients.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Patient Name</th>
                  <th className="p-4">Diagnosis</th>
                  <th className="p-4">Uploaded Test Reports</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredPatients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">
                      {p.name}
                      <span className="block text-[10px] text-slate-400 font-semibold">{p.phone || p.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#0f6c4f] font-bold text-[10.5px]">
                        {p.clinicalRecord?.diagnosis || 'General Checkup'}
                      </span>
                    </td>
                    <td className="p-4 space-y-1">
                      {p.clinicalRecord?.labTests.map((t, idx) => {
                        const cleanTestName = t.split('###PDF_DATA###')[0].trim();
                        const hasPdf = t.includes('###PDF_DATA###');
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              {cleanTestName}
                            </span>
                            {hasPdf && (
                              <button
                                onClick={() => openPdfReport(t)}
                                className="text-[10px] text-[#0f6c4f] font-bold hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" /> View PDF
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button
                        onClick={() => {
                          const firstPdfTest = p.clinicalRecord?.labTests.find(t => t.includes('###PDF_DATA###'));
                          if (firstPdfTest) openPdfReport(firstPdfTest);
                          else alert('No PDF available for this patient.');
                        }}
                        className="bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold text-xs h-8 px-3 rounded-xl flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Report PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">No lab results found in archive.</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
