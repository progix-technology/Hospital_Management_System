import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, HeartPulse, User, Users } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    // Basic validation before moving next
    if (step === 1) {
      if (
        !formData.firstName || 
        !formData.lastName || 
        !formData.dateOfBirth || 
        !formData.gender || 
        !formData.bloodGroup ||
        !formData.email ||
        !formData.phone ||
        !formData.emergencyName ||
        !formData.emergencyPhone ||
        !formData.emergencyRelationship
      ) {
        setError('Please fill all required personal, contact, and emergency details.');
        return;
      }
    } else if (step === 2) {
      if (!formData.state || !formData.city) {
        setError('Please fill all required address fields.');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agree) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
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

      const { data } = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/patient/dashboard');
      
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Personal Details', icon: User },
    { id: 2, name: 'Contact & Address', icon: MapPin },
    { id: 3, name: 'Security & Finish', icon: ShieldCheck }
  ];

  // Need a quick local MapPin component since it's not imported
  function MapPin(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
  }

  return (
    <div className="min-h-full flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-transparent relative">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          <div className="p-4 md:py-5 md:px-10">
            <div className="text-center mb-4 flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#0d2a21] tracking-tight">Create Patient Account</h2>
            </div>

            {/* Stepper Indicator */}
            <div className="mb-4 relative max-w-lg mx-auto">
              <div className="absolute top-[16px] left-[10%] w-[80%] h-[2px] bg-[#e2e8f0] z-0"></div>
              <div 
                className="absolute top-[16px] left-[10%] h-[2px] bg-[#1b4d3e] z-0 transition-all duration-500"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 80}%` }}
              ></div>
              
              <div className="relative z-10 flex justify-between">
                {steps.map((s) => {
                  const isActive = step === s.id;
                  const isCompleted = step > s.id;
                  return (
                    <div key={s.id} className="flex flex-col items-center w-24">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-[2px] bg-white ${
                        isActive || isCompleted
                          ? 'border-white text-white' 
                          : 'border-white text-[#94a3b8]'
                      }`}>
                        <div className={`w-full h-full rounded-full flex items-center justify-center ${isActive || isCompleted ? 'bg-[#1b4d3e]' : 'bg-white border border-[#e2e8f0]'}`}>
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                        </div>
                      </div>
                      <span className={`mt-1 text-[11px] font-semibold ${isActive || isCompleted ? 'text-[#1b4d3e]' : 'text-[#94a3b8]'}`}>
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                
                {/* Step 1 */}
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Row 1: Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">First Name <span className="text-red-500">*</span></label>
                        <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] placeholder-[#94a3b8] transition-all shadow-sm" placeholder="John" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Last Name <span className="text-red-500">*</span></label>
                        <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] placeholder-[#94a3b8] transition-all shadow-sm" placeholder="Doe" />
                      </div>
                    </div>

                    {/* Row 2: DOB, Gender, Blood Group */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Date of Birth <span className="text-red-500">*</span></label>
                        <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] text-slate-700 transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Gender <span className="text-red-500">*</span></label>
                        <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] text-slate-700 transition-all shadow-sm">
                          <option value="" disabled>Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Blood Group <span className="text-red-500">*</span></label>
                        <select required name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] text-slate-700 transition-all shadow-sm">
                          <option value="" disabled>Select</option>
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

                    {/* Row 3: Email, Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Email Address <span className="text-red-500">*</span></label>
                        <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] placeholder-[#94a3b8] transition-all shadow-sm" placeholder="john.doe@email.com" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Mobile Number <span className="text-red-500">*</span></label>
                        <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] placeholder-[#94a3b8] transition-all shadow-sm" placeholder="9876543210" />
                      </div>
                    </div>

                    {/* Row 4: Emergency Contact Header */}
                    <div className="pt-1.5 border-t border-[#f1f5f9]">
                      <h4 className="text-[15px] font-bold text-[#0d2a21] flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-[#1b4d3e]" /> Emergency Contact
                      </h4>
                    </div>

                    {/* Row 5: Emergency Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Contact Name <span className="text-red-500">*</span></label>
                        <input required name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] placeholder-[#94a3b8] shadow-sm" placeholder="Jane Doe" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Relationship <span className="text-red-500">*</span></label>
                        <select required name="emergencyRelationship" value={formData.emergencyRelationship || ''} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] text-slate-700 transition-all shadow-sm">
                          <option value="" disabled>Select</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Child">Child</option>
                          <option value="Friend">Friend</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-[#1e293b]">Contact Number <span className="text-red-500">*</span></label>
                        <input required name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleChange} className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[14px] placeholder-[#94a3b8] shadow-sm" placeholder="9876543211" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                      <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#1e293b]">Mobile Number <span className="text-red-500">*</span></label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="9876543210" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#1e293b]">Email Address <span className="text-red-500">*</span></label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="john.doe@email.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#1e293b]">State <span className="text-red-500">*</span></label>
                        <input name="state" value={formData.state} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="e.g. Maharashtra" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#1e293b]">City <span className="text-red-500">*</span></label>
                        <input name="city" value={formData.city} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="e.g. Mumbai" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[14px] font-bold text-[#1e293b]">Full Address</label>
                        <input name="address" value={formData.address} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="Street Address, Area" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[14px] font-bold text-[#1e293b]">PIN Code</label>
                        <input name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="Zip / PIN" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h4 className="text-[16px] font-bold text-[#0d2a21] mb-5 flex items-center gap-2"><UserPlus className="h-5 w-5 text-[#1b4d3e]" /> Emergency Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                        <div className="space-y-2">
                          <label className="text-[14px] font-bold text-[#1e293b]">Contact Name <span className="text-red-500">*</span></label>
                          <input name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[14px] font-bold text-[#1e293b]">Contact Number <span className="text-red-500">*</span></label>
                          <input name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="9876543211" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#f1f5f9] pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                        <div className="space-y-2">
                          <label className="text-[14px] font-bold text-[#1e293b]">Create Password <span className="text-red-500">*</span></label>
                          <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[14px] font-bold text-[#1e293b]">Confirm Password <span className="text-red-500">*</span></label>
                          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full h-12 px-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] shadow-sm" placeholder="••••••••" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="mt-0.5">
                          <input
                            name="agree"
                            type="checkbox"
                            checked={formData.agree}
                            onChange={handleChange}
                            className="h-5 w-5 rounded border-[#cbd5e1] text-[#1b4d3e] focus:ring-[#1b4d3e] transition-all cursor-pointer"
                          />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#1e293b]">I agree to the Terms & Conditions</p>
                          <p className="text-[13px] text-[#64748b] mt-0.5">By creating an account, you agree to our privacy policy.</p>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 mb-2">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="h-12 px-6 rounded-xl font-bold text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] transition-all flex items-center">
                    <ChevronLeft className="h-5 w-5 mr-1" /> Back
                  </button>
                ) : (
                  <div></div> // Placeholder for flex spacing
                )}

                {step < steps.length ? (
                  <button type="button" onClick={nextStep} className="h-12 px-8 rounded-xl bg-[#1b4d3e] text-white hover:bg-[#133c30] transition-all font-semibold flex items-center shadow-lg shadow-[#1b4d3e]/20">
                    Next Step <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="h-12 px-10 rounded-xl bg-[#1b4d3e] text-white hover:bg-[#133c30] transition-all font-semibold shadow-lg shadow-[#1b4d3e]/20 disabled:opacity-70 flex items-center"
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'} <CheckCircle2 className="h-5 w-5 ml-2" />
                  </button>
                )}
              </div>

            </form>
          </div>
          
          <div className="bg-[#f8fafc] p-6 text-center border-t border-[#f1f5f9]">
            <p className="text-[15px] text-[#64748b] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1b4d3e] hover:underline font-bold">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
