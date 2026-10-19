import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  HeartPulse, Activity, Phone, ArrowRight, CheckCircle2, ChevronRight, 
  Brain, Bone, Baby, Eye, Stethoscope, Microscope, Zap, Calendar, 
  Clock, ShieldCheck, Award, UserCheck, Star
} from 'lucide-react';
import { Button } from '../../../components/Button';

// Mock database for department details
const departmentsData = {
  cardiology: {
    id: 'cardiology',
    title: 'Cardiology',
    icon: HeartPulse,
    badgeColor: 'bg-red-50 text-red-600 border-red-200',
    iconBg: 'bg-red-500/10 text-red-600',
    shortDesc: 'Advanced heart care, angioplasty, and cardiac surgery by top specialists.',
    longDesc: 'Our Cardiology department offers comprehensive services for the diagnosis, treatment, and prevention of heart diseases. We are equipped with state-of-the-art technology, including modern Cath Labs, Echocardiography, and advanced ICU facilities to manage cardiac emergencies 24/7.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925410/medisphere/about/cardiology.jpg',
    treatments: ['Coronary Angiography & Angioplasty', 'Pacemaker Implantation', 'Heart Failure Management', 'Echocardiography (ECG, TMT, Holter)'],
    facilities: ['24/7 Cardiac Emergency', 'Advanced Cath Lab', 'Dedicated Cardiac ICU', 'Non-Invasive Cardiology Labs'],
    doctorsCount: 12,
    doctors: [
      { name: 'Dr. Ravi Kumar', qualification: 'MD, DM (Cardiology)', exp: '15+ yrs', role: 'Head of Cardiology' },
      { name: 'Dr. Sarah Smith', qualification: 'MD (Cardiology), FACC', exp: '12+ yrs', role: 'Senior Interventional Cardiologist' }
    ]
  },
  neurology: {
    id: 'neurology',
    title: 'Neurology',
    icon: Brain,
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    iconBg: 'bg-purple-500/10 text-purple-600',
    shortDesc: 'Comprehensive treatment for brain, spinal cord, and nervous system disorders.',
    longDesc: 'The Neurology department at Medisphere provides expert care for complex neurological conditions. From stroke management to epilepsy and neuro-rehabilitation, our multidisciplinary team of neurologists, neurosurgeons, and therapists work together to ensure the best possible patient outcomes.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925429/medisphere/about/neurologist.jpg',
    treatments: ['Stroke Management & Thrombolysis', 'Epilepsy & Seizure Control', 'Parkinsons & Movement Disorders', 'Headache & Migraine Treatment'],
    facilities: ['Neuro ICU & Stroke Unit', 'Advanced MRI & CT Scans', 'EEG & EMG Labs', 'Neuro-Rehabilitation Center'],
    doctorsCount: 8,
    doctors: [
      { name: 'Dr. Michael Chen', qualification: 'MD, DM (Neurology)', exp: '14+ yrs', role: 'Senior Consultant Neurologist' },
      { name: 'Dr. Ananya Sharma', qualification: 'MS, MCh (Neuro Surgery)', exp: '10+ yrs', role: 'Neurosurgeon' }
    ]
  },
  orthopedics: {
    id: 'orthopedics',
    title: 'Orthopedics',
    icon: Bone,
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
    iconBg: 'bg-amber-500/10 text-amber-600',
    shortDesc: 'Joint replacement, spine surgery, and sports medicine experts.',
    longDesc: 'Our Orthopedics department specializes in the diagnosis and treatment of bone, joint, and muscle disorders. We are pioneers in minimally invasive joint replacement surgeries and offer comprehensive sports medicine programs to help athletes return to their peak performance.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925432/medisphere/about/orthopedics.jpg',
    treatments: ['Total Knee & Hip Replacement', 'Arthroscopy & Sports Injuries', 'Spinal Surgery', 'Fracture & Trauma Care'],
    facilities: ['Modular Orthopedic OTs', 'Physiotherapy & Rehab Center', 'Bone Mineral Density Testing', '24/7 Trauma Care'],
    doctorsCount: 15,
    doctors: [
      { name: 'Dr. Rajesh Verma', qualification: 'MS (Ortho), MCh', exp: '18+ yrs', role: 'Chief Orthopedic Surgeon' },
      { name: 'Dr. Priya Desai', qualification: 'DNB (Orthopedics)', exp: '9+ yrs', role: 'Joint Replacement Specialist' }
    ]
  },
  pediatrics: {
    id: 'pediatrics',
    title: 'Pediatrics',
    icon: Baby,
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    iconBg: 'bg-blue-500/10 text-blue-600',
    shortDesc: 'Specialized healthcare for infants, children, and adolescents.',
    longDesc: 'Medisphere Pediatrics provides compassionate and expert medical care for children from birth to adolescence. Our child-friendly environment, coupled with a team of experienced pediatricians and neonatologists, ensures that your little ones receive the best possible care for their physical and emotional well-being.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925433/medisphere/about/pediatrics.jpg',
    treatments: ['Neonatal Intensive Care (NICU)', 'Pediatric Immunization', 'Childhood Asthma Management', 'Pediatric Surgery'],
    facilities: ['Level 3 NICU & PICU', 'Child-Friendly Wards', '24/7 Pediatric Emergency', 'Developmental Assessment Clinic'],
    doctorsCount: 10,
    doctors: [
      { name: 'Dr. Sunita Patel', qualification: 'MD (Pediatrics)', exp: '16+ yrs', role: 'Senior Pediatrician' },
      { name: 'Dr. Rahul Mehta', qualification: 'MD, Fellowship (Neonatology)', exp: '11+ yrs', role: 'Neonatal Specialist' }
    ]
  },
  ophthalmology: {
    id: 'ophthalmology',
    title: 'Ophthalmology',
    icon: Eye,
    badgeColor: 'bg-teal-50 text-teal-600 border-teal-200',
    iconBg: 'bg-teal-500/10 text-teal-600',
    shortDesc: 'Advanced eye care, LASIK, and cataract surgery.',
    longDesc: 'Our Ophthalmology department is dedicated to preserving and restoring vision. We offer a full spectrum of eye care services, from routine eye exams to advanced surgeries like LASIK and micro-incision cataract surgery, using the latest optical technology and lasers.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925409/medisphere/about/about-story-img.jpg',
    treatments: ['Phacoemulsification (Cataract)', 'LASIK Laser Vision Correction', 'Glaucoma Screening & Surgery', 'Diabetic Retinopathy Care'],
    facilities: ['Advanced Laser Suite', 'Optical Coherence Tomography (OCT)', 'Dedicated Eye OT', 'In-house Optical Store'],
    doctorsCount: 6,
    doctors: [
      { name: 'Dr. Amit Trivedi', qualification: 'MS (Ophthalmology)', exp: '14+ yrs', role: 'Cornea & Refractive Surgeon' }
    ]
  },
  'general-medicine': {
    id: 'general-medicine',
    title: 'General Medicine',
    icon: Stethoscope,
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    shortDesc: 'Primary care, diagnostics, and management of chronic conditions.',
    longDesc: 'The General Medicine department serves as the first point of contact for adult patients. Our expert physicians provide comprehensive diagnosis and non-surgical treatment for a wide range of acute and chronic illnesses, focusing on preventive care and holistic health management.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925413/medisphere/about/docters.jpg',
    treatments: ['Diabetes & Hypertension Management', 'Infectious Diseases', 'Thyroid Disorders', 'Adult Immunization & Health Checks'],
    facilities: ['Comprehensive Diagnostic Labs', '24/7 Fever Clinic', 'Preventive Health Check Lounge', 'Multidisciplinary Consultations'],
    doctorsCount: 20,
    doctors: [
      { name: 'Dr. Ritik Pandey', qualification: 'MD (Internal Medicine)', exp: '10+ yrs', role: 'Senior Consultant Physician' }
    ]
  },
  oncology: {
    id: 'oncology',
    title: 'Oncology',
    icon: Microscope,
    badgeColor: 'bg-rose-50 text-rose-600 border-rose-200',
    iconBg: 'bg-rose-500/10 text-rose-600',
    shortDesc: 'Comprehensive cancer care with cutting-edge treatments and compassionate support.',
    longDesc: 'Our Oncology department provides holistic, multidisciplinary cancer care through a dedicated team of medical oncologists, surgical oncologists, and radiation specialists. From early-stage detection to advanced cancer management, we combine state-of-the-art therapies with a patient-first philosophy to deliver the best possible outcomes.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925430/medisphere/about/oncology.jpg',
    treatments: ['Chemotherapy & Targeted Therapy', 'Radiation Oncology', 'Surgical Oncology', 'Palliative & Supportive Care'],
    facilities: ['Dedicated Oncology Wards', 'Linear Accelerator (LINAC)', 'Bone Marrow Transplant Unit', 'Cancer Counselling & Rehabilitation'],
    doctorsCount: 9,
    doctors: [
      { name: 'Dr. Vikram Malhotra', qualification: 'MD, DM (Medical Oncology)', exp: '17+ yrs', role: 'Director - Cancer Care' }
    ]
  },
  dermatology: {
    id: 'dermatology',
    title: 'Dermatology',
    icon: Zap,
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
    iconBg: 'bg-amber-500/10 text-amber-600',
    shortDesc: 'Expert skin, hair, and nail care with advanced aesthetic and medical treatments.',
    longDesc: 'Medisphere Dermatology offers a full spectrum of medical and cosmetic skin care services. Our board-certified dermatologists diagnose and treat all skin conditions — from acne and eczema to complex skin cancers — while also providing advanced aesthetic procedures to help you look and feel your best.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925409/medisphere/about/about-story-img.jpg',
    treatments: ['Acne & Eczema Treatment', 'Psoriasis & Vitiligo Management', 'Laser Skin Resurfacing', 'Hair Loss & PRP Therapy'],
    facilities: ['Advanced Laser Suite', 'Phototherapy Unit', 'Skin Biopsy Lab', 'Cosmetology & Aesthetic Clinic'],
    doctorsCount: 7,
    doctors: [
      { name: 'Dr. Neha Agarwal', qualification: 'MD (Dermatology, Venereology & Leprosy)', exp: '12+ yrs', role: 'Consultant Dermatologist' }
    ]
  }
};

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const timer = setTimeout(() => {
      if (id && departmentsData[id]) {
        setDepartment(departmentsData[id]);
      } else {
        setDepartment(null);
      }
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin"></div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-700 animate-pulse">Loading Department...</p>
      </div>
    );
  }

  if (!department) {
    return <Navigate to="/departments" replace />;
  }

  const Icon = department.icon;

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      
      {/* ========================================================
          1. HERO HEADER SECTION (Mobile-Friendly & Balanced)
          ======================================================== */}
      <section className="bg-slate-900 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 relative overflow-hidden text-white">
        {/* Soft Decorative Ambient Lights */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 sm:w-72 h-60 sm:h-72 bg-[var(--color-accent)]/15 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-[1300px] px-3 sm:px-6 relative z-10">
          
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-4 sm:mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
            <Link to="/departments" className="hover:text-white transition-colors">Departments</Link>
            <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
            <span className="text-emerald-400 font-semibold truncate">{department.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-3xl">
              {/* Department Badge & Icon */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-accent)]" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" /> Center of Clinical Excellence
                </span>
              </div>

              {/* Title & Short Description */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-2 sm:mb-3 leading-tight tracking-tight">
                {department.title} <span className="text-[var(--color-accent)] font-light italic">Department</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-light">
                {department.shortDesc}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-row sm:flex-col lg:flex-row gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <Link to={`/book-appointment?dept=${department.id}`} className="flex-1 sm:flex-initial">
                <Button className="w-full h-11 sm:h-12 px-4 sm:px-6 text-xs sm:text-sm rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white font-semibold shadow-lg transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                  <Calendar className="h-4 w-4 mr-1.5 shrink-0" />
                  Book Consult
                </Button>
              </Link>
              <a href="tel:1800123456" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full h-11 sm:h-12 px-4 sm:px-6 text-xs sm:text-sm rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold backdrop-blur-sm transition-all whitespace-nowrap">
                  <Phone className="h-3.5 w-3.5 mr-1.5 shrink-0 text-emerald-400" />
                  24/7 Helpline
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Key Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
              <span className="text-[11px] sm:text-xs font-medium">24/7 Emergency Care</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
              <span className="text-[11px] sm:text-xs font-medium">{department.doctorsCount}+ Certified Doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
              <span className="text-[11px] sm:text-xs font-medium">Advanced Modular Tech</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
              <span className="text-[11px] sm:text-xs font-medium">NABH & NABL Accredit</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. MAIN CONTENT AREA (Grid with Left Column & Right Sidebar)
          ======================================================== */}
      <section className="py-6 sm:py-12 relative z-20">
        <div className="container mx-auto max-w-[1300px] px-3 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* ----------------- LEFT MAIN CONTENT (Col 1 & 2) ----------------- */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              
              {/* Department High-Res Feature Banner Image */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 shadow-sm border border-[var(--color-border)] overflow-hidden">
                <div className="relative h-[200px] sm:h-[320px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100">
                  <img 
                    src={department.image} 
                    alt={department.title} 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 sm:p-6">
                    <span className="text-white text-xs sm:text-sm font-semibold tracking-wide drop-shadow-md">
                      Specialized Facilities & Advanced Care Units
                    </span>
                  </div>
                </div>
              </div>

              {/* Department Overview Details Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-9 shadow-xs border border-[var(--color-border)]">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="h-6 w-1 bg-[var(--color-primary)] rounded-full"></div>
                  <h2 className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-heading)]">
                    Clinical Overview
                  </h2>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-6 sm:mb-8">
                  {department.longDesc}
                </p>

                {/* Key Treatments & Specialized Facilities (Responsive 1-col on mobile, 2-col on tablet/desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  
                  {/* Treatments Block */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700/50">
                    <h3 className="text-sm sm:text-base font-bold text-[var(--color-heading)] mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-primary)] shrink-0" />
                      Key Treatments & Surgeries
                    </h3>
                    <ul className="space-y-2.5">
                      {department.treatments.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Facilities Block */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700/50">
                    <h3 className="text-sm sm:text-base font-bold text-[var(--color-heading)] mb-3 flex items-center gap-2">
                      <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-accent)] shrink-0" />
                      Specialized Infrastructure
                    </h3>
                    <ul className="space-y-2.5">
                      {department.facilities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Department Doctors Highlight Section (Mobile Responsive List/Grid) */}
              {department.doctors && department.doctors.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 shadow-xs border border-[var(--color-border)]">
                  <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-base sm:text-xl font-serif font-bold text-[var(--color-heading)]">
                        Leading Specialists
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        Senior consultants practicing in {department.title}
                      </p>
                    </div>
                    <Link to="/doctors">
                      <span className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                        All Doctors <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {department.doctors.map((doc, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/30 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
                              {doc.name.replace('Dr. ', '').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm text-[var(--color-heading)] truncate group-hover:text-emerald-700 transition-colors">
                                {doc.name}
                              </h4>
                              <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold truncate">
                                {doc.role}
                              </p>
                            </div>
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mb-2">
                            {doc.qualification} &bull; {doc.exp}
                          </p>
                        </div>
                        <Link to={`/book-appointment?doctor=${encodeURIComponent(doc.name)}`}>
                          <Button variant="outline" className="w-full h-8 text-[11px] font-semibold rounded-lg border-emerald-600/30 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors">
                            Book with Doctor
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ----------------- RIGHT SIDEBAR (Col 3) ----------------- */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Emergency / Need Assistance Banner */}
              <div className="bg-[var(--color-primary)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 text-white relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    24/7 Available
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold mb-1.5">
                    Need Immediate Assistance?
                  </h3>
                  <p className="text-white/80 mb-4 text-xs leading-relaxed font-light">
                    Our {department.title} care desk is ready 24 hours a day to guide you with emergency consults and immediate slot bookings.
                  </p>
                  
                  <a 
                    href="tel:1800123456" 
                    className="flex items-center gap-3 bg-white/15 hover:bg-white/25 p-3 rounded-xl transition-all border border-white/20 active:scale-98"
                  >
                    <div className="h-9 w-9 bg-white text-[var(--color-primary)] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Toll-Free Helpline</div>
                      <div className="text-base font-bold tracking-wide">1800-123-456</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick Specialist Appointment CTA Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[var(--color-border)] shadow-xs">
                <h3 className="text-sm sm:text-base font-bold text-[var(--color-heading)] mb-1">
                  Book Priority Consultation
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Schedule an in-person or telemedicine appointment with a verified {department.title.toLowerCase()} doctor.
                </p>
                <Link to={`/book-appointment?dept=${department.id}`}>
                  <Button className="w-full h-10 sm:h-11 text-xs sm:text-sm font-semibold rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-sm">
                    Book Appointment Now <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>

              {/* Other Departments Navigation (Responsive Grid on Mobile instead of huge vertical stack) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[var(--color-border)] shadow-xs">
                <h3 className="text-sm sm:text-base font-bold text-[var(--color-heading)] mb-3">
                  Explore Other Departments
                </h3>
                
                {/* Mobile: 2 columns grid / Desktop: clean list */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {Object.values(departmentsData).map((dept) => {
                    if (dept.id === department.id) return null;
                    const DeptIcon = dept.icon;
                    return (
                      <Link 
                        key={dept.id} 
                        to={`/departments/${dept.id}`} 
                        className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-700 hover:text-[var(--color-primary)] transition-all group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className={`p-1 rounded-lg ${dept.iconBg} shrink-0`}>
                            <DeptIcon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-xs truncate">{dept.title}</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all hidden lg:block shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
