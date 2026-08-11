import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Lock, Save, Camera, Clock,
  Shield, Eye, EyeOff, CheckCircle, AlertCircle, Stethoscope, Microscope
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import axios from 'axios';

export default function DoctorSettings() {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('doctor');

  // Toast Notification
  const [toast, setToast] = useState(null);

  // Profile Form State
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    specialty: '',
    address: '',
    bio: ''
  });

  // Security & Password Form State
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  const showToastNotification = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo && userInfo._id) {
        setUserId(userInfo._id);
        setRole(userInfo.role || 'doctor');

        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`);

        const isLabTechUser = userInfo.role === 'lab_technician';
        let rawName = data.name || userInfo.name || '';
        if (isLabTechUser) {
          rawName = rawName.replace(/^Dr\.\s*/i, '');
        }

        setUserData({
          name: rawName,
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || 'Male',
          specialty: data.specialty || (isLabTechUser ? 'Laboratory Specialist' : 'General Physician'),
          address: data.address?.street || '',
          bio: data.doctorNotes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);
      const isLabTechUser = role === 'lab_technician';
      const cleanSaveName = isLabTechUser ? userData.name.replace(/^Dr\.\s*/i, '') : userData.name;

      const payload = {
        name: cleanSaveName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        specialty: userData.specialty,
        address: { street: userData.address }
      };

      const { data } = await axios.put(`http://localhost:5000/api/users/profile/${userId}`, payload);

      // Update local storage so Header & Layout update instantly
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo) {
        userInfo.name = isLabTechUser ? data.name.replace(/^Dr\.\s*/i, '') : data.name;
        userInfo.email = data.email;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      showToastNotification('success', 'Profile information updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToastNotification('error', error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    if (pwdData.newPassword !== pwdData.confirmPassword) {
      showToastNotification('error', 'New passwords do not match.');
      return;
    }

    if (pwdData.newPassword.length < 6) {
      showToastNotification('error', 'New password must be at least 6 characters.');
      return;
    }

    try {
      setSavingPwd(true);
      await axios.put(`http://localhost:5000/api/users/profile/${userId}`, {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword
      });

      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToastNotification('success', 'Password updated successfully!');
    } catch (error) {
      console.error('Password update error:', error);
      showToastNotification('error', error.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPwd(false);
    }
  };

  const isLabTech = role === 'lab_technician';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl pb-12">
      
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          {toast.msg}
        </motion.div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Account Settings</h2>
        <p className="text-[var(--color-muted-foreground)] text-sm mt-1">
          Manage your {isLabTech ? 'Lab Technician' : 'Doctor'} profile, contact information and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={`h-24 w-24 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold ${
                  isLabTech ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {userData.name?.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase() || (isLabTech ? 'T' : 'D')}
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-800">{userData.name || 'User Profile'}</h3>
              <p className="text-xs font-semibold text-[#0f6c4f] mt-0.5">{userData.specialty}</p>
              
              <div className="mt-2 mb-6">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                  isLabTech ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isLabTech ? 'Lab Technician' : 'Medical Doctor'}
                </span>
              </div>

              {/* Tab Toggle Navigation */}
              <div className="w-full flex flex-col gap-2">
                <Button
                  type="button"
                  variant={activeTab === 'profile' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('profile')}
                  className={`w-full justify-start text-sm ${
                    activeTab === 'profile' ? 'bg-[#0f6c4f] text-white border-none shadow' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <User className="mr-2 h-4 w-4" /> Personal Information
                </Button>

                <Button
                  type="button"
                  variant={activeTab === 'security' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('security')}
                  className={`w-full justify-start text-sm ${
                    activeTab === 'security' ? 'bg-[#0f6c4f] text-white border-none shadow' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <Shield className="mr-2 h-4 w-4" /> Security & Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">Personal Information</CardTitle>
                  <p className="text-xs text-slate-400">Update your public contact & professional details.</p>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#0f6c4f] border-r-transparent mb-2" />
                      <p>Loading settings...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">Full Name <span className="text-red-400">*</span></label>
                          <Input
                            name="name"
                            value={userData.name}
                            onChange={handleProfileChange}
                            className="h-10 border-slate-200"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">Email Address <span className="text-red-400">*</span></label>
                          <Input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleProfileChange}
                            className="h-10 border-slate-200"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">Phone Number</label>
                          <Input
                            type="tel"
                            name="phone"
                            value={userData.phone}
                            onChange={handleProfileChange}
                            placeholder="+91 98765 43210"
                            className="h-10 border-slate-200"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">Gender</label>
                          <select
                            name="gender"
                            value={userData.gender}
                            onChange={handleProfileChange}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl font-medium text-slate-700 bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="font-semibold text-slate-700">{isLabTech ? 'Department / Lab Specialty' : 'Medical Specialty'}</label>
                          <Input
                            name="specialty"
                            value={userData.specialty}
                            onChange={handleProfileChange}
                            placeholder={isLabTech ? 'e.g. Pathology & Microbiology' : 'e.g. Cardiology'}
                            className="h-10 border-slate-200"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="font-semibold text-slate-700">Address / Location</label>
                          <Input
                            name="address"
                            value={userData.address}
                            onChange={handleProfileChange}
                            placeholder="Hospital OPD Block, Floor 2, Room 204"
                            className="h-10 border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <Button type="submit" disabled={saving} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
                          <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile Details'}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* TAB 2: SECURITY & PASSWORD UPDATE */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">Security & Password Update</CardTitle>
                  <p className="text-xs text-slate-400">Update your account login password securely.</p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Current Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Input
                          type={showPwd.current ? 'text' : 'password'}
                          required
                          value={pwdData.currentPassword}
                          onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                          placeholder="••••••••"
                          className="h-10 border-slate-200 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPwd.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">New Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Input
                          type={showPwd.new ? 'text' : 'password'}
                          required
                          value={pwdData.newPassword}
                          onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                          placeholder="At least 6 characters"
                          className="h-10 border-slate-200 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPwd.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Confirm New Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Input
                          type={showPwd.confirm ? 'text' : 'password'}
                          required
                          value={pwdData.confirmPassword}
                          onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="h-10 border-slate-200 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPwd.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <Button type="submit" disabled={savingPwd} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
                        <Lock className="h-4 w-4 mr-2" /> {savingPwd ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
