import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Stethoscope, Phone, Star, Bed, Calendar, Award,
  HeartPulse, Activity, MapPin, Mail, AlertTriangle, X, ChevronLeft, ChevronRight,
  Clock, Sparkles, CheckCircle2, Zap, Ambulance, PhoneCall, Building2
} from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '../../../components/Button';
import { cn } from '../../../utils/cn';

export default function HomePage() {
  // Emergency Modal Popup State (Opens ONLY on first visit in the window/session)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    // Show only on first window visit, not on every page reload/navigation
    const hasSeenEmergency = sessionStorage.getItem('medisphere_emergency_seen');
    if (!hasSeenEmergency) {
      const timer = setTimeout(() => {
        setShowEmergencyModal(true);
        sessionStorage.setItem('medisphere_emergency_seen', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseEmergencyModal = () => {
    sessionStorage.setItem('medisphere_emergency_seen', 'true');
    setShowEmergencyModal(false);
  };

  // Compact Rectangular Ad Cards Data (Matching User Reference Design)
  const compactAds = [
    {
      id: 1,
      badge: 'Flat 40% off',
      badgeBg: 'bg-[#00897b]',
      company: 'MEDISPHERE PHARMA & LABS',
      subhead: 'Active Immunity &',
      title: 'METABOLIC BALANCE CHECK',
      desc: 'Certified Diabetes, Glycemic Support & 68+ Vital Lab Formulations',
      buttonText: 'Order now →',
      link: '/book-appointment',
      bgGradient: 'from-[#f0fdf4] via-[#f0fdf4]/50 to-white',
      borderColor: 'border-emerald-200/80',
      image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925419/medisphere/about/healthcheckups.jpg'
    },
    {
      id: 2,
      badge: 'Special Wholesale',
      badgeBg: 'bg-[#1d4ed8]',
      company: 'SHELLMEDS GLOBAL',
      subhead: 'WHO-GMP Verified',
      title: 'HOSPITAL MEDICAL SUPPLIES',
      desc: 'Sterile Injectables, Anti-Infectives & Institutional Priority Packs',
      buttonText: 'Explore catalogue →',
      link: '/departments',
      bgGradient: 'from-[#eff6ff] via-[#eff6ff]/50 to-white',
      borderColor: 'border-blue-200/80',
      image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925413/medisphere/about/docters.jpg'
    },
    {
      id: 3,
      badge: '24/7 Priority',
      badgeBg: 'bg-[#dc2626]',
      company: 'CRITICAL TRAUMA UNIT',
      subhead: 'GPS-Tracked Rapid Dispatch',
      title: 'ICU AMBULANCE ON WHEELS',
      desc: 'Mobile Ventilators, Oxygen Manifolds & Certified Paramedics',
      buttonText: 'Call now →',
      phone: 'tel:+918953208952',
      bgGradient: 'from-[#fef2f2] via-[#fef2f2]/50 to-white',
      borderColor: 'border-rose-200/80',
      image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925418/medisphere/about/emergencycare.jpg'
    },
    {
      id: 4,
      badge: 'Robotic Surgery',
      badgeBg: 'bg-[#4f46e5]',
      company: 'GERMAN SURGICAL TECH',
      subhead: 'Sub-Millimeter Precision',
      title: 'JOINT & SPINE RECONSTRUCTION',
      desc: 'Minimally Invasive Robotic Tech, Zero Muscle Damage & 24h Discharge',
      buttonText: 'Consult team →',
      link: '/departments/orthopedics',
      bgGradient: 'from-[#eef2ff] via-[#eef2ff]/50 to-white',
      borderColor: 'border-indigo-200/80',
      image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925432/medisphere/about/orthopedics.jpg'
    },
    {
      id: 5,
      badge: 'Mother & Child',
      badgeBg: 'bg-[#db2777]',
      company: 'BLOSSOM MATERNITY',
      subhead: 'Luxury Birthing & NICU',
      title: 'MATERNITY BLOSSOM SUITES',
      desc: 'Private LDR Suites, Painless Delivery Options & Level-3 NICU Backup',
      buttonText: 'Explore care →',
      link: '/departments/pediatrics',
      bgGradient: 'from-[#fdf2f8] via-[#fdf2f8]/50 to-white',
      borderColor: 'border-pink-200/80',
      image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925433/medisphere/about/pediatrics.jpg'
    },
    {
      id: 6,
      badge: 'Free Sunday Camp',
      badgeBg: 'bg-[#d97706]',
      company: 'COMMUNITY HEALTH DRIVE',
      subhead: 'Complimentary Screening',
      title: 'CARDIAC & HYPERTENSION CLINIC',
      desc: 'Free ECG, Blood Pressure & Senior Cardiologist Consultation',
      buttonText: 'Register free →',
      link: '/book-appointment',
      bgGradient: 'from-[#fffbeb] via-[#fffbeb]/50 to-white',
      borderColor: 'border-amber-200/80',
      image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925410/medisphere/about/cardiology.jpg'
    }
  ];

  // Carousel State: 1 card per view -> advances 1-by-1 across all ads
  const totalSlides = compactAds.length;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play interval for compact ad cards (changes every 4 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Real & Authentic Stats for a Newly Launched Premier Hospital Facility
  const stats = [
    { label: 'Hospital Beds', value: 120, suffix: '+', icon: Bed },
    { label: 'Specialist Units', value: 25, suffix: '+', icon: 'users' },
    { label: 'Senior Consultants', value: 30, suffix: '+', icon: Stethoscope },
    { label: 'Emergency & ICU', value: 24, suffix: '/7', icon: Calendar },
    { label: 'Modular OTs', value: 5, suffix: '+', icon: Award },
    { label: 'Digital Diagnostics', value: 100, suffix: '%', icon: HeartPulse },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">

      {/* ========================================================
          EMERGENCY CONTACT POPUP BANNER (Matching Reference Screenshot)
          ======================================================== */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-[2px]">
            {/* Click outside backdrop to close */}
            <div
              className="absolute inset-0"
              onClick={handleCloseEmergencyModal}
            ></div>

            {/* Modal Container: Matches screenshot 1-to-1 and mobile responsive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden z-10 max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button Top Right (Rounded circular icon button) */}
              <button
                onClick={handleCloseEmergencyModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Close"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* 2-Column Poster Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-auto md:min-h-[420px]">
                {/* Left Side: Crimson Poster Section */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#c8102e] via-[#a30b24] to-[#730517] text-white p-5 sm:p-7 md:p-8 flex flex-col justify-between relative overflow-hidden">
                  {/* Angled subtle background accent */}
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-black/15 blur-2xl pointer-events-none"></div>

                  <div className="relative z-10">
                    {/* Top Pill Tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-white text-[11px] font-bold tracking-wider uppercase mb-5">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                      24/7 RAPID EMERGENCY
                    </div>

                    {/* Poster Main Title */}
                    <h3 className="text-2xl sm:text-[28px] font-extrabold tracking-tight leading-[1.15] mb-3 font-sans text-white">
                      CRITICAL CARE & <br />
                      TRAUMA CENTER
                    </h3>
                    <p className="text-xs sm:text-[12.5px] text-white/90 leading-relaxed font-normal mb-6 max-w-[320px]">
                      State-of-the-art emergency unit equipped with advanced triage, on-site diagnostics, and instant consultant support.
                    </p>

                    {/* Bullet Highlights with circular checks */}
                    <div className="space-y-2.5 text-xs font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <span className="h-4.5 w-4.5 rounded-full bg-red-500/80 flex items-center justify-center text-[11px] font-bold text-white shrink-0">✓</span>
                        <span>Zero Triage Waiting Time</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="h-4.5 w-4.5 rounded-full bg-red-500/80 flex items-center justify-center text-[11px] font-bold text-white shrink-0">✓</span>
                        <span>On-Duty Emergency Physicians & Surgeons</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="h-4.5 w-4.5 rounded-full bg-red-500/80 flex items-center justify-center text-[11px] font-bold text-white shrink-0">✓</span>
                        <span>Advanced Life-Support (ALS) Ambulances</span>
                      </div>
                    </div>
                  </div>

                  {/* Campus Tag at Bottom */}
                  <div className="relative z-10 pt-4 mt-6 border-t border-white/15 text-[11px] text-white/85 flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 shrink-0 text-white" />
                    <span>Vibhuti Khand, Gomtinagar, Lucknow</span>
                  </div>
                </div>

                {/* Right Side: Action Hotline & Services */}
                <div className="md:col-span-7 p-5 sm:p-7 md:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <div className="mb-4 pr-6 sm:pr-8">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                        Need Immediate Medical Attention?
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Connect directly with our 24/7 emergency command desk for ambulance dispatch or physician consultation.
                      </p>
                    </div>

                    {/* Primary Emergency Hotline Card */}
                    <div className="p-3.5 sm:p-4 rounded-xl border border-red-200 bg-red-50/40 shadow-xs mb-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3.5">
                          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs shrink-0">
                            <PhoneCall className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                          </div>
                          <div>
                            <div className="text-[9.5px] sm:text-[10px] font-bold text-red-600 uppercase tracking-wider">
                              24/7 PRIMARY EMERGENCY HOTLINE
                            </div>
                            <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                              +91 89532 08952
                            </div>
                          </div>
                        </div>
                        <a
                          href="tel:+918953208952"
                          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-red-600 text-white text-xs font-bold shadow-xs hover:bg-red-700 transition-colors shrink-0"
                        >
                          Call Now <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 pl-0.5 font-medium flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Direct line to Triage Officer • Immediate response
                      </p>
                    </div>

                    {/* Two Secondary Emergency Services */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {/* Ambulance */}
                      <a
                        href="tel:+918953208952"
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-start gap-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Ambulance className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">ICU Ambulance</div>
                          <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5">Ventilator & EMTs onboard</div>
                          <span className="text-[10.5px] font-bold text-emerald-700 mt-1.5 inline-block">Tap to Dispatch &rarr;</span>
                        </div>
                      </a>

                      {/* ER Campus Location */}
                      <a
                        href="https://maps.google.com/?q=Vibhuti+Khand,+Gomtinagar,+Lucknow,+Uttar+Pradesh+226010"
                        target="_blank"
                        rel="noreferrer"
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-start gap-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Emergency Entrance</div>
                          <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5">Vibhuti Khand, Gomtinagar</div>
                          <span className="text-[10.5px] font-bold text-sky-700 mt-1.5 inline-block">Get Directions &rarr;</span>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Dismiss & Continue Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleCloseEmergencyModal}
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center flex items-center justify-center gap-2"
                    >
                      Continue to Website &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* ========================================================
          HERO SECTION (High-end Sleek Design)
          ======================================================== */}
      <section className="relative overflow-hidden bg-[var(--color-background)] lg:bg-transparent min-h-[580px] lg:min-h-[660px] flex items-center pt-8 pb-14 lg:pt-0 lg:pb-0">

        {/* Full Bleed Right Image */}
        <div className="absolute top-0 right-0 w-full lg:w-[58%] h-full z-0 hidden lg:block">
          <img src="/Hospital.png" alt="Hospital Building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-transparent to-black/10"></div>
        </div>

        {/* Massive Curved Background Overlay on Left */}
        <div className="absolute top-0 left-0 w-full lg:w-[52%] h-full bg-[var(--color-background)] lg:rounded-br-[280px] xl:rounded-br-[360px] z-10 shadow-[12px_0_35px_rgba(0,0,0,0.03)] hidden lg:block"></div>

        <div className="container mx-auto max-w-[1400px] px-4 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* Mobile Hospital Banner Image - At the Top right below Navbar */}
            <div className="relative h-[220px] sm:h-[280px] w-full lg:hidden rounded-2xl overflow-hidden shadow-md border border-[var(--color-border)] mt-1 mb-1">
              <img src="/Hospital.png" alt="Hospital Building" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[620px] px-1 sm:pl-2 lg:pl-8 py-4 sm:py-8 lg:py-16"
            >
              {/* Simple Text without badge */}
              <p className="text-xs sm:text-sm md:text-base font-semibold text-emerald-700 mb-2">
                NABH & NABL Accredited Center of Excellence
              </p>

              {/* Main Heading per exact user spec: Plus Jakarta Sans, 48px, 700, 56.64px */}
              <h1 className="text-2xl sm:text-4xl md:text-[46px] lg:text-[48px] font-bold text-[var(--color-heading)] leading-tight lg:leading-[56.64px] mb-4 sm:mb-5 tracking-tight font-sans">
                World-Class Medical <br />
                <span className="bg-gradient-to-r from-[#0284c7] via-[#0d9488] to-[#16a34a] bg-clip-text text-transparent">
                  Care You Can Trust
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed font-normal sm:pr-4 max-w-[540px]">
                Experience healthcare that combines clinical brilliance, cutting-edge technology, and compassionate touch across 25+ specialized departments.
              </p>

              {/* 4 Feature Badges (Single line - 4 in 1 row) */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 mb-6 sm:mb-8">
                {/* 1. Advanced Technology */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Activity className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div className="min-w-0 w-full sm:w-auto">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 leading-tight truncate">Advanced Tech</div>
                    <div className="text-[8px] sm:text-[10px] font-semibold text-slate-500 leading-none mt-0.5 hidden xs:block sm:block truncate">Next-Gen Systems</div>
                  </div>
                </div>

                {/* 2. Senior Consultants */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Stethoscope className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div className="min-w-0 w-full sm:w-auto">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 leading-tight truncate">Expert Doctors</div>
                    <div className="text-[8px] sm:text-[10px] font-semibold text-slate-500 leading-none mt-0.5 hidden xs:block sm:block truncate">Senior Faculty</div>
                  </div>
                </div>

                {/* 3. 24/7 Emergency */}
                <div
                  onClick={() => setShowEmergencyModal(true)}
                  className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs hover:shadow-md hover:border-red-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                    <PhoneCall className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 animate-pulse" />
                  </div>
                  <div className="min-w-0 w-full sm:w-auto">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 leading-tight truncate">24/7 Emergency</div>
                    <div className="text-[8px] sm:text-[10px] font-bold text-red-600 leading-none mt-0.5 hidden xs:block sm:block truncate">Level-1 Trauma</div>
                  </div>
                </div>

                {/* 4. Patient First */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                    <HeartPulse className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div className="min-w-0 w-full sm:w-auto">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 leading-tight truncate">Patient First</div>
                    <div className="text-[8px] sm:text-[10px] font-semibold text-slate-500 leading-none mt-0.5 hidden xs:block sm:block truncate">Compassion</div>
                  </div>
                </div>
              </div>

              {/* Stylish, Simple & Professional Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-7">
                {/* Primary Button */}
                <Link to="/book-appointment" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-full font-semibold text-xs sm:text-sm bg-[#1a4436] hover:bg-[#123328] text-white shadow-[0_4px_12px_rgba(26,68,54,0.25)] hover:shadow-[0_6px_16px_rgba(26,68,54,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 border border-emerald-800/30 cursor-pointer">
                    <Calendar className="h-4 w-4 text-emerald-300" />
                    <span>Book Appointment</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-0.5 opacity-80" />
                  </button>
                </Link>

                {/* Secondary Emergency Button (Stylish, Professional & High-Contrast) */}
                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-full font-semibold text-xs sm:text-sm bg-red-50/90 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 shadow-xs hover:shadow-[0_4px_14px_rgba(220,38,38,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 group-hover:bg-white transition-colors"></span>
                  </span>
                  <PhoneCall className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>24/7 Emergency Line</span>
                </button>
              </div>

              {/* Authentic New Hospital Facility Launch Status */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/80 w-full sm:max-w-fit shadow-xs">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 shadow-xs">
                  <Building2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <p className="text-[11.5px] sm:text-[12px] font-bold text-slate-900 leading-none">
                      Modern Multispecialty Healthcare Campus
                    </p>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 leading-tight">
                    Now Open in Gomtinagar, Lucknow • Welcoming OPD & Inpatient Consultations
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================
          STATS STRIP (Fixed 6-Item Grid on Web View / Marquee Only on Mobile)
          ======================================================== */}
      <section className="relative z-30 w-full mb-6 sm:mb-10 border-y border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs py-3 sm:py-4">
        
        {/* Desktop Web View: Fixed Stationary 6-Item Grid (No Marquee) */}
        <div className="hidden md:block container mx-auto max-w-[1400px] px-4">
          <div className="grid grid-cols-6 gap-2 lg:gap-4 items-center justify-between divide-x divide-slate-100">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center gap-2.5 lg:gap-3.5 group justify-center",
                  index !== 0 ? "pl-2 lg:pl-4" : ""
                )}
              >
                <div className="h-9 w-9 lg:h-11 lg:w-11 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-[var(--color-primary)] border border-slate-200 shadow-xs group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                  {typeof stat.icon === 'string' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  ) : (
                    <stat.icon className="h-4 w-4 lg:h-5 lg:w-5 text-inherit transition-colors duration-300" />
                  )}
                </div>
                <div className="text-left whitespace-nowrap">
                  <div className="text-base lg:text-2xl font-bold text-[var(--color-heading)] font-serif leading-none tracking-tight">
                    <span>{stat.value}</span>
                    <span className="text-emerald-600">{stat.suffix}</span>
                  </div>
                  <p className="text-[8.5px] lg:text-[9.5px] text-slate-500 font-bold mt-1 uppercase tracking-[0.08em] lg:tracking-[0.1em]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View: Infinite Marquee Strip (Only runs on mobile screens) */}
        <div className="md:hidden overflow-hidden w-full relative">
          {/* Gradient edge fades on mobile */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>

          <motion.div
            className="flex items-center gap-6 w-max py-0.5"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 22
            }}
          >
            {[...stats, ...stats, ...stats].map((stat, index) => (
              <div key={index} className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-[var(--color-primary)] border border-slate-200 shadow-xs">
                  {typeof stat.icon === 'string' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  ) : (
                    <stat.icon className="h-3.5 w-3.5 text-inherit" />
                  )}
                </div>
                <div className="text-left whitespace-nowrap">
                  <div className="text-sm font-bold text-[var(--color-heading)] font-serif leading-none tracking-tight">
                    <span>{stat.value}</span>
                    <span className="text-emerald-600">{stat.suffix}</span>
                  </div>
                  <p className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase tracking-[0.06em]">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </section>

      {/* ========================================================
          COMPACT RECTANGULAR AD CAMPAIGN CARDS (User Reference Layout)
          ======================================================== */}
      <section className="py-6 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1340px] px-2 sm:px-4">
          <div
            className="relative flex items-center gap-1.5 sm:gap-3"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left Nav Arrow Button */}
            <button
              onClick={handlePrevSlide}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white border border-slate-200/90 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shrink-0 z-20 cursor-pointer"
              aria-label="Previous Campaigns"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Cards Container */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {(() => {
                  const ad1 = compactAds[currentSlide];
                  const ad2 = compactAds[(currentSlide + 1) % totalSlides];

                  const renderCard = (ad) => (
                    <div
                      className={`relative rounded-2xl border ${ad.borderColor} bg-gradient-to-r ${ad.bgGradient} overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 h-[155px] sm:h-[165px] md:h-[175px] flex items-stretch w-full`}
                    >
                      {/* Left Content */}
                      <div className="w-[58%] sm:w-[56%] p-3 sm:p-4 md:p-4.5 flex flex-col justify-between z-10 relative">
                        <div>
                          {/* Top-Left Badge */}
                          <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] sm:text-[10.5px] font-bold text-white shadow-xs w-fit mb-1 ${ad.badgeBg}`}>
                            {ad.badge}
                          </span>

                          {/* Company / Dept Sub-tag */}
                          <div className="text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
                            {ad.company}
                          </div>

                          {/* Subtitle */}
                          <div className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight mt-0.5 truncate">
                            {ad.subhead}
                          </div>

                          {/* Main Bold Title */}
                          <h3 className="text-xs sm:text-sm md:text-[14px] font-black uppercase text-slate-900 tracking-tight leading-snug line-clamp-1 mt-0.5">
                            {ad.title}
                          </h3>

                          {/* Short Description */}
                          <p className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5 hidden sm:block">
                            {ad.desc}
                          </p>
                        </div>

                        {/* Dark Action Pill Button */}
                        {ad.phone ? (
                          <a
                            href={ad.phone}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0e2a22] hover:bg-[#163f33] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs w-fit mt-1"
                          >
                            {ad.buttonText}
                          </a>
                        ) : (
                          <Link
                            to={ad.link}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0e2a22] hover:bg-[#163f33] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs w-fit mt-1"
                          >
                            {ad.buttonText}
                          </Link>
                        )}
                      </div>

                      {/* Right Image Container */}
                      <div className="w-[42%] sm:w-[44%] relative overflow-hidden flex items-center justify-center p-1 sm:p-2">
                        <img
                          src={ad.image}
                          alt={ad.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </div>
                  );

                  return (
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full"
                    >
                      {/* Card 1: Always visible */}
                      <div className="w-full">
                        {renderCard(ad1)}
                      </div>

                      {/* Card 2: Visible in Web View (md & lg) */}
                      <div className="hidden md:block w-full">
                        {renderCard(ad2)}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Right Nav Arrow Button */}
            <button
              onClick={handleNextSlide}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white border border-slate-200/90 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shrink-0 z-20 cursor-pointer"
              aria-label="Next Campaign"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Pagination Indicators matching screenshot (• —) */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-6 bg-teal-700' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          1. TRUSTED BY LOGOS (Infinite Smooth Marquee)
          ======================================================== */}
      <section className="py-10 sm:py-14 bg-[var(--color-background)] overflow-hidden">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              Accredited & Recognized By Global Health Organizations
            </h4>
          </div>
        </div>

        {/* Marquee Track with soft gradient edge masks */}
        <div className="relative w-full overflow-hidden">
          {/* Left & Right gradient edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[var(--color-background)] to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[var(--color-background)] to-transparent z-10"></div>

          <motion.div
            className="flex items-center gap-6 sm:gap-10 w-max py-2"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 24
            }}
          >
            {[
              ...[
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925436/medisphere/organizations/unicef.png', alt: 'UNICEF' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925438/medisphere/organizations/who.png', alt: 'WHO' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925437/medisphere/organizations/usaid.png', alt: 'USAID' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925435/medisphere/organizations/iso.png', alt: 'ISO' }
              ],
              ...[
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925436/medisphere/organizations/unicef.png', alt: 'UNICEF' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925438/medisphere/organizations/who.png', alt: 'WHO' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925437/medisphere/organizations/usaid.png', alt: 'USAID' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925435/medisphere/organizations/iso.png', alt: 'ISO' }
              ],
              ...[
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925436/medisphere/organizations/unicef.png', alt: 'UNICEF' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925438/medisphere/organizations/who.png', alt: 'WHO' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925437/medisphere/organizations/usaid.png', alt: 'USAID' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925435/medisphere/organizations/iso.png', alt: 'ISO' }
              ],
              ...[
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925436/medisphere/organizations/unicef.png', alt: 'UNICEF' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925438/medisphere/organizations/who.png', alt: 'WHO' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925437/medisphere/organizations/usaid.png', alt: 'USAID' },
                { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925435/medisphere/organizations/iso.png', alt: 'ISO' }
              ]
            ].map((logo, idx) => (
              <div
                key={idx}
                className="h-16 w-36 sm:h-20 sm:w-48 bg-white rounded-2xl shadow-xs border border-slate-200/90 flex items-center justify-center p-3.5 sm:p-4 shrink-0 hover:shadow-md transition-all duration-300"
              >
                <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" className="h-full w-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          2. QUICK ACTION CARDS (2 per row on mobile)
          ======================================================== */}
      <section className="py-10 sm:py-16 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-3 sm:px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { title: 'Find a Doctor', desc: 'Search by specialty & availability', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925413/medisphere/about/docters.jpg', link: '/doctors' },
              { title: 'Our Departments', desc: 'Comprehensive care across 25+ fields', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925434/medisphere/about/team.jpg', link: '/departments' },
              { title: 'Health Checkups', desc: 'Preventive full-body wellness plans', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925419/medisphere/about/healthcheckups.jpg', link: '/book-appointment' },
              { title: 'Emergency Care', desc: '24/7 Trauma, ICU & Ambulance', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925417/medisphere/about/emergency.jpg', link: '/contact' }
            ].map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                className="bg-slate-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group min-h-[175px] sm:min-h-[220px] md:min-h-[250px] flex flex-col justify-end border border-slate-200 cursor-pointer"
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img src={card.img} alt={card.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15 group-hover:from-black/95 transition-colors"></div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="font-serif font-bold text-sm sm:text-lg md:text-xl text-white mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2 leading-tight">
                    <span>{card.title}</span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-200 mb-2.5 sm:mb-4 line-clamp-2 leading-tight sm:leading-normal">{card.desc}</p>
                  <div className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border border-white/30 text-white flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-transparent group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHY CHOOSE US (3 cards per line)
          ======================================================== */}
      <section className="py-10 sm:py-20 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1260px] px-2.5 sm:px-4">
          <div className="text-center mb-8 sm:mb-14 max-w-2xl mx-auto">
            <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800 mb-2">Why Choose Medisphere</h4>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-heading)] tracking-tight">Exceptional Care, Every Single Time</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#0284c7] to-[#16a34a] mx-auto mt-3 sm:mt-4 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-3 font-medium px-2">
              Built to international hospital standards with patient safety, clinical accuracy, and round-the-clock emergency support at its core.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-7">
            {[
              {
                title: 'Advanced Medical Tech',
                desc: 'Equipped with next-generation digital imaging, robotic-assisted surgical systems, and fully automated diagnostic labs.',
                icon: Activity,
                color: 'text-sky-600 bg-sky-50 border-sky-100',
                tag: 'Next-Gen Infrastructure',
                cardAccent: 'group-hover:border-sky-300'
              },
              {
                title: 'Senior Specialist Doctors',
                desc: 'Experienced senior consultants, surgeons, and intensivists dedicated to multidisciplinary evidence-based treatment.',
                icon: Stethoscope,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                tag: 'Experienced Faculty',
                cardAccent: 'group-hover:border-emerald-300'
              },
              {
                title: 'Patient-Centric Care',
                desc: 'Individualized recovery pathways, compassionate nursing support, and transparent communication with families.',
                icon: HeartPulse,
                color: 'text-rose-600 bg-rose-50 border-rose-100',
                tag: 'Compassionate Healing',
                cardAccent: 'group-hover:border-rose-300'
              },
              {
                title: 'Safe & Ultra-Sterile Campus',
                desc: 'Ultra-clean modular operation theatres with HEPA laminar air filtration and rigorous international infection control.',
                icon: ShieldCheck,
                color: 'text-teal-600 bg-teal-50 border-teal-100',
                tag: 'NABH Aligned Standards',
                cardAccent: 'group-hover:border-teal-300'
              },
              {
                title: '24/7 Rapid Emergency & ICU',
                desc: 'Dedicated Level-1 trauma desk, immediate triage physician, on-site blood bank, and GPS-tracked ICU ambulance fleet.',
                icon: PhoneCall,
                color: 'text-red-600 bg-red-50 border-red-100',
                tag: 'Zero Wait Triage',
                cardAccent: 'group-hover:border-red-300'
              },
              {
                title: 'Transparent & Affordable',
                desc: 'Direct cashless tie-ups with 50+ insurance providers, transparent treatment packages, and zero hidden hospital charges.',
                icon: Award,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
                tag: 'Cashless Tie-Ups',
                cardAccent: 'group-hover:border-amber-300'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 lg:p-7 border border-slate-200/90 shadow-xs hover:shadow-lg ${item.cardAccent} hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Subtle top indicator glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div>
                  {/* Card Header: Icon + Number badge */}
                  <div className="flex items-center justify-between mb-2.5 sm:mb-4 lg:mb-5">
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-xl sm:rounded-2xl ${item.color} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300`}>
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black font-mono text-slate-300 tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Card Title & Desc */}
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2.5 group-hover:text-emerald-800 transition-colors font-sans leading-tight line-clamp-2 sm:line-clamp-none">
                    {item.title}
                  </h3>
                  <p className="text-[9.5px] sm:text-xs lg:text-sm text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
                    {item.desc}
                  </p>
                </div>

                {/* Card Bottom Tag */}
                <div className="pt-2 sm:pt-4 lg:pt-5 mt-2.5 sm:mt-4 lg:mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[8.5px] sm:text-[10px] lg:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate mr-1">
                    {item.tag}
                  </span>
                  <div className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. MEDICAL SPECIALTIES
          ======================================================== */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="text-center mb-14">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-2">Our Clinical Specialties</h4>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)]">Comprehensive Medical Excellence</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { title: 'Cardiology', desc: 'Heart & Vascular Care', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925410/medisphere/about/cardiology.jpg', link: '/departments/cardiology' },
              { title: 'Neurology', desc: 'Brain & Nervous System', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925429/medisphere/about/neurologist.jpg', link: '/departments/neurology' },
              { title: 'Orthopedics', desc: 'Bone & Joint Surgery', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925432/medisphere/about/orthopedics.jpg', link: '/departments/orthopedics' },
              { title: 'Oncology', desc: 'Comprehensive Cancer Care', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925430/medisphere/about/oncology.jpg', link: '/departments/oncology' },
              { title: 'Pediatrics', desc: 'Child & Neonatal Health', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925433/medisphere/about/pediatrics.jpg', link: '/departments/pediatrics' },
              { title: 'Emergency Care', desc: '24/7 Level-1 Trauma Care', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925418/medisphere/about/emergencycare.jpg', link: '/contact' }
            ].map((spec, idx) => (
              <Link key={idx} to={spec.link} className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="h-24 sm:h-32 bg-slate-200 relative overflow-hidden">
                  <img src={spec.img} alt={spec.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-[var(--color-heading)] mb-0.5 flex items-center justify-center gap-1">
                    {spec.title} <span className="text-emerald-600">.</span>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-[var(--color-foreground)] uppercase tracking-wider font-semibold line-clamp-1">{spec.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. THREE COLUMN SECTION (Stories, Articles, Awards)
          ======================================================== */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Column 1: Patient Stories */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[var(--color-heading)] mb-6">Patient Stories</h3>
                <div className="text-emerald-600 text-4xl font-serif leading-none mb-3">"</div>
                <p className="text-[var(--color-heading)] font-medium text-sm leading-relaxed mb-6">
                  "The care and medical precision I received at Medisphere during my knee replacement was exceptional. The robotic surgery allowed me to walk pain-free within 24 hours. The nursing staff and doctors treat you like family."
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                  alt="Sarah Johnson"
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full object-cover shadow-sm border border-slate-200 shrink-0"
                />
                <div>
                  <div className="font-bold text-[var(--color-heading)] text-sm">— Sarah Johnson</div>
                  <div className="text-[11px] text-slate-500">Orthopedic Surgery Patient</div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Latest Articles */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-heading)]">Latest Health Insights</h3>
                <span className="text-xs font-bold text-emerald-700 cursor-pointer hover:underline">View All &rarr;</span>
              </div>
              <div className="space-y-5">
                {[
                  { title: '10 Proven Habits for a Healthy Heart & Longevity', category: 'CARDIOLOGY', date: 'May 20, 2024', img: 'blog-1' },
                  { title: 'Daily Routines That Enhance Mental Well-Being', category: 'WELLNESS', date: 'May 18, 2024', img: 'blog-2' }
                ].map((post, idx) => (
                  <div key={idx} className="flex gap-4 items-center group cursor-pointer">
                    <div className="h-20 w-24 rounded-xl shrink-0 relative overflow-hidden bg-slate-100 shadow-xs">
                      <img src={`/${post.img}.jpg`} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mb-1">{post.category}</div>
                      <h4 className="font-bold text-[var(--color-heading)] text-sm mb-1 group-hover:text-emerald-700 transition-colors leading-snug">{post.title}</h4>
                      <div className="text-[10px] text-slate-500">{post.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Awards */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-heading)]">Awards & Honors</h3>
                <span className="text-xs font-bold text-emerald-700 cursor-pointer hover:underline">View All &rarr;</span>
              </div>
              <div className="space-y-5">
                {[
                  { title: 'Best Multispecialty Hospital of the Year', year: '2024 - Healthcare Excellence Awards' },
                  { title: 'Excellence in Emergency & Trauma Care', year: '2023 - National Health Awards' },
                  { title: 'Top Patient Satisfaction & Safety Benchmark', year: '2023 - Quality Healthcare Ranking' }
                ].map((award, idx) => (
                  <div key={idx} className="flex gap-3.5 items-center">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-xs">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-heading)] text-sm mb-0.5 leading-snug">{award.title}</h4>
                      <div className="text-[11px] text-slate-500">{award.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          6. INSURANCE & CORPORATE PARTNERS
          ======================================================== */}
      <section className="py-14 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="text-center mb-8">
            <h4 className="font-serif font-bold text-xl text-[var(--color-heading)]">
              Cashless Insurance & Corporate Partners
            </h4>
            <p className="text-xs text-slate-500 mt-1">Hassle-free, quick cashless claims processing with 50+ leading insurance providers</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {[
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925421/medisphere/about/Insurancepartners/abchi.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925422/medisphere/about/Insurancepartners/Aetna.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925423/medisphere/about/Insurancepartners/aveanna.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925425/medisphere/about/Insurancepartners/cigna.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925427/medisphere/about/Insurancepartners/starhealtcare.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925428/medisphere/about/Insurancepartners/tattaig.jpg', isTata: true }
            ].map((partner, idx) => (
              <div key={idx} className="w-32 h-16 bg-white flex items-center justify-center rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden group">
                <img
                  src={partner.img}
                  alt="Insurance Partner"
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${partner.isTata ? 'object-contain p-2' : 'object-cover'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. CAMPUS LOCATION & VISITING HOURS
          ======================================================== */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)] mb-3">Visit Our Campus</h2>
            <p className="text-[var(--color-foreground)] max-w-2xl mx-auto text-sm">Centrally located in Lucknow, our state-of-the-art medical campus is easily accessible 24 hours a day with dedicated emergency parking and ambulance docks.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Contact Details Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl sm:rounded-[24px] p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/90 h-full">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-heading)] mb-5 sm:mb-6">Get in Touch</h3>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex gap-3.5 sm:gap-4">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-[var(--color-primary)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)] mb-0.5">Hospital Location</h4>
                    <p className="text-xs text-[var(--color-foreground)] leading-relaxed">
                      Vibhuti Khand, Gomtinagar,<br />
                      Lucknow, Uttar Pradesh - 226010
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 sm:gap-4">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 text-red-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)] mb-0.5">Contact Numbers</h4>
                    <p className="text-xs text-red-600 font-bold">24/7 Emergency: +91 89532 08952</p>
                    <p className="text-xs text-[var(--color-foreground)]">General Enquiry: +91 89532 08952</p>
                  </div>
                </div>

                <div className="flex gap-3.5 sm:gap-4">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-[var(--color-primary)]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)] mb-0.5">Official Email</h4>
                    <p className="text-xs text-[var(--color-foreground)]">info@progixtechnology.com</p>
                    <p className="text-xs text-[var(--color-foreground)]">appointments@medisphere.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-[var(--color-heading)] mb-3">Visiting Hours</h4>
                <div className="flex justify-between text-xs text-[var(--color-foreground)] mb-2">
                  <span>General Wards</span>
                  <span className="font-bold text-[var(--color-heading)]">4:00 PM - 7:00 PM</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--color-foreground)]">
                  <span>Intensive Care Unit (ICU)</span>
                  <span className="font-bold text-[var(--color-heading)]">10:00 AM - 11:00 AM</span>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="lg:col-span-8 h-[280px] sm:h-[400px] lg:h-full min-h-[280px] sm:min-h-[420px] lg:min-h-[500px] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-sm border border-slate-200/90 bg-slate-100 relative">
              <iframe
                title="Hospital Campus Location"
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Vibhuti%20Khand,%20Gomtinagar,%20Lucknow,%20Uttar%20Pradesh%20226010&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
