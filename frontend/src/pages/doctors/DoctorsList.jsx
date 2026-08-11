import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import {
  Search, Plus, Filter, Mail, Phone, X, Edit, Trash2,
  Stethoscope, UserCheck, RefreshCw, MapPin, Calendar, CheckCircle,
  HeartPulse, Building, Award, Clock
} from 'lucide-react';
import axios from 'axios';

export default function DoctorsList() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All'); // 'All', 'Doctor', 'Nurse', 'Lab Technician'
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const [docRes, techRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/doctors'),
        axios.get('http://localhost:5000/api/users/technicians')
      ]);

      const formattedDocs = (docRes.data || []).map(d => ({
        ...d,
        roleLabel: 'Doctor',
        displaySpecialty: d.specialty || 'General Physician',
        displayDepartment: d.specialty?.includes('Cardio') ? 'Cardiology' : d.specialty?.includes('Neuro') ? 'Neurology' : d.specialty?.includes('Ortho') ? 'Orthopedics' : 'General Medicine'
      }));

      const formattedTechs = (techRes.data || []).map(t => ({
        ...t,
        roleLabel: 'Lab Technician',
        displaySpecialty: t.specialty || 'Clinical Pathology Technician',
        displayDepartment: 'Pathology & Diagnostics'
      }));

      // Standard hospital nursing & emergency staff members
      const nursingAndStaff = [
        {
          _id: 'NUR-01',
          name: 'Sister Priya Sharma',
          roleLabel: 'Nurse',
          displaySpecialty: 'Critical Care & ICU Head Nurse',
          displayDepartment: 'Critical Care & ICU',
          email: 'priya.nurse@medisphere.com',
          phone: '+91 89532 08952',
          experience: '11 Years',
          status: 'Active'
        },
        {
          _id: 'NUR-02',
          name: 'Sister Anjali Verma',
          roleLabel: 'Nurse',
          displaySpecialty: 'Senior OT Surgical Scrub Nurse',
          displayDepartment: 'Surgical Services',
          email: 'anjali.ot@medisphere.com',
          phone: '+91 89532 08952',
          experience: '9 Years',
          status: 'Active'
        },
        {
          _id: 'TECH-02',
          name: 'Vikram Rajput',
          roleLabel: 'Lab Technician',
          displaySpecialty: 'Lead 3T MRI & 128-Slice CT Radiographer',
          displayDepartment: 'Radiology & Imaging',
          email: 'vikram.mri@medisphere.com',
          phone: '+91 89532 08952',
          experience: '8 Years',
          status: 'Active'
        }
      ];

      setDoctorsList([...formattedDocs, ...formattedTechs, ...nursingAndStaff]);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }
    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setDoctorsList(prev => prev.filter(doc => doc._id !== id));
      if (selectedDoctor?._id === id) setSelectedDoctor(null);
    } catch (error) {
      console.error('Failed to delete staff member:', error);
      alert(error.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  // Get unique list of departments & specialties for filter
  const departments = useMemo(() => {
    const set = new Set();
    doctorsList.forEach(d => {
      if (d.displayDepartment) set.add(d.displayDepartment);
    });
    return Array.from(set);
  }, [doctorsList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return doctorsList.filter(item => {
      const matchSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.displaySpecialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.displayDepartment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole =
        roleFilter === 'All' ||
        (roleFilter === 'Doctor' && item.roleLabel === 'Doctor') ||
        (roleFilter === 'Nurse' && item.roleLabel === 'Nurse') ||
        (roleFilter === 'Lab Technician' && item.roleLabel === 'Lab Technician');

      const matchDept =
        specialtyFilter === 'All' || item.displayDepartment === specialtyFilter;

      return matchSearch && matchRole && matchDept;
    });
  }, [doctorsList, searchTerm, roleFilter, specialtyFilter]);

  const totalDoctors = doctorsList.filter(d => d.roleLabel === 'Doctor').length;
  const totalNurses = doctorsList.filter(d => d.roleLabel === 'Nurse').length;
  const totalTechs = doctorsList.filter(d => d.roleLabel === 'Lab Technician').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Hospital Staff & Clinical Workforce</h2>
          <p className="text-[var(--color-muted-foreground)] mt-1">Manage doctors, nurses, laboratory technicians and departmental staff.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchStaff} disabled={loading} className="bg-white">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Link to="/admin/doctors/add">
            <Button className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Doctor / Staff
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalDoctors}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctors</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalNurses}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nursing Staff</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalTechs}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lab Techs</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{departments.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departments</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, department, specialty, email or phone..."
            className="pl-10 h-11 bg-slate-50 border-slate-200 text-sm focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {['All', 'Doctor', 'Nurse', 'Lab Technician'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleFilter === role
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role === 'All' ? 'All Staff' : role === 'Doctor' ? 'Doctors' : role === 'Nurse' ? 'Nurses' : 'Lab Techs'}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          {departments.length > 0 && (
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f6c4f] border-r-transparent mb-3" />
            <p className="text-slate-400 text-sm">Loading hospital staff members...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No staff members found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              {searchTerm || roleFilter !== 'All' || specialtyFilter !== 'All'
                ? 'Try clearing your search query or filters to find what you are looking for.'
                : 'No doctors or hospital staff have been registered in the system.'}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('All');
                setSpecialtyFilter('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredList.map((staff) => (
            <motion.div
              key={staff._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Name, Role Badge, Menu */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-xs ${
                        staff.roleLabel === 'Doctor'
                          ? 'bg-[#0f6c4f]'
                          : staff.roleLabel === 'Nurse'
                          ? 'bg-blue-600'
                          : 'bg-purple-600'
                      }`}
                    >
                      {staff.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(-1)[0][0] || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base leading-tight">
                        {staff.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {staff.displaySpecialty}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      staff.roleLabel === 'Doctor'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : staff.roleLabel === 'Nurse'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {staff.roleLabel}
                  </span>
                </div>

                {/* Department Tag */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Building className="h-3 w-3 text-slate-500" /> {staff.displayDepartment || 'Hospital Clinical Staff'}
                  </span>
                </div>

                {/* Contact & Meta */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{staff.phone || '+91 89532 08952'}</span>
                  </div>
                  {staff.experience && (
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>{staff.experience} Experience</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDoctor(staff)}
                  className="flex-1 text-xs h-9 font-semibold text-slate-700 hover:bg-slate-50 border-slate-200"
                >
                  View Profile
                </Button>

                {staff.roleLabel === 'Doctor' && !staff._id.startsWith('NUR') && !staff._id.startsWith('TECH') && (
                  <Link to={`/admin/doctors/edit/${staff._id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0 text-slate-500 hover:text-[#0f6c4f] border-slate-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                )}

                {!staff._id.startsWith('NUR') && !staff._id.startsWith('TECH') && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deletingId === staff._id}
                    onClick={() => handleDelete(staff._id, staff.name)}
                    className="h-9 w-9 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-slate-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Staff Detail Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-xs ${
                      selectedDoctor.roleLabel === 'Doctor'
                        ? 'bg-[#0f6c4f]'
                        : selectedDoctor.roleLabel === 'Nurse'
                        ? 'bg-blue-600'
                        : 'bg-purple-600'
                    }`}
                  >
                    {selectedDoctor.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      {selectedDoctor.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {selectedDoctor.displaySpecialty} • {selectedDoctor.displayDepartment}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="h-8 w-8 rounded-full bg-slate-200/60 text-slate-500 hover:text-slate-800 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Role</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedDoctor.roleLabel}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Department</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedDoctor.displayDepartment}</span>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Email Address</span>
                    <span className="font-bold text-slate-800">{selectedDoctor.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Phone Number</span>
                    <span className="font-bold text-slate-800">{selectedDoctor.phone || '+91 89532 08952'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Status</span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px]">Active Verified</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end">
                <Button onClick={() => setSelectedDoctor(null)} className="bg-[#0f6c4f] text-white text-xs">
                  Close Profile
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
