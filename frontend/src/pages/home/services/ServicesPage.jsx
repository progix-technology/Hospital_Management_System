import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, FlaskConical, Scissors, Pill, Truck,
  ChevronDown, CheckCircle, Activity
} from 'lucide-react';
import { Button } from '../../../components/Button';

const services = [
  {
    id: 'emergency',
    title: 'Emergency Care',
    subtitle: '24/7 Critical Emergency Response',
    icon: Phone,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    badge: '24/7 Available',
    badgeBg: 'bg-red-100 text-red-600',
    dotBg: 'bg-red-500',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925417/medisphere/about/emergency.jpg',
    shortDesc: 'Immediate, life-saving medical attention by a dedicated team of emergency specialists, round the clock, every day of the year.',
    overview: `Medisphere's Emergency & Trauma Center is one of the most advanced Level-I Trauma Care units in the region. Operational 24 hours a day, 7 days a week, 365 days a year — our Emergency Department (ED) is designed to handle every medical crisis from minor injuries to life-threatening emergencies with unparalleled speed and precision.\n\nOur dedicated emergency team — comprising emergency medicine physicians, trauma surgeons, intensivists, and trained nursing staff — works in perfect coordination to deliver life-saving care within the critical "golden hour." Every second counts, and we make each one matter.`,
    highlights: [
      'Zero wait time for critical and life-threatening cases',
      'Dedicated Resuscitation Bay with advanced airway and cardiac support',
      'On-call surgical teams available for emergency operations at all times',
      'Rapid Stroke Response team for immediate thrombolysis or thrombectomy',
      'Advanced Cardiac Life Support (ACLS) and Pediatric Advanced Life Support (PALS)',
      'Direct ED-to-ICU admission pathway for seamless critical care transfer',
      'On-site blood bank for immediate transfusions',
      '24/7 radiology including portable X-Ray and emergency CT/MRI scans'
    ],
    conditions: [
      'Heart Attacks (Myocardial Infarction)',
      'Strokes & Neurological Emergencies',
      'Severe Road Traffic Accidents & Polytrauma',
      'Respiratory Distress & Breathing Emergencies',
      'Severe Burns & Crush Injuries',
      'Pediatric Emergencies & Seizures',
      'Diabetic Ketoacidosis & Metabolic Crises',
      'Poisoning & Overdose Management'
    ],
    stats: [{ label: 'Avg Response Time', value: '<4 min' }, { label: 'Beds', value: '30+' }, { label: 'Specialists', value: '50+' }]
  },
  {
    id: 'diagnostic',
    title: 'Diagnostic Services',
    subtitle: 'High-Precision Imaging & Diagnostic Workup',
    icon: Activity,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    badge: 'AI-Enhanced',
    badgeBg: 'bg-indigo-100 text-indigo-600',
    dotBg: 'bg-indigo-500',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925429/medisphere/about/neurologist.jpg',
    shortDesc: 'Cutting-edge imaging technology including 3T MRI, 256-slice CT, and AI-powered diagnostic workstations for unparalleled accuracy.',
    overview: `At Medisphere, we believe an accurate diagnosis is the cornerstone of effective treatment. Our Department of Radiology & Imaging Sciences is equipped with some of the most advanced diagnostic technology available in modern medicine today.\n\nFrom the earliest signs of disease to complex multi-system trauma, our imaging suite provides the highest-resolution scans with the lowest possible radiation exposure. Our board-certified radiologists, supported by AI-assisted detection software, deliver rapid, precise diagnostic reports — often within hours — enabling your doctor to start the right treatment without delay.`,
    highlights: [
      '3 Tesla MRI for high-resolution brain, spine, and soft tissue imaging',
      '256-slice CT Scanner for ultra-fast whole-body scans',
      'Digital X-Ray with PACS (Picture Archiving & Communication System)',
      '4D Ultrasound for obstetric and vascular imaging',
      'Bone Mineral Density (DEXA Scan) for osteoporosis assessment',
      'PET-CT Scan for oncology staging and metabolic imaging',
      'AI-powered Computer-Aided Detection (CAD) for early cancer screening',
      'Teleradiology for immediate specialist reporting from any location'
    ],
    conditions: [
      'Brain Tumours, Strokes & Neurological Disorders',
      'Cardiac Imaging (Echo, Stress Tests, CT Angiography)',
      'Lung & Chest Diseases (HRCT for COVID, TB, Fibrosis)',
      'Abdominal & Pelvic Organ Assessment',
      'Musculoskeletal & Orthopaedic Disorders',
      'Obstetric & Gynaecological Imaging',
      'Vascular Doppler Studies',
      'Cancer Staging & Treatment Response Monitoring'
    ],
    stats: [{ label: 'Reports/Day', value: '1000+' }, { label: 'Accuracy Rate', value: '99.2%' }, { label: 'Modalities', value: '12+' }]
  },
  {
    id: 'laboratory',
    title: 'Laboratory Services',
    subtitle: 'Fully Automated Pathology & Clinical Lab',
    icon: FlaskConical,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    badge: 'NABL Accredited',
    badgeBg: 'bg-teal-100 text-teal-600',
    dotBg: 'bg-teal-500',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925410/medisphere/about/cardiology.jpg',
    shortDesc: 'NABL-accredited clinical laboratory with fully automated testing for haematology, biochemistry, microbiology, and molecular diagnostics.',
    overview: `Medisphere's Central Clinical Laboratory is accredited by the National Accreditation Board for Testing & Calibration Laboratories (NABL) and adheres to the highest international standards of quality and accuracy. Our state-of-the-art, fully automated laboratory processes thousands of tests daily with precision that healthcare professionals and patients can trust.\n\nEquipped with cutting-edge analyzers and staffed by experienced pathologists, microbiologists, and laboratory technicians, our lab delivers results rapidly — supporting both routine wellness check-ups and urgent clinical decision-making. A dedicated 24/7 emergency lab ensures that critical tests are never delayed, even in the middle of the night.`,
    highlights: [
      'Fully automated Haematology analyzers with 5-part differential counts',
      'High-throughput Biochemistry analyzers for comprehensive metabolic panels',
      'Advanced Microbiology with automated blood culture and sensitivity testing',
      'Molecular Diagnostics: PCR, RT-PCR for infectious diseases & genetics',
      'Immunology & Serology for autoimmune, hormonal, and allergy testing',
      'Histopathology & Cytology with expert pathologist reporting',
      'Flow Cytometry for haematological malignancy diagnosis',
      'Home blood sample collection service available 7 days a week'
    ],
    conditions: [
      'Complete Blood Count (CBC) & Anaemia Workup',
      'Diabetes Monitoring (HbA1c, Fasting/PP Glucose)',
      'Liver & Kidney Function Tests',
      'Thyroid Profile (TSH, T3, T4)',
      'Cardiac Biomarkers (Troponin, BNP, D-Dimer)',
      'Cancer Markers (PSA, CA-125, AFP, CEA)',
      'Infectious Diseases (HIV, Hepatitis B & C, Dengue, Malaria)',
      'Genetic & Molecular Testing (PCR, Next-Gen Sequencing)'
    ],
    stats: [{ label: 'Tests/Day', value: '5000+' }, { label: 'Parameters', value: '800+' }, { label: 'TAT Routine', value: '<6 hrs' }]
  },
  {
    id: 'surgical',
    title: 'Surgical Services',
    subtitle: 'Minimally Invasive & Robotic Surgery',
    icon: Scissors,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    badge: 'Robotic Assisted',
    badgeBg: 'bg-purple-100 text-purple-600',
    dotBg: 'bg-purple-500',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925432/medisphere/about/orthopedics.jpg',
    shortDesc: 'World-class surgical suites with robotic-assisted surgery, HEPA-filtered modular OTs, and expert surgical teams across all specialties.',
    overview: `Medisphere's Surgical Sciences Division is home to some of the finest surgeons in the country, equipped with the very best technology. Our Modular Operation Theatres (OTs) feature HEPA filtration, laminar airflow, and full-HD surgical visualization systems, creating an ultra-sterile environment that dramatically reduces post-operative infection rates.\n\nWe offer a comprehensive range of surgical procedures — from day-care laparoscopic operations to complex multi-organ surgeries — performed with a commitment to precision, safety, and faster recovery. Our robotic surgery programme allows surgeons to perform intricate procedures through tiny incisions, resulting in minimal blood loss, less pain, and significantly shorter hospital stays.`,
    highlights: [
      'Da Vinci Robotic Surgical System for precise minimally invasive procedures',
      '10 Modular OTs with HEPA filtration and laminar airflow technology',
      'Full 4K 3D Laparoscopic systems for endoscopic surgery',
      'Dedicated Cardiac Surgery suite with bypass machine standby',
      'Neurosurgical suite with intraoperative neurophysiological monitoring',
      'C-Arm & O-Arm Imaging in OT for real-time orthopaedic navigation',
      'Post-Anaesthesia Care Unit (PACU) for safe recovery monitoring',
      'Specialised Day Surgery Centre for short-stay surgical procedures'
    ],
    conditions: [
      'Laparoscopic Cholecystectomy, Appendectomy & Hernia Repair',
      'Total Knee & Hip Replacement Surgery',
      'Coronary Artery Bypass Grafting (CABG)',
      'Neurosurgery: Tumour Resection, Spinal Surgeries',
      'Bariatric & Metabolic Surgery',
      'Urological Surgeries (RIRS, PCNL, Prostatectomy)',
      'Gynaecological & Obstetric Surgeries',
      'Oncological Resection Surgeries'
    ],
    stats: [{ label: 'Surgeries/Year', value: '15,000+' }, { label: 'Specialties', value: '20+' }, { label: 'Success Rate', value: '98.5%' }]
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    subtitle: '24/7 In-Hospital & Retail Pharmacy',
    icon: Pill,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
    badge: 'ISO Certified',
    badgeBg: 'bg-green-100 text-green-700',
    dotBg: 'bg-green-600',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925433/medisphere/about/pediatrics.jpg',
    shortDesc: 'ISO-certified pharmacy stocking over 15,000 medicines, including rare medications, with expert pharmacist counselling and home delivery.',
    overview: `The Medisphere Pharmacy is far more than a medicine dispensary — it is an integrated medication management service designed to support every patient through their healthcare journey. Staffed by qualified clinical pharmacists, our pharmacy ensures that every prescription is dispensed accurately, safely, and with comprehensive patient counselling.\n\nWe operate 24 hours a day, ensuring that both inpatients and outpatients can access critical medications at any hour. Our specialty pharmacy section stocks a wide range of biologicals, oncology drugs, rare-disease medications, and temperature-sensitive vaccines that are often unavailable at regular pharmacies.`,
    highlights: [
      'Stock of over 15,000 drug formulations including generic and branded medicines',
      'Specialty pharmacy for oncology, immunology, and rare-disease biologicals',
      'Temperature-controlled storage for vaccines and biological medicines',
      'Clinical pharmacist review for drug-drug interactions and dosing accuracy',
      'Automated dispensing cabinets on all wards for fast inpatient access',
      'Compounding pharmacy for customised paediatric and geriatric formulations',
      'Home delivery of medicines for discharged and chronic care patients',
      'Smart medication adherence counselling for diabetic and hypertensive patients'
    ],
    conditions: [
      'Prescription Medicines — Acute & Chronic Conditions',
      'Oncology & Chemotherapy Drug Dispensing',
      'Biologicals & Immunosuppressants',
      'Anti-Infective & Antibiotic Therapy',
      'Controlled Substances & Pain Management',
      'Paediatric & Neonatal Medication Compounding',
      'Vaccine & Immunisation Supplies',
      'Over-the-Counter (OTC) & Wellness Products'
    ],
    stats: [{ label: 'Medicines Stocked', value: '15,000+' }, { label: 'Prescriptions/Day', value: '2,000+' }, { label: 'Open', value: '24/7' }]
  },
  {
    id: 'ambulance',
    title: 'Ambulance Services',
    subtitle: 'Advanced Life Support Mobile Emergency Units',
    icon: Truck,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    badge: 'GPS Tracked',
    badgeBg: 'bg-amber-100 text-amber-700',
    dotBg: 'bg-amber-600',
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925418/medisphere/about/emergencycare.jpg',
    shortDesc: 'GPS-tracked fleet of Advanced Life Support (ALS) and Basic Life Support (BLS) ambulances with trained paramedics and real-time hospital coordination.',
    overview: `Medisphere's Ambulance Services represent the first critical link in the chain of emergency survival. Our fleet of modern, fully equipped ambulances brings the hospital to the patient — deploying trained paramedics and emergency medical technicians (EMTs) who begin life-saving treatment from the moment they arrive at the scene.\n\nEvery ambulance is GPS-tracked and coordinated through our central dispatch centre, ensuring the nearest available unit reaches you in the shortest possible time. Real-time communication between the ambulance team and the receiving Emergency Department ensures that the hospital is fully prepared by the time you arrive.`,
    highlights: [
      'Fleet of ALS ambulances equipped with cardiac monitors, defibrillators & ventilators',
      'Neonatal Transport Ambulance with incubator and neonatal life support',
      'GPS tracking with real-time fleet management and dispatch optimisation',
      'Direct radio communication with the hospital Emergency Department',
      '12-lead ECG transmission from ambulance to cardiologist en-route',
      'Air ambulance coordination for inter-city critical patient transfers',
      'Trained paramedics capable of advanced airway management and IV therapy',
      'Patient transport service for non-emergency inter-hospital transfers'
    ],
    conditions: [
      'Cardiac Arrest & Chest Pain Emergencies',
      'Stroke & Neurological Emergencies',
      'Severe Road Traffic Accidents & Trauma',
      'Obstetric Emergencies & High-Risk Deliveries',
      'Neonatal Transport & NICU Admissions',
      'Respiratory Distress & Asthma Attacks',
      'Post-Operative & ICU Patient Transfers',
      'Disaster & Mass Casualty Incident Response'
    ],
    stats: [{ label: 'Ambulances', value: '25+' }, { label: 'Avg Dispatch', value: '<8 min' }, { label: 'Coverage Radius', value: '80 km' }]
  }
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero (Full height on mobile) */}
      <section className="relative w-full min-h-[100dvh] sm:min-h-[440px] lg:h-[500px] py-14 sm:py-20 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785925417/medisphere/about/emergency.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-slate-900/20"></div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 sm:mb-5 backdrop-blur-sm">
              Our Services
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-5 leading-tight">
              Complete Medical Services<br />
              <span className="text-[var(--color-accent)]">Under One Roof</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              From emergency trauma care to routine diagnostics, Medisphere delivers world-class medical services 24 hours a day, every single day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Navigator Tabs (2 in 1 line on mobile, perfectly fit in 1 row on web view) */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5 sm:gap-2 lg:gap-2.5 py-2 sm:py-3 max-w-6xl mx-auto">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveService(s.id);
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center justify-center gap-1.5 px-2 lg:px-3 py-2 rounded-lg lg:rounded-full text-xs lg:text-[13px] font-semibold transition-all border cursor-pointer active:scale-95 ${
                    activeService === s.id
                      ? 'bg-[var(--color-primary)] text-white shadow-xs border-[var(--color-primary)]'
                      : 'text-slate-600 hover:bg-slate-50 border-slate-200 bg-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services List (Mobile-Optimized & Compact) */}
      <section className="py-6 sm:py-16 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4 space-y-4 sm:space-y-10">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isExpanded = expandedId === service.id;
            return (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`bg-white rounded-2xl sm:rounded-3xl shadow-xs border ${service.border} overflow-hidden`}
              >
                {/* Card */}
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Image */}
                  <div className="lg:col-span-2 h-40 sm:h-56 lg:h-auto relative overflow-hidden">
                    <img src={service.image} alt={service.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-3 p-3.5 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-2.5 sm:gap-4 mb-2.5 sm:mb-4">
                        <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${service.bg} shrink-0`}>
                          <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${service.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`text-[8.5px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${service.badgeBg}`}>
                            {service.badge}
                          </span>
                          <h2 className="text-base sm:text-2xl font-bold text-slate-900 mt-1 sm:mt-2 truncate">{service.title}</h2>
                          <p className={`text-xs sm:text-sm font-semibold ${service.color} mt-0.5 truncate`}>{service.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-none">{service.shortDesc}</p>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-3 sm:mb-5">
                        {service.stats.map((stat, i) => (
                          <div key={i} className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl ${service.bg} text-center`}>
                            <div className={`text-sm sm:text-lg font-black ${service.color}`}>{stat.value}</div>
                            <div className="text-[8px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5 truncate">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1">
                      <Link 
                        to={`/services/${service.id === 'diagnostic' ? 'diagnostic-services' : service.id === 'laboratory' ? 'laboratory-services' : service.id === 'surgical' ? 'surgical-services' : service.id === 'ambulance' ? 'ambulance-services' : service.id}`}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#0f6c4f] hover:bg-emerald-800 text-white text-[10px] sm:text-xs font-bold shadow-xs transition-all"
                      >
                        Dedicated Page <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </Link>
                      <button
                        onClick={() => toggleExpand(service.id)}
                        className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold ${service.color} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        {isExpanded ? 'Collapse' : 'Preview'}
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-100 bg-slate-50/60 p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Overview */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Overview</h4>
                            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
                              {service.overview.split('\n\n').map((para, i) => (
                                <p key={i}>{para}</p>
                              ))}
                            </div>
                          </div>

                          {/* Highlights */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Key Features</h4>
                            <ul className="space-y-2.5">
                              {service.highlights.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                  <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${service.color}`} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Conditions */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Conditions Treated / Services Offered</h4>
                            <ul className="space-y-2.5">
                              {service.conditions.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${service.dotBg}`}></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <Link to="/book-appointment" className="mt-6 inline-block">
                              <Button className="rounded-xl text-white text-sm bg-[var(--color-primary)] hover:opacity-90 transition-opacity">
                                Book This Service <ArrowRight className="ml-2 h-4 w-4 inline" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbp97xecb/image/upload/v1785928188/Editorial_illustration_cvrrm9.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-slate-900/75"></div>
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-5xl font-serif italic font-light text-slate-200 mb-4 drop-shadow-lg">
              Need a Service or Consultation?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Our patient care coordinators are available 24/7 to guide you to the right service, book an appointment, or answer any medical query.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book-appointment">
                <Button className="h-14 px-8 text-base rounded-full bg-[var(--color-primary)] text-white shadow-xl hover:opacity-90 transition-all">
                  Book an Appointment
                </Button>
              </Link>
              <a href="tel:1800123456">
                <Button className="h-14 px-8 text-base rounded-full bg-white text-slate-900 shadow-xl hover:bg-slate-100 transition-all">
                  <Phone className="mr-2 h-5 w-5 inline" /> Call: 1800-123-456
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
