import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, Microscope, Scissors, Pill, Truck, Phone, ArrowRight, 
  CheckCircle2, ChevronRight, Clock, ShieldCheck, FileText, Calendar,
  Sparkles, Award, HelpCircle, MapPin, Search, AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/Button';

// Database for the 5 Dedicated Hospital & Technician Services
const servicesData = {
  // 1. Diagnostic Services
  'diagnostic-services': {
    id: 'diagnostic-services',
    aliases: ['diagnostic', 'diagnostics'],
    title: 'Diagnostic Services',
    subtitle: 'High-Precision Imaging & Clinical Diagnostics',
    tagline: 'State-of-the-art diagnostic technology for accurate, early disease detection.',
    icon: Activity,
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925419/medisphere/about/healthcheckups.jpg',
    category: 'Imaging & Diagnostics',
    highlightBadge: 'Advanced 3T MRI & 128-Slice CT',
    stats: [
      { label: 'Diagnostic Modalities', value: '15+' },
      { label: 'Accuracy Rate', value: '99.8%' },
      { label: 'Certified Radiologists', value: '12' },
      { label: 'Report Delivery', value: '< 2 Hours' }
    ],
    overview: 'Our Diagnostic Services Department combines cutting-edge radiological imaging and diagnostic equipment with experienced radiologists and certified diagnostic technicians. We provide rapid, non-invasive imaging solutions ensuring timely clinical interventions for cardiac, neurological, orthopedic, and oncology care.',
    technicianServices: [
      { name: '3.0 Tesla MRI Scan (Brain, Spine, Joints)', time: '30-45 mins', prep: 'Remove metallic items' },
      { name: '128-Slice Low-Dose CT Scan (Whole Body)', time: '10-15 mins', prep: 'Fasting for contrast' },
      { name: 'Digital X-Ray & Fluoroscopy', time: '10 mins', prep: 'No prior prep needed' },
      { name: 'Color Doppler & 4D Ultrasound', time: '20 mins', prep: 'Full bladder required' },
      { name: '12-Lead Digital ECG & Stress TMT', time: '15 mins', prep: 'Comfortable footwear' },
      { name: '2D & 3D Echocardiography', time: '20 mins', prep: 'Normal routine' },
      { name: 'DEXA Bone Mineral Density Scan', time: '15 mins', prep: 'Avoid calcium 24h prior' },
      { name: 'EEG & Nerve Conduction Studies (NCV)', time: '40 mins', prep: 'Clean, dry hair' }
    ],
    equipment: [
      'Siemens Magnetom 3T MRI Scanner',
      'GE Revolution 128-Slice Dual-Energy CT',
      'Philips Digital Diagnost X-Ray Suite',
      'GE Voluson 4D High-Resolution Ultrasound',
      'Schiller Stress Testing & Holter Recorders'
    ],
    faqs: [
      { q: 'How quickly can I get my diagnostic reports?', a: 'Routine X-rays and ultrasounds are provided within 1 hour. CT scans and MRI reports with radiologist analysis are published to your Patient Portal within 2 to 4 hours.' },
      { q: 'Do I need a doctor prescription for imaging scans?', a: 'Yes, specialized scans (CT, MRI, X-ray with contrast) require a doctor prescription to ensure correct clinical focus.' }
    ]
  },

  // 2. Laboratory Services
  'laboratory-services': {
    id: 'laboratory-services',
    aliases: ['laboratory', 'lab', 'labs'],
    title: 'Laboratory Services',
    subtitle: 'NABL Accredited 24/7 Automated Pathology',
    tagline: 'Comprehensive biochemical, hematological, and microbiological laboratory diagnostics.',
    icon: Microscope,
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925429/medisphere/about/neurologist.jpg',
    category: 'Pathology & Testing',
    highlightBadge: 'NABL Accredited • Barcode Tracked',
    stats: [
      { label: 'Daily Lab Tests', value: '2,500+' },
      { label: 'Test Menu', value: '450+ Tests' },
      { label: 'Automated Analyzers', value: '100%' },
      { label: 'Digital Reports', value: 'Instant SMS/Portal' }
    ],
    overview: 'The Central Clinical Laboratory at Medisphere operates 24/7 under strict ISO/NABL quality guidelines. Led by consultant pathologists and senior lab technicians, our robotic automated analyzers deliver precise results for blood work, hormone markers, histology biopsies, and infection screening with full barcode chain-of-custody tracking.',
    technicianServices: [
      { name: 'Complete Blood Count (CBC with ESR)', time: '30 mins', prep: 'No fasting required' },
      { name: 'Comprehensive Lipid Profile (Cholesterol)', time: '1 hour', prep: '10-12 hrs fasting' },
      { name: 'Liver Function Test (LFT) & Bilirubin', time: '1 hour', prep: 'Fasting preferred' },
      { name: 'Kidney Function Test (KFT / RFT with Electrolytes)', time: '1 hour', prep: 'Normal routine' },
      { name: 'Glycated Hemoglobin (HbA1c Diabetes)', time: '45 mins', prep: 'No fasting required' },
      { name: 'Thyroid Function Test (T3, T4, TSH Ultra)', time: '1 hour', prep: 'Morning sample ideal' },
      { name: 'Vitamin D3 & Vitamin B12 Screening', time: '2 hours', prep: 'Fasting optional' },
      { name: 'Urine Routine & Culture Sensitivity', time: '24-48 hrs for culture', prep: 'Midstream clean catch' }
    ],
    equipment: [
      'Roche Cobas 8000 Automated Chemistry Analyzer',
      'Sysmex XN-1000 High-Throughput Hematology Analyzer',
      'Bio-Rad D-10 Dual Program HPLC (HbA1c)',
      'Abbott Architect i2000SR Immunoassay System',
      'BD Phoenix Automated Microbiology Identification'
    ],
    faqs: [
      { q: 'Can I get lab samples collected from my home?', a: 'Yes! Our certified phlebotomists offer door-step sample collection across Lucknow with temperature-controlled transport bags.' },
      { q: 'How do I download my lab reports online?', a: 'Your reports are automatically uploaded directly to your Patient Portal under "Medical Records" and sent to your registered mobile number via SMS and WhatsApp.' }
    ]
  },

  // 3. Surgical Services
  'surgical-services': {
    id: 'surgical-services',
    aliases: ['surgical', 'surgery'],
    title: 'Surgical Services',
    subtitle: 'Modular OTs & Minimally Invasive Excellence',
    tagline: 'World-class surgical suites equipped for complex, laparoscopic, and day-care surgeries.',
    icon: Scissors,
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925430/medisphere/about/oncology.jpg',
    category: 'Operative & Surgical',
    highlightBadge: 'Laminar Airflow Class 100 OTs',
    stats: [
      { label: 'Modular OTs', value: '8 Suites' },
      { label: 'Annual Surgeries', value: '4,800+' },
      { label: 'Infection Rate', value: '< 0.01%' },
      { label: 'Post-Op Care', value: '24/7 Surgical ICU' }
    ],
    overview: 'Our Department of Surgical Services features ultra-sterile, HEPA-filtered Modular Operation Theatres with integrated laparoscopic video towers and HD imaging. Our expert surgeons, specialized anesthesiologists, and scrub technicians deliver superior precision for general, laparoscopic, cardiac, orthopedic, and day-care surgical procedures.',
    technicianServices: [
      { name: 'Advanced Laparoscopic & Gallbladder Surgery', time: 'Day-Care / 24h', prep: 'Pre-op anesthesiology clearance' },
      { name: 'Total Knee & Hip Joint Replacement', time: '2-3 Days Stay', prep: 'Pre-admission orthopedic workup' },
      { name: 'Hernia Repair (Laparoscopic Mesh Plasty)', time: 'Day-Care', prep: 'Fasting 6 hours prior' },
      { name: 'Appendectomy (Minimally Invasive)', time: '24h Stay', prep: 'Immediate clinical evaluation' },
      { name: 'Endoscopic Urology & Kidney Stone Laser Surgery', time: 'Day-Care / 24h', prep: 'Pre-op renal profile' },
      { name: 'Trauma & Emergency Exploratory Laparotomy', time: 'Emergency 24/7', prep: 'Critical trauma protocol' },
      { name: 'Surgical Oncology & Tumor Resection', time: 'Multi-day care', prep: 'Oncology board staging' }
    ],
    equipment: [
      'Karl Storz 4K Ultra-HD Laparoscopy Towers',
      'Dräger Perseus A500 Anesthesia Workstations',
      'Stryker System 8 Orthopedic Power Tools',
      'ValleyLab Force FX Electrosurgical Generators',
      'Maquet AlphaStar Hydraulic OT Tables with C-Arm'
    ],
    faqs: [
      { q: 'What is day-care surgery?', a: 'Day-care surgeries are advanced minimally invasive procedures where patients are admitted, operated upon, and safely discharged on the same day within 6 to 8 hours.' },
      { q: 'How is OT sterility maintained?', a: 'Our theatres use Class 100 Laminar Airflow with 0.3-micron HEPA filtration, positive pressure airlocks, and UV sterilization between every procedure.' }
    ]
  },

  // 4. Pharmacy Services
  'pharmacy': {
    id: 'pharmacy',
    aliases: ['pharmacy-services', 'chemist', 'medicine'],
    title: 'Pharmacy',
    subtitle: '24/7 Hospital & Outpatient In-House Pharmacy',
    tagline: '100% genuine medications, temperature-controlled cold chain, and doorstep delivery.',
    icon: Pill,
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925413/medisphere/about/docters.jpg',
    category: 'Pharmaceutical Care',
    highlightBadge: '24/7 Open • Cold Chain Verified',
    stats: [
      { label: 'Prescription Drugs', value: '10,000+' },
      { label: 'Operating Hours', value: '24/7 Open' },
      { label: 'Registered Pharmacists', value: '14' },
      { label: 'Cold-Chain Security', value: '100% Realtime' }
    ],
    overview: 'Medisphere Central Pharmacy provides round-the-clock dispensing of verified, high-grade pharmaceuticals, vaccines, surgical consumables, and critical life-saving drugs. Staffed by registered clinical pharmacists, we ensure thorough drug interaction screening, proper patient counseling, and temperature-controlled storage.',
    technicianServices: [
      { name: '24/7 Inpatient & Outpatient Dispensing', time: 'Immediate', prep: 'Doctor prescription required' },
      { name: 'Cold-Chain Insulin & Vaccine Storage (2°C - 8°C)', time: 'Immediate', prep: 'Insulated ice packs provided' },
      { name: 'Life-Saving Emergency Drugs & IV Fluids', time: 'Immediate 24/7', prep: 'Hospital ICU supplies' },
      { name: 'Chronic Disease Medication Refill Packs', time: 'Monthly Delivery', prep: 'Digital prescription sync' },
      { name: 'Surgical & Orthopedic Consumables', time: 'Immediate', prep: 'OT support' },
      { name: 'Pharmacist Drug Consultation & Usage Advice', time: '1-on-1 Guidance', prep: 'Free with dispensing' }
    ],
    equipment: [
      'Automated Barcode Prescription Scanning System',
      'Blue Star Medical Grade Digital Cold Refrigeration',
      'HEPA Filtered Compounding Cleanroom Unit',
      'Electronic Inventory Tracking with Expiry Sentinel',
      'Insulated Thermal Delivery Containers'
    ],
    faqs: [
      { q: 'Can I order medicine delivery directly from my prescription?', a: 'Yes! Simply upload your doctor prescription in the Patient Portal, and our pharmacy team will pack and deliver your order to your address.' },
      { q: 'Are your medicines authentic and quality assured?', a: 'We source 100% directly from certified pharmaceutical manufacturers and adhere to strict batch serialization and cold chain monitoring.' }
    ]
  },

  // 5. Ambulance Services
  'ambulance-services': {
    id: 'ambulance-services',
    aliases: ['ambulance', 'emergency-ambulance'],
    title: 'Ambulance Services',
    subtitle: '24/7 Advanced Life Support (ALS) & Mobile ICU',
    tagline: 'Rapid emergency medical transport with ICU ventilators and certified paramedics.',
    icon: Truck,
    image: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925418/medisphere/about/emergencycare.jpg',
    category: 'Emergency Transport',
    highlightBadge: 'Avg Response < 15 Mins • 24/7 Live GPS',
    stats: [
      { label: 'Fleet Size', value: '18 Ambulances' },
      { label: 'Avg Response Time', value: '< 15 Mins' },
      { label: 'Emergency Hotline', value: '24/7 Dedicated' },
      { label: 'Paramedic Coverage', value: '100% Certified' }
    ],
    overview: 'Medisphere Emergency Ambulance Fleet provides hospital-grade critical care transport across the city. Equipped with mobile ICU ventilators, defibrillators, oxygen manifolds, and satellite GPS dispatch, our trained Emergency Medical Technicians (EMTs) begin patient stabilization right from the point of pickup.',
    technicianServices: [
      { name: 'Advanced Life Support (ALS) Mobile ICU Unit', time: 'Immediate Dispatch', prep: 'Equipped with Ventilator & Defibrillator' },
      { name: 'Basic Life Support (BLS) Patient Transport', time: 'Immediate Dispatch', prep: 'Oxygen support & stretcher' },
      { name: 'Neonatal / Pediatric ICU Ambulance (NICU on Wheels)', time: 'Specialist Dispatch', prep: 'Transport incubator & neonatal ventilator' },
      { name: 'Inter-Hospital Critical Transfer Service', time: 'Scheduled / Urgent', prep: 'Full medical escort team' },
      { name: 'Cardiac Emergency Transport with Tele-ECG', time: 'Priority 1', prep: 'Live ECG transmission to hospital Cath Lab' }
    ],
    equipment: [
      'Hamilton-T1 Transport ICU Ventilators',
      'ZOLL X-Series Defibrillator & Multi-Para Monitors',
      'Centralized Oxygen Delivery Manifold System',
      'Stryker Power-PRO Rugged Hydraulic Stretchers',
      'Real-Time GPS Fleet Tracking & Tele-Medicine Link'
    ],
    faqs: [
      { q: 'How do I request an immediate emergency ambulance?', a: 'Call our 24/7 Emergency Dispatch Helpline directly at +91 89532 08952. An ambulance will be routed to your exact GPS coordinates immediately.' },
      { q: 'Are trained doctors or paramedics available on board?', a: 'All Advanced Life Support ambulances are staffed by certified Emergency Medical Technicians (EMTs) and experienced paramedics trained in ACLS and BLS protocols.' }
    ]
  }
};

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Resolve service matching id or any alias
  const normalizedId = id ? id.toLowerCase().trim() : '';
  const serviceKey = Object.keys(servicesData).find(
    k => k === normalizedId || servicesData[k].aliases.includes(normalizedId)
  );

  const service = serviceKey ? servicesData[serviceKey] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const ServiceIcon = service.icon;

  // Filter technician services
  const filteredTechServices = service.technicianServices.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.prep.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allServicesList = [
    { id: 'diagnostic-services', title: 'Diagnostic Services', icon: Activity },
    { id: 'laboratory-services', title: 'Laboratory Services', icon: Microscope },
    { id: 'surgical-services', title: 'Surgical Services', icon: Scissors },
    { id: 'pharmacy', title: 'Pharmacy Services', icon: Pill },
    { id: 'ambulance-services', title: 'Ambulance Services', icon: Truck },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      
      {/* ======================================================== */}
      {/* HERO BANNER SECTION                                      */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[460px] lg:min-h-[520px] flex items-center justify-center text-white overflow-hidden bg-slate-900 pt-28 pb-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-1000"
          />
        </div>
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-950/75 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/90 z-0"></div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-white/70 mb-4">
              <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/services" className="hover:text-[var(--color-accent)] transition-colors">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[var(--color-accent)]">{service.title}</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/15 text-[var(--color-accent)] text-xs font-extrabold mb-5 border border-white/25 backdrop-blur-sm shadow-sm">
              <ServiceIcon className="h-4 w-4" /> {service.highlightBadge}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-4 text-white drop-shadow-lg tracking-tight">
              {service.title}
            </h1>
            
            <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              {service.tagline}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/book-appointment">
                <Button className="bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold h-12 px-7 rounded-xl shadow-lg border-0 cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" /> Book Service / Test
                </Button>
              </Link>
              <a href="tel:+918953208952">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-xs font-bold h-12 px-7 rounded-xl cursor-pointer">
                  <Phone className="mr-2 h-4 w-4 text-[var(--color-accent)]" /> Call 24/7 Helpline
                </Button>
              </a>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* KEY STATS BAR                                            */}
      {/* ======================================================== */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {service.stats.map((stat, idx) => (
            <div key={idx} className="border-r last:border-r-0 border-slate-100 pr-4 last:pr-0">
              <div className="text-2xl lg:text-3xl font-extrabold text-[#0f6c4f]">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* MAIN CONTENT & SIDEBAR                                   */}
      {/* ======================================================== */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Main Content (Span 2) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Overview & Mission */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-[#0f6c4f] text-xs font-bold uppercase tracking-wider">
                  <Award className="h-4 w-4" /> Clinical Excellence
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800">
                  {service.subtitle}
                </h2>
                <p className="text-slate-600 leading-relaxed text-base font-normal">
                  {service.overview}
                </p>
              </div>

              {/* Technician Diagnostic Tests & Services */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <ServiceIcon className="h-5 w-5 text-[#0f6c4f]" /> Available Procedures & Tests
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Performed by licensed clinical technicians and medical staff</p>
                  </div>
                  
                  {/* Search Filter */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search procedure..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTechServices.map((tech, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl border border-slate-100 bg-[#fbfdfc] hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-[#0f6c4f] shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{tech.name}</h4>
                            <p className="text-xs text-slate-400 mt-1 font-medium">📋 Prep: {tech.prep}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-emerald-600" /> {tech.time}</span>
                        <Link to="/book-appointment" className="text-[#0f6c4f] hover:underline font-bold">Book Test →</Link>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTechServices.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No procedures found matching "{searchTerm}".
                  </div>
                )}
              </div>

              {/* Advanced Technology & Equipment */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" /> Advanced Technology & Equipment
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">International gold-standard hardware for zero error tolerance</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.equipment.map((eq, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-8 w-8 rounded-lg bg-[#0f6c4f]/10 text-[#0f6c4f] flex items-center justify-center shrink-0 font-bold text-xs">
                        {i + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequently Asked Questions */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#0f6c4f]" /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {service.faqs.map((faq, fIdx) => (
                      <div key={fIdx} className="p-5 rounded-2xl bg-slate-50/75 border border-slate-100">
                        <h4 className="font-bold text-sm text-slate-800 mb-2">{faq.q}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Sticky Navigation Sidebar */}
            <div className="space-y-6">
              
              {/* All Services Navigation Menu */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-base text-slate-800 mb-4 pb-3 border-b border-slate-100">
                  Hospital Services
                </h3>
                <div className="space-y-1.5">
                  {allServicesList.map((item) => {
                    const isCurrent = item.id === service.id;
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={`/services/${item.id}`}
                        className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                          isCurrent 
                            ? 'bg-[#0f6c4f] text-white shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ItemIcon className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-[#0f6c4f]'}`} />
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight className={`h-3.5 w-3.5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Hotline Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-20 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Emergency Response</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      24/7 Rapid Medical Ambulance & Critical Trauma Care dispatch.
                    </p>
                  </div>
                  <div className="pt-2">
                    <a href="tel:+918953208952" className="block">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold h-11 rounded-xl shadow-md border-0 flex items-center justify-center gap-2 cursor-pointer">
                        <Phone className="h-4 w-4" /> +91 89532 08952
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Home Sample Collection Banner */}
              <div className="bg-[#f0f9f5] border border-emerald-200 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-[#0f6c4f]" />
                  <h4 className="font-bold text-sm text-slate-800">Home Sample Collection</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Book a certified phlebotomist at your doorstep for blood and diagnostic tests with instant digital reports.
                </p>
                <Link to="/book-appointment" className="block pt-1">
                  <Button className="w-full bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold text-xs h-9 rounded-xl border-0 shadow-xs cursor-pointer">
                    Book Home Collection
                  </Button>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
