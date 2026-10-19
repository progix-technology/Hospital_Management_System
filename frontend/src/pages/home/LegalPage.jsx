import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, FileText, HelpCircle, ChevronRight, ChevronDown, 
  Search, Phone, Mail, ArrowRight, CheckCircle2, Lock, Sparkles
} from 'lucide-react';
import { Button } from '../../components/Button';

const content = {
  '/privacy': {
    icon: Shield,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badge: 'Data Protection & Security',
    title: 'Privacy Policy',
    updated: 'Last updated: August 1, 2026',
    summary: 'At Medisphere, your privacy and health data confidentiality are strictly guarded by international HIPAA standards and end-to-end 256-bit encryption.',
    sections: [
      {
        heading: 'Information We Collect',
        body: `We collect information you provide directly to us, including your full name, email address, phone number, date of birth, medical history, vital stats, insurance coverage details, and doctor consultation notes. We also collect automated diagnostic logs and session security timestamps to ensure account safety.`
      },
      {
        heading: 'How We Use Your Medical Data',
        body: `Your medical information is strictly used to provide healthcare services: scheduling doctor appointments, maintaining Electronic Health Records (EHR), dispatching diagnostic lab reports, and processing health insurance claims. We never use clinical data for external advertising.`
      },
      {
        heading: 'Confidentiality & Sharing Policies',
        body: `We do not sell, rent, or trade your personal health data to any commercial third parties. Your records are only accessible to certified medical professionals assigned to your direct treatment, verified diagnostic lab technicians, and regulatory health authorities when mandated by law.`
      },
      {
        heading: 'Data Security & Encryption',
        body: `We employ bank-grade 256-bit SSL/TLS encryption for all data in transit and AES-256 encryption at rest. All servers are hosted in secure, HIPAA-compliant data centers with multi-factor biometric access controls and 24/7 automated vulnerability scanning.`
      },
      {
        heading: 'Patient Rights & Data Control',
        body: `You retain full ownership of your health records. You have the right to request a complete PDF export of your medical history, modify personal profile information, revoke device permissions, or request complete account anonymization by contacting our Data Protection Officer.`
      },
      {
        heading: 'Cookies & Tracking',
        body: `We utilize strictly necessary session cookies to maintain your authenticated login state and preserve interface preferences. No third-party ad tracking or social media trackers are injected into sensitive patient portal dashboards.`
      },
      {
        heading: 'Contact Data Protection Officer',
        body: `If you have inquiries regarding privacy practices or data compliance, please contact our dedicated Privacy Desk at privacy@medisphere.com or call our toll-free regulatory helpline.`
      }
    ]
  },
  '/terms': {
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    badge: 'Legal Terms & User Agreement',
    title: 'Terms of Service',
    updated: 'Last updated: August 1, 2026',
    summary: 'Please review these terms carefully. By using Medisphere websites, patient portals, and telemedicine services, you agree to comply with our healthcare guidelines.',
    sections: [
      {
        heading: 'Acceptance of Legal Terms',
        body: `By accessing or using Medisphere's healthcare portal, mobile web applications, and clinical consultation booking tools, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and applicable Indian and international healthcare regulations.`
      },
      {
        heading: 'Authorized Use of Platform',
        body: `Medisphere provides digital management for patients, doctors, and diagnostic laboratories. You agree to provide accurate, truthful personal and clinical information and refrain from submitting fraudulent identities, impersonating medical practitioners, or compromising system security.`
      },
      {
        heading: 'Patient Account Responsibilities',
        body: `You are solely responsible for maintaining the confidentiality of your login credentials and OTP verifications. Any actions performed through your authenticated account will be deemed authorized by you. Notify hospital security immediately if you suspect unauthorized access.`
      },
      {
        heading: 'Medical Disclaimer & Emergency Notice',
        body: `Digital information and telemedicine portals provided through Medisphere are designed to support, not replace, direct relationships between patients and physicians. For life-threatening emergencies, do not wait for an online reply — contact local emergency services (112) immediately.`
      },
      {
        heading: 'Appointment Cancellation & Refunds',
        body: `Consultations may be rescheduled or cancelled without penalty up to 4 hours prior to the booked slot time. In cases where payment was processed in advance, refunds are automatically credited back to the source bank account within 3 to 5 business days.`
      },
      {
        heading: 'Intellectual Property Rights',
        body: `All software architectures, clinical workflows, design frameworks, branding assets, and diagnostic algorithms published on this platform remain the exclusive proprietary property of Medisphere Healthcare Systems.`
      },
      {
        heading: 'Termination & Service Updates',
        body: `We reserve the right to suspend or restrict portal access to individuals who violate hospital conduct policies, submit fabricated prescription requests, or attempt denial-of-service operations on our digital infrastructure.`
      }
    ]
  },
  '/faq': {
    icon: HelpCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    badge: 'Help & Frequently Asked Questions',
    title: 'Frequently Asked Questions',
    updated: 'Last updated: August 1, 2026',
    summary: 'Find answers to common questions about booking doctor appointments, accessing lab test results, emergency SOS services, and health insurance billing.',
    sections: [
      {
        heading: 'How do I book a doctor appointment online?',
        body: `You can book an appointment directly from the homepage by clicking "Book Appointment" or via the Patient Portal. Simply choose your department, pick an available specialist, select a suitable date & time slot, and confirm. You will receive an instant SMS and email confirmation with doctor details.`
      },
      {
        heading: 'Can I view and download my medical reports on my phone?',
        body: `Yes! Once logged into your Patient Portal, tap on the "Medical Records" section. All your past consultations, lab diagnostic PDFs, blood test analyses, and doctor prescriptions are available 24/7 for instant viewing and offline PDF download.`
      },
      {
        heading: 'How does the emergency helpline and SOS work?',
        body: `Medisphere provides a 24/7 Level-1 trauma and emergency care hotline (1800-123-456). In case of an emergency, calling our hotline dispatches an equipped Advanced Cardiac Life Support (ACLS) ambulance with live GPS tracking to your location.`
      },
      {
        heading: 'How do I get my prescription refilled?',
        body: `Go to "Prescriptions" in your Patient Portal dashboard. Find your active prescription and tap "Request Refill". The attending doctor will review your clinical history and either reauthorize the medication or recommend a follow-up consultation.`
      },
      {
        heading: 'How are diagnostic lab test results delivered?',
        body: `As soon as our lab pathologists certify your test sample, the report is uploaded directly to your portal profile. You receive an immediate SMS notification and email with a secure link to download the digitally verified report.`
      },
      {
        heading: 'Is cashless health insurance accepted at Medisphere?',
        body: `Yes. Medisphere is partnered with all major TPA and private insurance providers including Star Health, Care Health, HDFC ERGO, ICICI Lombard, and Tata AIG. Our dedicated insurance desk in the hospital lobby handles pre-authorization and claims settlement.`
      },
      {
        heading: 'Can I reschedule or cancel an appointment if my plans change?',
        body: `Yes, you can easily reschedule or cancel an upcoming appointment free of charge up to 4 hours before your scheduled appointment time from your Patient Portal > "My Appointments" screen.`
      },
      {
        heading: 'How is patient medical data secured against unauthorized access?',
        body: `All patient health information is encrypted with 256-bit SSL in transit and AES-256 at rest, adhering to strict HIPAA compliance guidelines. Only your treating doctors and authorized clinical staff have role-based access to your diagnostic history.`
      }
    ]
  }
};

