import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Badge } from '../../../components/Badge';
import {
  Search, Plus, Filter, Download, User, Phone, Mail, MapPin,
  Trash2, Eye, RefreshCw, Calendar, Droplets, Heart, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Helper to calculate age from Date of Birth
function calculateAge(dob) {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 'N/A';
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/users/patients');
      setPatients(data || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete patient "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setPatients(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete patient:', error);
      alert(error.response?.data?.message || 'Failed to delete patient');
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    if (patients.length === 0) return alert('No patient data to export.');
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Gender', 'DOB', 'Blood Group', 'State', 'City', 'Address'];
    const rows = patients.map(p => [
      p._id,
      `"${p.name || ''}"`,
      p.email || '',
      p.phone || '',
      p.gender || '',
      p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
      p.bloodGroup || '',
      `"${p.address?.state || ''}"`,
      `"${p.address?.city || ''}"`,
      `"${p.address?.street || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Patients_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchGender = genderFilter === 'All' || p.gender === genderFilter;
      const matchBlood = bloodGroupFilter === 'All' || p.bloodGroup === bloodGroupFilter;

      return matchSearch && matchGender && matchBlood;
    });
  }, [patients, searchTerm, genderFilter, bloodGroupFilter]);

  // Unique blood groups
  const bloodGroups = useMemo(() => {
    const set = new Set();
    patients.forEach(p => { if (p.bloodGroup) set.add(p.bloodGroup); });
    return Array.from(set);
  }, [patients]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const maleCount = patients.filter(p => p.gender === 'Male').length;
  const femaleCount = patients.filter(p => p.gender === 'Female').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Patients Registry</h2>
          <p className="text-slate-500 text-sm mt-1">Manage registered hospital patients and medical records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={fetchPatients} disabled={loading} className="bg-white border-slate-200">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" onClick={exportToCSV} className="bg-white border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{patients.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Patients</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{maleCount} M / {femaleCount} F</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender Distribution</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{bloodGroups.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Group Types</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, phone or blood group..."
              className="pl-10 h-10 bg-white border-slate-200 text-sm"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Blood Group Filter */}
            {bloodGroups.length > 0 && (
              <select
                value={bloodGroupFilter}
                onChange={(e) => { setBloodGroupFilter(e.target.value); setCurrentPage(1); }}
                className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
              >
                <option value="All">All Blood Groups</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold">Patient Name & ID</th>
                <th className="px-6 py-4 font-bold">Gender / Age</th>
                <th className="px-6 py-4 font-bold">Contact Info</th>
                <th className="px-6 py-4 font-bold">Blood Group</th>
                <th className="px-6 py-4 font-bold">Registered Date</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f6c4f] border-r-transparent mb-2" />
                    <p className="text-slate-400 text-sm font-medium">Loading patients...</p>
                  </td>
                </tr>
              ) : paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-400">
                    <User className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No patients found</p>
                    <p className="text-xs mt-1">Try clearing your search or filter keywords.</p>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => {
                  const age = calculateAge(patient.dateOfBirth);

                  return (
                    <tr key={patient._id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Name & ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {patient.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm group-hover:text-[#0f6c4f] transition-colors">
                              {patient.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400" title={patient._id}>
                              ID: {patient._id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Gender & Age */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        <div>{patient.gender || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{age !== 'N/A' ? `${age} yrs` : 'DOB N/A'}</div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4 text-xs text-slate-600 space-y-0.5">
                        <div className="font-medium text-slate-800">{patient.phone || 'No Phone'}</div>
                        <div className="text-slate-400 truncate max-w-[180px]" title={patient.email}>{patient.email || 'No Email'}</div>
                      </td>

                      {/* Blood Group */}
                      <td className="px-6 py-4">
                        {patient.bloodGroup ? (
                          <span className="inline-flex items-center gap-1 font-bold text-xs bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded-full">
                            <Droplets className="h-3 w-3" /> {patient.bloodGroup}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">N/A</span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/patients/${patient._id}`}>
                            <Button size="sm" className="h-8 px-3 text-xs font-semibold bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-lg">
                              <Eye className="h-3.5 w-3.5 mr-1" /> Profile
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === patient._id}
                            onClick={() => handleDelete(patient._id, patient.name)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Delete Patient"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredPatients.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium bg-slate-50/50">
            <div>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-white"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <span className="px-2 font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-white"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
