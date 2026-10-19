import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, 
  User, MapPin, Mail, KeyRound, Eye, EyeOff, Send, RefreshCw, AlertCircle
} from 'lucide-react';
import { Button } from '../../components/Button';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [step, setStep] = useState(1);
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    state: '',
    city: '',
    address: '',
    pinCode: '',
    agree: false
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // If user changes email after verification, reset verified status
    if (name === 'email' && emailVerified) {
      setEmailVerified(false);
      setOtpSent(false);
      setOtpCode('');
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 1. Send OTP to Email via SMTP
  const handleSendOtp = async () => {
    setError('');
    setSuccessMsg('');

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address first.');
      return;
    }

    try {
      setOtpSending(true);
      const res = await axios.post('/api/auth/send-register-otp', {
        email: formData.email
      });
      setOtpSent(true);
      setSuccessMsg(res.data.message || 'Verification OTP sent to your email.');
      setResendTimer(60); // 60 seconds cooldown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setOtpSending(false);
    }
  };

  // 2. Verify OTP code
  const handleVerifyOtp = async () => {
    setError('');
    setSuccessMsg('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setOtpVerifying(true);
      const res = await axios.post('/api/auth/verify-register-otp', {
        email: formData.email,
        otp: otpCode.trim()
      });
      setEmailVerified(true);
      setSuccessMsg(res.data.message || 'Email verified successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setOtpVerifying(false);
    }
  };

  // Step Validation
  const nextStep = () => {
    setError('');
    setSuccessMsg('');

    if (step === 1) {
      if (
        !formData.firstName.trim() || 
        !formData.lastName.trim() || 
        !formData.dateOfBirth || 
        !formData.gender || 
        !formData.bloodGroup ||
        !formData.phone.trim() ||
        !formData.email.trim()
      ) {
        setError('Please fill in all personal details and email.');
        return;
      }

      // Enforce Email Verification!
      if (!emailVerified) {
        setError('Please verify your email address using the OTP code before proceeding.');
        return;
      }
    } else if (step === 2) {
      if (!formData.state.trim() || !formData.city.trim() || !formData.emergencyName.trim() || !formData.emergencyPhone.trim() || !formData.emergencyRelationship) {
        setError('Please fill in required address and emergency contact details.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setSuccessMsg('');
    setStep(prev => prev - 1);
  };

  // Complete Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!emailVerified) {
      setError('Email verification required. Please verify your email.');
      setStep(1);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!formData.agree) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: 'patient',
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pinCode
        },
        emergencyContact: {
          name: `${formData.emergencyName} (${formData.emergencyRelationship})`,
          phone: formData.emergencyPhone
        }
      };

      const { data } = await axios.post('/api/auth/register', payload);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/portal');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Personal & Email', icon: User },
    { id: 2, name: 'Address & Contact', icon: MapPin },
    { id: 3, name: 'Security & Finish', icon: ShieldCheck }
  ];

  return (
    <div className="w-full relative z-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Card Header */}
        <div className="p-4 sm:p-7 md:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0d2a21]">Create Patient Account</h1>
            <p className="text-xs text-slate-500 mt-1">Register to manage appointments, access lab tests, and track health vitals</p>
          </div>

          {/* Stepper Indicator (Mobile-Responsive Compact) */}
          <div className="mb-5 sm:mb-7 relative max-w-md mx-auto px-2">
            <div className="absolute top-[14px] left-[15%] w-[70%] h-[2px] bg-slate-200 z-0"></div>
            <div 
              className="absolute top-[14px] left-[15%] h-[2px] bg-[#1b4d3e] z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 70}%` }}
            ></div>
            
            <div className="relative z-10 flex justify-between">
              {steps.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                const StepIcon = s.icon;
                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-bold ${
                      isActive || isCompleted
                        ? 'bg-[#1b4d3e] text-white shadow-md' 
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`mt-1 text-[10px] sm:text-xs font-semibold text-center ${
                      isActive || isCompleted ? 'text-[#1b4d3e]' : 'text-slate-400'
                    }`}>
                      {s.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleRegister}>
            <AnimatePresence mode="wait">
              
              {/* ================= STEP 1: Personal & Verified Email ================= */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5 sm:space-y-4"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">First Name <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="John" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Last Name <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>

                  {/* DOB, Gender, Blood Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        type="date" 
                        name="dateOfBirth" 
                        value={formData.dateOfBirth} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 shadow-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Gender <span className="text-red-500">*</span></label>
                      <select 
                        required 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 shadow-xs"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Blood Group <span className="text-red-500">*</span></label>
                      <select 
                        required 
                        name="bloodGroup" 
                        value={formData.bloodGroup} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 shadow-xs"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone & Email Section with Integrated SMTP OTP Verification */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Mobile Phone <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="+91 9876543210" 
                      />
                    </div>

                    {/* Email Verification Box */}
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-emerald-700" />
                          Email Verification <span className="text-red-500">*</span>
                        </label>
                        {emailVerified ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEmailVerified(false);
                                setOtpSent(false);
                                setOtpCode('');
                              }}
                              className="text-[11px] font-semibold text-slate-500 hover:text-red-600 underline cursor-pointer"
                            >
                              Change
                            </button>
                          </div>
                        ) : null}
                      </div>

                      {/* Integrated Email Input with embedded Send OTP button */}
                      <div className="relative flex items-center">
                        <input 
                          required 
                          name="email" 
                          type="email" 
                          disabled={emailVerified}
                          value={formData.email} 
                          onChange={handleChange} 
                          className={`w-full h-11 pl-3.5 ${emailVerified ? 'pr-10' : 'pr-28'} bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 disabled:bg-slate-100/70 disabled:text-slate-600 shadow-xs`} 
                          placeholder="your.email@example.com" 
                        />
                        
                        {emailVerified ? (
                          <div className="absolute right-3 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpSending || resendTimer > 0}
                            className="absolute right-1.5 h-8 px-3 text-[11px] font-bold rounded-lg bg-[#1b4d3e] hover:bg-[#133c30] text-white disabled:opacity-50 transition-all flex items-center justify-center whitespace-nowrap shadow-xs active:scale-95 cursor-pointer"
                          >
                            {otpSending ? (
                              'Sending...'
                            ) : resendTimer > 0 ? (
                              `Resend (${resendTimer}s)`
                            ) : otpSent ? (
                              'Resend'
                            ) : (
                              'Send OTP'
                            )}
                          </button>
                        )}
                      </div>

                      {/* OTP Input Field (Shows after OTP is dispatched) */}
                      {otpSent && !emailVerified && (
                        <motion.div 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2.5 border-t border-slate-200/70 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                            <span>Enter 6-digit OTP sent to mail</span>
                            {resendTimer > 0 && (
                              <span className="text-emerald-700 font-semibold">{resendTimer}s remaining</span>
                            )}
                          </div>
                          
                          <div className="relative flex items-center">
                            <input 
                              type="text"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 6-digit code"
                              className="w-full h-11 pl-3.5 pr-28 text-left tracking-widest font-mono text-sm sm:text-base font-bold bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={otpVerifying || otpCode.length !== 6}
                              className="absolute right-1.5 h-8 px-3.5 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all shadow-xs active:scale-95 cursor-pointer"
                            >
                              {otpVerifying ? 'Verifying...' : 'Verify OTP'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 2: Address & Emergency Contact ================= */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5 sm:space-y-4"
                >
                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Street Address</label>
                    <input 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                      placeholder="Flat, Building, Street, Landmark" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">City <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="e.g. Lucknow" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">State <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="e.g. Uttar Pradesh" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">PIN Code</label>
                      <input 
                        name="pinCode" 
                        value={formData.pinCode} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="226001" 
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Header */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs sm:text-sm font-bold text-[#0d2a21] mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#1b4d3e]" /> Emergency Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Contact Person <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        name="emergencyName" 
                        value={formData.emergencyName} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="e.g. Sarah Doe" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Relationship <span className="text-red-500">*</span></label>
                      <select 
                        required 
                        name="emergencyRelationship" 
                        value={formData.emergencyRelationship} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 shadow-xs"
                      >
                        <option value="">Select Relation</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Child">Child</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Emergency Phone <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        name="emergencyPhone" 
                        type="tel" 
                        value={formData.emergencyPhone} 
                        onChange={handleChange} 
                        className="w-full h-10 sm:h-11 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                        placeholder="+91 9876543211" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= STEP 3: Security & Passwords ================= */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Email <strong>{formData.email}</strong> is verified and ready for account creation.</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Create Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          required 
                          name="password" 
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password} 
                          onChange={handleChange} 
                          className="w-full h-10 sm:h-11 pl-3 pr-10 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                          placeholder="At least 6 characters" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Confirm Password <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          required 
                          name="confirmPassword" 
                          type={showConfirmPassword ? 'text' : 'password'} 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          className="w-full h-10 sm:h-11 pl-3 pr-10 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs" 
                          placeholder="Re-enter password" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        required
                        name="agree"
                        type="checkbox"
                        checked={formData.agree}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1b4d3e] focus:ring-[#1b4d3e] transition-all cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I agree to the{' '}
                        <Link to="/terms" target="_blank" className="text-[#1b4d3e] font-semibold hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" target="_blank" className="text-[#1b4d3e] font-semibold hover:underline">
                          Privacy Policy
                        </Link>.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation Buttons (Mobile-Responsive Full Target) */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </button>
              ) : (
                <div></div>
              )}

              {step < steps.length ? (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  className="h-10 sm:h-11 px-6 sm:px-8 rounded-xl bg-[#1b4d3e] hover:bg-[#133c30] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center"
                >
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading || !emailVerified} 
                  className="h-10 sm:h-11 px-6 sm:px-8 rounded-xl bg-[#1b4d3e] hover:bg-[#133c30] text-white text-xs sm:text-sm font-semibold shadow-md disabled:opacity-60 flex items-center"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'} <CheckCircle2 className="h-4 w-4 ml-1.5" />
                </Button>
              )}
            </div>

          </form>
        </div>
        
        {/* Card Footer: Already have an account */}
        <div className="bg-slate-50 px-4 py-3 sm:py-4 text-center border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1b4d3e] hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
