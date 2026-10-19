import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { HeartPulse, Activity, Phone, ArrowRight, CheckCircle2, ChevronRight, Brain, Bone, Baby, Eye, Stethoscope, Microscope, Zap } from 'lucide-react';
import { Button } from '../../../components/Button';

// Mock database for department details
const departmentsData = {
  cardiology: {
    id: 'cardiology',
    title: 'Cardiology',
    icon: HeartPulse,
    shortDesc: 'Advanced heart care, angioplasty, and cardiac surgery by top specialists.',
    longDesc: 'Our Cardiology department offers comprehensive services for the diagnosis, treatment, and prevention of heart diseases. We are equipped with state-of-the-art technology, including modern Cath Labs, Echocardiography, and advanced ICU facilities to manage cardiac emergencies 24/7.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925410/medisphere/about/cardiology.jpg',
    treatments: ['Coronary Angiography & Angioplasty', 'Pacemaker Implantation', 'Heart Failure Management', 'Echocardiography (ECG, TMT, Holter)'],
    facilities: ['24/7 Cardiac Emergency', 'Advanced Cath Lab', 'Dedicated Cardiac ICU', 'Non-Invasive Cardiology Labs'],
    doctorsCount: 12
  },
  neurology: {
    id: 'neurology',
    title: 'Neurology',
    icon: Brain,
    shortDesc: 'Comprehensive treatment for brain, spinal cord, and nervous system disorders.',
    longDesc: 'The Neurology department at Medisphere provides expert care for complex neurological conditions. From stroke management to epilepsy and neuro-rehabilitation, our multidisciplinary team of neurologists, neurosurgeons, and therapists work together to ensure the best possible patient outcomes.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925429/medisphere/about/neurologist.jpg',
    treatments: ['Stroke Management & Thrombolysis', 'Epilepsy & Seizure Control', 'Parkinsons & Movement Disorders', 'Headache & Migraine Treatment'],
    facilities: ['Neuro ICU & Stroke Unit', 'Advanced MRI & CT Scans', 'EEG & EMG Labs', 'Neuro-Rehabilitation Center'],
    doctorsCount: 8
  },
  orthopedics: {
    id: 'orthopedics',
    title: 'Orthopedics',
    icon: Bone,
    shortDesc: 'Joint replacement, spine surgery, and sports medicine experts.',
    longDesc: 'Our Orthopedics department specializes in the diagnosis and treatment of bone, joint, and muscle disorders. We are pioneers in minimally invasive joint replacement surgeries and offer comprehensive sports medicine programs to help athletes return to their peak performance.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925432/medisphere/about/orthopedics.jpg',
    treatments: ['Total Knee & Hip Replacement', 'Arthroscopy & Sports Injuries', 'Spinal Surgery', 'Fracture & Trauma Care'],
    facilities: ['Modular Orthopedic OTs', 'Physiotherapy & Rehab Center', 'Bone Mineral Density Testing', '24/7 Trauma Care'],
    doctorsCount: 15
  },
  pediatrics: {
    id: 'pediatrics',
    title: 'Pediatrics',
    icon: Baby,
    shortDesc: 'Specialized healthcare for infants, children, and adolescents.',
    longDesc: 'Medisphere Pediatrics provides compassionate and expert medical care for children from birth to adolescence. Our child-friendly environment, coupled with a team of experienced pediatricians and neonatologists, ensures that your little ones receive the best possible care for their physical and emotional well-being.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925433/medisphere/about/pediatrics.jpg',
    treatments: ['Neonatal Intensive Care (NICU)', 'Pediatric Immunization', 'Childhood Asthma Management', 'Pediatric Surgery'],
    facilities: ['Level 3 NICU & PICU', 'Child-Friendly Wards', '24/7 Pediatric Emergency', 'Developmental Assessment Clinic'],
    doctorsCount: 10
  },
  ophthalmology: {
    id: 'ophthalmology',
    title: 'Ophthalmology',
    icon: Eye,
    shortDesc: 'Advanced eye care, LASIK, and cataract surgery.',
    longDesc: 'Our Ophthalmology department is dedicated to preserving and restoring vision. We offer a full spectrum of eye care services, from routine eye exams to advanced surgeries like LASIK and micro-incision cataract surgery, using the latest optical technology and lasers.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925409/medisphere/about/about-story-img.jpg',
    treatments: ['Phacoemulsification (Cataract)', 'LASIK Laser Vision Correction', 'Glaucoma Screening & Surgery', 'Diabetic Retinopathy Care'],
    facilities: ['Advanced Laser Suite', 'Optical Coherence Tomography (OCT)', 'Dedicated Eye OT', 'In-house Optical Store'],
    doctorsCount: 6
  },
  'general-medicine': {
    id: 'general-medicine',
    title: 'General Medicine',
    icon: Stethoscope,
    shortDesc: 'Primary care, diagnostics, and management of chronic conditions.',
    longDesc: 'The General Medicine department serves as the first point of contact for adult patients. Our expert physicians provide comprehensive diagnosis and non-surgical treatment for a wide range of acute and chronic illnesses, focusing on preventive care and holistic health management.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925413/medisphere/about/docters.jpg',
    treatments: ['Diabetes & Hypertension Management', 'Infectious Diseases', 'Thyroid Disorders', 'Adult Immunization & Health Checks'],
    facilities: ['Comprehensive Diagnostic Labs', '24/7 Fever Clinic', 'Preventive Health Check Lounge', 'Multidisciplinary Consultations'],
    doctorsCount: 20
  },
  oncology: {
    id: 'oncology',
    title: 'Oncology',
    icon: Microscope,
    shortDesc: 'Comprehensive cancer care with cutting-edge treatments and compassionate support.',
    longDesc: 'Our Oncology department provides holistic, multidisciplinary cancer care through a dedicated team of medical oncologists, surgical oncologists, and radiation specialists. From early-stage detection to advanced cancer management, we combine state-of-the-art therapies with a patient-first philosophy to deliver the best possible outcomes.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925430/medisphere/about/oncology.jpg',
    treatments: ['Chemotherapy & Targeted Therapy', 'Radiation Oncology', 'Surgical Oncology', 'Palliative & Supportive Care'],
    facilities: ['Dedicated Oncology Wards', 'Linear Accelerator (LINAC)', 'Bone Marrow Transplant Unit', 'Cancer Counselling & Rehabilitation'],
    doctorsCount: 9
  },
  dermatology: {
    id: 'dermatology',
    title: 'Dermatology',
    icon: Zap,
    shortDesc: 'Expert skin, hair, and nail care with advanced aesthetic and medical treatments.',
    longDesc: 'Medisphere Dermatology offers a full spectrum of medical and cosmetic skin care services. Our board-certified dermatologists diagnose and treat all skin conditions — from acne and eczema to complex skin cancers — while also providing advanced aesthetic procedures to help you look and feel your best.',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925409/medisphere/about/about-story-img.jpg',
    treatments: ['Acne & Eczema Treatment', 'Psoriasis & Vitiligo Management', 'Laser Skin Resurfacing', 'Hair Loss & PRP Therapy'],
    facilities: ['Advanced Laser Suite', 'Phototherapy Unit', 'Skin Biopsy Lab', 'Cosmetology & Aesthetic Clinic'],
    doctorsCount: 7
  }
};

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call
    window.scrollTo(0, 0);
    setLoading(true);
    const timer = setTimeout(() => {
      if (id && departmentsData[id]) {
        setDepartment(departmentsData[id]);
      } else {
        setDepartment(null);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!department) {
    return <Navigate to="/departments" replace />;
  }

  const Icon = department.icon;

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      
      {/* Breadcrumb & Header Section (Full height on mobile) */}
      <section className="bg-slate-900 min-h-[100dvh] sm:min-h-0 pt-16 pb-20 flex items-center relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto max-w-[1300px] px-4 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mt-4">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/departments" className="hover:text-white transition-colors">Departments</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{department.title}</span>
            </div>
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-5 sm:mb-6">
              <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-slate-200 mb-3 sm:mb-4 drop-shadow-md">{department.title} Department</h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">{department.shortDesc}</p>
          </div>
          <div className="w-full md:w-auto">
            <Link to="/book-appointment" className="w-full block md:inline-block">
              <Button className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-all w-full md:w-auto">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 sm:py-16 -mt-6 sm:-mt-10 relative z-20">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Left Col - Overview & Image */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-10">
              <div className="bg-white rounded-3xl p-2 shadow-sm border border-[var(--color-border)] overflow-hidden">
                <img src={department.image} alt={department.title} loading="lazy" decoding="async" className="w-full h-[220px] sm:h-[320px] md:h-[400px] object-cover rounded-2xl" />
              </div>

              <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm border border-[var(--color-border)]">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-heading)] mb-4">Department Overview</h2>
                <div className="w-12 h-1 bg-[var(--color-primary)] rounded-full mb-6"></div>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                  {department.longDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-heading)] mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-[var(--color-primary)]" />
                      Key Treatments
                    </h3>
                    <ul className="space-y-3">
                      {department.treatments.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-slate-600 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-heading)] mb-4 flex items-center gap-2">
                      <HeartPulse className="h-5 w-5 text-[var(--color-primary)]" />
                      Specialized Facilities
                    </h3>
                    <ul className="space-y-3">
                      {department.facilities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-slate-600 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col - Sidebar */}
            <div className="space-y-6">
              <div className="bg-[var(--color-primary)] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
                <h3 className="text-xl font-serif font-bold mb-4 relative z-10">Need Assistance?</h3>
                <p className="text-white/80 mb-6 text-sm relative z-10">Our department coordinators are available 24/7 to help you with appointments and queries.</p>
                <a href="tel:1800123456" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors relative z-10 border border-white/20">
                  <div className="h-10 w-10 bg-white text-[var(--color-primary)] rounded-full flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Emergency Helpline</div>
                    <div className="text-lg font-bold">1800-123-456</div>
                  </div>
                </a>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-sm">
                <h3 className="text-lg font-bold text-[var(--color-heading)] mb-2">Our Specialists</h3>
                <p className="text-sm text-slate-500 mb-6">Meet our team of {department.doctorsCount}+ highly experienced {department.title.toLowerCase()} specialists.</p>
                
                <Link to="/doctors">
                  <Button variant="outline" className="w-full justify-between rounded-xl h-12 hover:bg-slate-50 text-[var(--color-primary)] border-[var(--color-primary)]/30">
                    View All Doctors <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Quick Navigation */}
              <div className="bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-sm">
                <h3 className="text-lg font-bold text-[var(--color-heading)] mb-4">Other Departments</h3>
                <div className="space-y-2">
                  {Object.values(departmentsData).map((dept) => (
                    dept.id !== department.id && (
                      <Link key={dept.id} to={`/departments/${dept.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-[var(--color-primary)] transition-colors group">
                        <span className="font-medium text-sm">{dept.title}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
