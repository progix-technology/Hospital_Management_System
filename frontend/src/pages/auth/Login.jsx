import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Mail, Lock, ArrowRight, User, Stethoscope, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Login() {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use Outlet Context from AuthLayout to set background image
  const { setBgImage } = useOutletContext();

  useEffect(() => {
    if (role === 'doctor' || role === 'lab_technician' || role === 'admin') {
      setBgImage('/docterlogin.png');
    } else {
      setBgImage('/patientlogin.png');
    }
  }, [role, setBgImage]);

  const roles = [
    { id: 'patient', label: 'Patient', icon: User, placeholder: 'patient@example.com' },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope, placeholder: 'dr.smith@medisphere.com' },
    { id: 'lab_technician', label: 'Lab Tech', icon: ShieldCheck, placeholder: 'labtech@medisphere.com' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, placeholder: 'admin@medisphere.com' }
  ];

  const currentRole = roles.find(r => r.id === role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token & user data to localStorage
        localStorage.setItem('userInfo', JSON.stringify(data));

        // Redirect based on actual user role
        if (data.role === 'admin') navigate('/admin/dashboard');
        else if (data.role === 'doctor') navigate('/doctor/dashboard');
        else if (data.role === 'lab_technician') navigate('/lab/dashboard');
        else navigate('/portal');

      } else {
        let errorMessage = data.message || 'Invalid credentials';
        if (
          errorMessage.toLowerCase().includes('buffering timed out') || 
          errorMessage.toLowerCase().includes('mongodb') || 
          errorMessage.toLowerCase().includes('timeout')
        ) {
          errorMessage = 'Our servers are currently experiencing high traffic. Please try again in a few moments.';
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto bg-white rounded-[32px] shadow-2xl p-10 border border-slate-100/80"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0d2a21] mb-2">Welcome Back</h2>
        <p className="text-sm text-slate-500 font-medium">
          Sign in to access your dashboard
        </p>
      </div>

      {/* Role Selector */}
      <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200/60 mb-8">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-1.5 sm:px-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300",
              role === r.id
                ? "bg-white text-[#1b4d3e] shadow-sm border border-slate-200/80"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <r.icon className={cn("h-4 w-4 shrink-0", role === r.id ? "text-[#1b4d3e]" : "text-current")} />
            <span className="whitespace-nowrap">{r.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={role}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{error}</div>}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-[#1e293b]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder={currentRole.placeholder}
                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] transition-all shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-[#1e293b]">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#1b4d3e] hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 focus:border-[#1b4d3e] text-[15px] placeholder-[#94a3b8] transition-all shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-[#cbd5e1] text-[#1b4d3e] focus:ring-[#1b4d3e] cursor-pointer" />
            <label htmlFor="remember" className="text-xs font-medium text-[#1e293b] cursor-pointer select-none">Remember for 30 days</label>
          </div>

          <button className="w-full h-12 text-[15px] font-bold rounded-xl bg-[#1b4d3e] text-white hover:bg-[#133c30] transition-all shadow-lg shadow-[#1b4d3e]/20 flex items-center justify-center group">
            Sign In as {currentRole.label}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="mt-4 text-center text-sm font-medium text-slate-500 min-h-[24px] flex items-center justify-center">
            {role === 'patient' ? (
              <span>
                New to Medisphere?{' '}
                <Link to="/register" className="font-bold text-[#1b4d3e] hover:underline transition-colors">
                  Create an account
                </Link>
              </span>
            ) : (
              <span>
                Need staff credentials?{' '}
                <span className="font-bold text-[#1b4d3e]">
                  Contact Hospital Admin
                </span>
              </span>
            )}
          </div>
        </motion.form>
      </AnimatePresence>
    </motion.div>
  );
}