export default function LegalPage() {
  const location = useLocation();
  const page = content[location.pathname];
  const isFaq = location.pathname === '/faq';

  // Search & FAQ Accordion State
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordion, setOpenAccordion] = useState(0); // Default first item open on FAQ

  if (!page) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
          <p className="text-slate-500 mb-4 text-sm">The legal or policy document you requested does not exist.</p>
          <Link to="/">
            <Button className="rounded-full bg-[var(--color-primary)] text-white">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = page.icon;

  // Filter sections if search query is entered
  const filteredSections = page.sections.filter(sec => 
    sec.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      
      {/* ========================================================
          1. HERO HEADER SECTION (Mobile-Friendly & Balanced)
          ======================================================== */}
      <section className="bg-gradient-to-br from-[#0f6c4f] via-[#125841] to-slate-950 text-white pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-16 px-3 sm:px-6 relative overflow-hidden">
        {/* Soft Decorative Ambient Background */}
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-300/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-emerald-200/90 mb-4 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-emerald-300/60 shrink-0" />
            <span className="text-white font-semibold truncate">{page.badge}</span>
          </nav>

          {/* Title & Badge */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 mb-4">
            <div className={`h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl ${page.bg} flex items-center justify-center shrink-0 shadow-inner border border-white/20 mt-1 sm:mt-0`}>
              <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${page.color}`} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                <Shield className="h-3 w-3" /> Official Documentation
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                {page.title}
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-light leading-relaxed mb-6">
            {page.summary}
          </p>

          {/* Quick Segmented Navigation Tabs (Smooth & Mobile Tap-Friendly) */}
          <div className="flex items-center gap-2 p-1 bg-black/25 backdrop-blur-md rounded-xl sm:rounded-full border border-white/15 max-w-fit overflow-x-auto">
            {[
              { label: 'Privacy Policy', path: '/privacy' },
              { label: 'Terms of Service', path: '/terms' },
              { label: 'FAQ', path: '/faq' }
            ].map(tab => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-full text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                  location.pathname === tab.path
                    ? 'bg-white text-[#0f6c4f] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Optional Search Bar for FAQ */}
          {isFaq && (
            <div className="mt-5 relative max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. appointment, reports, cancel)..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white text-slate-800 text-xs sm:text-sm placeholder-slate-400 border border-white/30 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          2. CONTENT BODY (Mobile-Optimized Cards & FAQ Accordion)
          ======================================================== */}
      <main className="flex-1 py-8 sm:py-14 px-3 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          
          {/* Metadata banner */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-4 sm:mb-6 px-1">
            <span>{page.updated}</span>
            <span>Document ID: MED-LEG-{location.pathname.replace('/', '').toUpperCase()}</span>
          </div>

          {/* Section List / FAQ Items */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-3 sm:space-y-4"
          >
            {filteredSections.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
                <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No matches found</h3>
                <p className="text-xs text-slate-500 mb-4">No questions matching "{searchQuery}". Try a different keyword.</p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="rounded-full text-xs"
                >
                  View All Questions
                </Button>
              </div>
            ) : isFaq ? (
              /* FAQ Accordion on Mobile & Desktop */
              filteredSections.map((section, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700"
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full ${isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'} flex items-center justify-center text-[11px] sm:text-xs font-bold shrink-0 transition-colors`}>
                          Q{idx + 1}
                        </span>
                        <h2 className="text-xs sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {section.heading}
                        </h2>
                      </div>
                      <ChevronDown 
                        className={`h-4 w-4 sm:h-5 sm:w-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1 pt-3">
                            {section.body}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              /* Privacy Policy & Terms of Service Structured Cards */
              filteredSections.map((section, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-6 transition-all hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  <div className="flex items-start gap-3 mb-2 sm:mb-2.5">
                    <span className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full ${page.bg} ${page.color} flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 mt-0.5`}>
                      {idx + 1}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {section.heading}
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm pl-9 sm:pl-10">
                    {section.body}
                  </p>
                </div>
              ))
            )}
          </motion.div>

          {/* ========================================================
              3. CONTACT & HELPDESK FOOTER CALLOUT (Mobile-Friendly)
              ======================================================== */}
          <div className="mt-8 sm:mt-12 bg-emerald-50/70 dark:bg-slate-900/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                Still have unanswered questions?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Our patient relations desk is available 24/7 to resolve legal, billing, and clinical queries.
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-sm">
                  Contact Support
                </Button>
              </Link>
              <a href="tel:1800123456" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl border-emerald-600/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50">
                  <Phone className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Call Desk
                </Button>
              </a>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
