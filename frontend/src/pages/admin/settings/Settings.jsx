import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import {
  User, Bell, Activity, Shield, Key, Eye, EyeOff, Save,
  CheckCircle, AlertCircle, Lock, Phone, Mail, MapPin, Laptop
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import axios from 'axios';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [userId, setUserId] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

  // Form State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    address: ''
  });

  // Password State
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  // Notifications Toggle State
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_notification_settings')) || {
        appointments: true,
        patientUpdates: true,
        systemAlerts: false,
        weeklyReports: true
      };
    } catch {
      return { appointments: true, patientUpdates: true, systemAlerts: false, weeklyReports: true };
    }
  });

  // Activity logs feed
  const [activityLogs, setActivityLogs] = useState([
    { action: 'Admin session started', time: 'Just now', ip: '127.0.0.1 (Current Session)' },
    { action: 'Updated System Settings', time: '10 mins ago', ip: '127.0.0.1' },
    { action: 'Exported Patients CSV Registry', time: 'Today, 10:45 AM', ip: '127.0.0.1' },
    { action: 'Logged in as System Administrator', time: 'Today, 09:15 AM', ip: '192.168.1.1' },
  ]);

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
        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`);

        const cleanName = data.name?.replace(/^Dr\.\s*/i, '') || '';
        const nameParts = cleanName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setProfileData({
          firstName,
          lastName,
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || 'Male',
          address: data.address?.street || ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
      const payload = {
        name: fullName,
        email: profileData.email,
        phone: profileData.phone,
        gender: profileData.gender,
        address: { street: profileData.address }
      };

      const { data } = await axios.put(`http://localhost:5000/api/users/profile/${userId}`, payload);

      // Update local storage so Header & Layout update instantly
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo) {
        userInfo.name = data.name;
        userInfo.email = data.email;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      // Add to activity logs
      setActivityLogs(prev => [
        { action: 'Updated Admin Profile Information', time: 'Just now', ip: '127.0.0.1' },
        ...prev
      ]);

      showToastNotification('success', 'Admin profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
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

      setActivityLogs(prev => [
        { action: 'Changed Admin Account Password', time: 'Just now', ip: '127.0.0.1' },
        ...prev
      ]);
    } catch (error) {
      console.error('Password change error:', error);
      showToastNotification('error', error.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPwd(false);
    }
  };

  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('admin_notification_settings', JSON.stringify(updated));
    showToastNotification('success', 'Notification preferences saved.');
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 max-w-5xl pb-12">
      
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
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Admin Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your administrator profile, security preferences, and system logs.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1.5 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left",
                  activeTab === tab.id
                    ? "bg-[#0f6c4f] text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* TAB 1: USER PROFILE */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">Public Profile</CardTitle>
                  <p className="text-xs text-slate-400">Update your administrator contact & personal information.</p>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#0f6c4f] border-r-transparent mb-2" />
                      <p>Loading profile...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                        <div className="h-20 w-20 rounded-full bg-[#0f6c4f]/10 text-[#0f6c4f] flex items-center justify-center text-3xl font-bold border-2 border-[#0f6c4f]/20 shadow-sm">
                          {profileData.firstName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">
                            {profileData.firstName} {profileData.lastName}
                          </h4>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 inline-block mt-1">
                            System Administrator
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-5 md:grid-cols-2 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">First Name <span className="text-red-400">*</span></label>
                          <Input
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            className="h-10 border-slate-200"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">Last Name <span className="text-red-400">*</span></label>
                          <Input
                            name="lastName"
                            value={profileData.lastName}
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
                            value={profileData.email}
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
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="h-10 border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">Gender</label>
                          <select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleProfileChange}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl font-medium text-slate-700 bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-700">Address / Location</label>
                          <Input
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            placeholder="e.g. Hospital Main Block, Office 201"
                            className="h-10 border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button type="submit" disabled={saving} className="bg-[#0f6c4f] hover:bg-emerald-800 text-white">
                          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Profile Changes'}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">Notification Preferences</CardTitle>
                  <p className="text-xs text-slate-400">Configure what system alerts you wish to receive.</p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {[
                    { key: 'appointments', label: 'New Appointments Alerts', desc: 'Receive instant notifications when a patient books a new consultation.' },
                    { key: 'patientUpdates', label: 'Patient Clinical Updates', desc: 'Get notified when new lab reports or vitals are uploaded.' },
                    { key: 'systemAlerts', label: 'System & Security Alerts', desc: 'Receive critical server or database notifications.' },
                    { key: 'weeklyReports', label: 'Weekly Summary Digest', desc: 'Receive a weekly email summary of hospital revenue and metrics.' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={!!notifications[item.key]}
                          onChange={() => handleNotificationToggle(item.key)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f6c4f]"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">Security & Password Update</CardTitle>
                  <p className="text-xs text-slate-400">Change your administrator login password.</p>
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

          {/* TAB 4: ACTIVITY LOGS */}
          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">Recent Admin Activity Logs</CardTitle>
                  <p className="text-xs text-slate-400">Security and action audit trail for your administrator session.</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {activityLogs.map((log, i) => (
                      <div key={i} className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{log.action}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">IP Address: {log.ip}</p>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                          {log.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
