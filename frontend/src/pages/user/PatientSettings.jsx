import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, MapPin, Phone, Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

const SectionHeader = ({ icon: Icon, color, bg, title, subtitle }) => (
  <div className={`${bg} border-b border-slate-100 px-6 py-4 flex items-center gap-3`}>
    <div className={`h-9 w-9 rounded-xl ${bg === 'bg-red-50' ? 'bg-red-100' : 'bg-white'} flex items-center justify-center shadow-sm`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <div>
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const FieldGroup = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-600">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const selectCls = "w-full h-11 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/40 bg-white text-slate-700";
const inputCls = "h-11 border-slate-200";

export default function PatientSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    state: '',
    city: '',
    address: '',
    pinCode: ''
  });

  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => { fetchProfile(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo._id) {
        setUserId(userInfo._id);
        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`);

        // Split name into first/last
        const nameParts = (data.name || '').trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Parse emergency contact: stored as "Name (Relationship)"
        const ecRaw = data.emergencyContact?.name || '';
        const ecMatch = ecRaw.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
        const emergencyName = ecMatch ? ecMatch[1].trim() : ecRaw;
        const emergencyRelationship = ecMatch ? ecMatch[2].trim() : '';

        setFormData({
          firstName,
          lastName,
          email: data.email || '',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
          gender: data.gender || '',
          bloodGroup: data.bloodGroup || '',
          phone: data.phone || '',
          emergencyName,
          emergencyRelationship,
          emergencyPhone: data.emergencyContact?.phone || '',
          state: data.address?.state || '',
          city: data.address?.city || '',
          address: data.address?.street || '',
          pinCode: data.address?.zipCode || data.address?.pinCode || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      setSaving(true);
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        emergencyContact: {
          name: formData.emergencyRelationship
            ? `${formData.emergencyName} (${formData.emergencyRelationship})`
            : formData.emergencyName,
          phone: formData.emergencyPhone
        },
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pinCode
        }
      };
      await axios.put(`http://localhost:5000/api/users/profile/${userId}`, payload);
      // Update localStorage name
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        userInfo.name = payload.name;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }
      showToast('success', 'Profile updated successfully!');
      fetchProfile();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }
    if (pwdData.newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters.');
      return;
    }
    try {
      setSavingPwd(true);
      await axios.put(`http://localhost:5000/api/users/profile/${userId}`, {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword
      });
      showToast('success', 'Password changed successfully!');
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0f6c4f] border-r-transparent mb-3" />
        <p className="text-sm">Loading your profile...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pb-20">

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}
        >
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          {toast.msg}
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Profile Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Edit and update all your personal, contact & address details.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white border-none shadow-md px-6">
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* ── Personal Details ── */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <SectionHeader icon={User} color="text-[#0f6c4f]" bg="bg-slate-50" title="Personal Details" subtitle="Your basic identity information" />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldGroup label="First Name" required>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Rahul" className={inputCls} required />
              </FieldGroup>
              <FieldGroup label="Last Name" required>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Sharma" className={inputCls} required />
              </FieldGroup>
              <FieldGroup label="Date of Birth" required>
                <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputCls} required />
              </FieldGroup>
              <FieldGroup label="Gender" required>
                <select name="gender" value={formData.gender} onChange={handleChange} className={selectCls} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Blood Group" required>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={selectCls} required>
                  <option value="">Select Blood Group</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </FieldGroup>
            </div>
          </CardContent>
        </Card>

        {/* ── Contact Info ── */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <SectionHeader icon={Phone} color="text-blue-500" bg="bg-blue-50" title="Contact Information" subtitle="Your primary contact details" />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldGroup label="Mobile Number" required>
                <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputCls} required />
              </FieldGroup>
              <FieldGroup label="Email Address" required>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" className={inputCls} required />
              </FieldGroup>
            </div>
          </CardContent>
        </Card>

        {/* ── Emergency Contact ── */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <SectionHeader icon={Shield} color="text-red-500" bg="bg-red-50" title="Emergency Contact" subtitle="Who to contact in case of emergency" />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FieldGroup label="Contact Name" required>
                <Input name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="e.g. Priya Sharma" className={inputCls} required />
              </FieldGroup>
              <FieldGroup label="Relationship" required>
                <select name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} className={selectCls} required>
                  <option value="">Select Relation</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Contact Number" required>
                <Input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="+91 98765 43210" className={inputCls} required />
              </FieldGroup>
            </div>
          </CardContent>
        </Card>

        {/* ── Address ── */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <SectionHeader icon={MapPin} color="text-orange-500" bg="bg-orange-50" title="Address Details" subtitle="Your current residential address" />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldGroup label="State" required>
                <Input name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Maharashtra" className={inputCls} required />
              </FieldGroup>
              <FieldGroup label="City" required>
                <Input name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" className={inputCls} required />
              </FieldGroup>
              <FieldGroup label="Street / House Address">
                <Input name="address" value={formData.address} onChange={handleChange} placeholder="e.g. 42, Green Park Colony" className={inputCls} />
              </FieldGroup>
              <FieldGroup label="PIN Code">
                <Input name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="e.g. 400001" className={inputCls} />
              </FieldGroup>
            </div>
          </CardContent>
        </Card>

      </form>

      {/* ── Change Password ── */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <SectionHeader icon={Lock} color="text-purple-500" bg="bg-purple-50" title="Change Password" subtitle="Update your account login password" />
        <CardContent className="p-6">
          <form onSubmit={handlePasswordChange}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: 'Current Password', name: 'currentPassword', key: 'current' },
                { label: 'New Password', name: 'newPassword', key: 'new' },
                { label: 'Confirm New Password', name: 'confirmPassword', key: 'confirm' }
              ].map(({ label, name, key }) => (
                <FieldGroup key={name} label={label} required>
                  <div className="relative">
                    <Input
                      type={showPwd[key] ? 'text' : 'password'}
                      name={name}
                      value={pwdData[name]}
                      onChange={handlePwdChange}
                      placeholder="••••••••"
                      className={`${inputCls} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPwd[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FieldGroup>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" disabled={savingPwd} className="bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md px-6">
                <Lock className="h-4 w-4 mr-2" /> {savingPwd ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

    </motion.div>
  );
}
