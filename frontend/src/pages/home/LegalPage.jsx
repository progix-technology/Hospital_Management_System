import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, HelpCircle, ChevronRight } from 'lucide-react';

const content = {
  '/privacy': {
    icon: Shield,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: 'Privacy Policy',
    title: 'Privacy Policy',
    updated: 'Last updated: August 1, 2026',
    sections: [
      {
        heading: 'Information We Collect',
        body: `We collect information you provide directly to us, including your name, email address, phone number, date of birth, medical history, insurance information, and any other information you choose to provide when using our services. We may also collect information automatically when you use our platform, such as usage data, device information, and log data.`
      },
      {
        heading: 'How We Use Your Information',
        body: `We use the information we collect to provide, maintain, and improve our healthcare services; process appointments and medical records; communicate with you about your health and our services; send administrative messages and updates; comply with legal obligations; and protect the rights and safety of our patients and staff.`
      },
      {
        heading: 'Sharing of Information',
        body: `We do not sell or rent your personal health information to third parties. We may share your information with healthcare providers involved in your treatment, insurance companies for billing purposes, regulatory bodies as required by law, and trusted service providers who assist in operating our platform — all under strict confidentiality agreements.`
      },
      {
        heading: 'Data Security',
        body: `We implement industry-standard security measures including end-to-end encryption, secure HTTPS connections, access controls, and regular security audits to protect your personal and medical data. All data is stored on HIPAA-compliant servers located in secure data centers.`
      },
      {
        heading: 'Your Rights',
        body: `You have the right to access, correct, or delete your personal information at any time. You may also request a copy of your medical records, opt out of non-essential communications, and withdraw consent where applicable. Contact our support team to exercise any of these rights.`
      },
      {
        heading: 'Cookies',
        body: `We use cookies and similar tracking technologies to improve your experience on our platform. You can control cookie settings through your browser. Disabling cookies may limit certain features of our service.`
      },
      {
        heading: 'Contact Us',
        body: `If you have any questions about this Privacy Policy, please contact our Data Protection Officer at privacy@medisphere.com or visit our support page.`
      }
    ]
  },
  '/terms': {
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badge: 'Terms of Service',
    title: 'Terms of Service',
    updated: 'Last updated: August 1, 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: `By accessing or using Medisphere's services, website, or mobile application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using our services.`
      },
      {
        heading: 'Use of Services',
        body: `Medisphere provides an online healthcare management platform for patients, doctors, and healthcare administrators. You agree to use our services only for lawful purposes and in a manner consistent with all applicable local, national, and international laws and regulations.`
      },
      {
        heading: 'Account Responsibilities',
        body: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Medisphere is not liable for any loss or damage resulting from your failure to protect your account information.`
      },
      {
        heading: 'Medical Disclaimer',
        body: `Medisphere is a platform for healthcare management and appointment scheduling. Content available on this platform is for informational purposes only and does not constitute medical advice. Always seek the advice of your physician or qualified health provider for medical concerns.`
      },
      {
        heading: 'Intellectual Property',
        body: `All content, features, and functionality on our platform — including text, graphics, logos, and software — are the exclusive property of Medisphere and are protected by applicable copyright, trademark, and other intellectual property laws.`
      },
      {
        heading: 'Limitation of Liability',
        body: `Medisphere shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use our services. Our total liability shall not exceed the amount you paid for our services in the past 12 months.`
      },
      {
        heading: 'Termination',
        body: `We reserve the right to suspend or terminate your access to our services at any time for violation of these terms. Upon termination, your right to use our services will immediately cease.`
      },
      {
        heading: 'Changes to Terms',
        body: `We may update these Terms of Service from time to time. We will notify you of any significant changes via email or a prominent notice on our platform. Continued use of our services after changes constitutes acceptance of the new terms.`
      }
    ]
  },
  '/faq': {
    icon: HelpCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    badge: 'Frequently Asked Questions',
    title: 'Frequently Asked Questions',
    updated: 'Last updated: August 1, 2026',
    sections: [
      {
        heading: 'How do I book an appointment?',
        body: `Log in to your Patient Portal, navigate to the Appointments section, and click "Book New Appointment". Select your preferred doctor, specialty, date, and time slot. You will receive a confirmation email and SMS with your appointment details.`
      },
      {
        heading: 'Can I view my medical records online?',
        body: `Yes! Once logged in to your Patient Portal, go to the Medical Records section. You can view, download, and print your full Electronic Health Records (EHR) including diagnoses, prescriptions, lab test results, and clinical notes from your doctor.`
      },
      {
        heading: 'How do I get my prescription refilled?',
        body: `In your Patient Portal, visit the Prescriptions section. You will see all your active medications. Click "Request Refill" on the desired medication. Your doctor will be notified and the prescription will be updated accordingly.`
      },
      {
        heading: 'What should I do in case of a medical emergency?',
        body: `In case of a medical emergency, call 112 (India) or your local emergency number immediately. You can also use the SOS Emergency button on the Patient Portal to alert the nearest hospital. Do not rely solely on our platform for emergency care.`
      },
      {
        heading: 'How are my lab reports shared with me?',
        body: `Once the Lab Technician uploads your reports, you will receive a notification in your Patient Portal bell icon. You can view the full PDF lab report directly from your Medical Records page or from the notification panel.`
      },
      {
        heading: 'Is my health data secure?',
        body: `Absolutely. We use industry-leading encryption standards and comply with HIPAA guidelines. Your personal and medical data is never shared with unauthorized parties. All data transfers are secured with TLS/SSL encryption.`
      },
      {
        heading: 'How do I contact customer support?',
        body: `You can reach our support team 24/7 through the Support page in your Patient Portal, by emailing support@medisphere.com, or by calling our helpline at 1800-MED-HELP. We typically respond within 2 business hours.`
      },
      {
        heading: 'Can I cancel or reschedule an appointment?',
        body: `Yes. Go to the Appointments section in your Patient Portal, find the upcoming appointment, and select "Reschedule" or "Cancel". Please cancel at least 24 hours in advance to avoid a cancellation fee.`
      }
    ]
  }
};

export default function LegalPage() {
  const location = useLocation();
  const page = content[location.pathname];

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Page not found</h2>
          <Link to="/" className="text-emerald-600 hover:underline font-semibold">Go back home</Link>
        </div>
      </div>
    );
  }

  const Icon = page.icon;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0f6c4f] to-emerald-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-200 text-sm mb-4 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{page.badge}</span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className={`h-16 w-16 rounded-2xl ${page.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-8 w-8 ${page.color}`} />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
              <p className="text-emerald-200 text-sm mt-1">{page.updated}</p>
            </div>
          </div>

          {/* Quick Navigation tabs */}
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { label: 'Privacy Policy', path: '/privacy' },
              { label: 'Terms of Service', path: '/terms' },
              { label: 'FAQ', path: '/faq' }
            ].map(tab => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  location.pathname === tab.path
                    ? 'bg-white text-[#0f6c4f] border-white shadow'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {page.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-3">
                <span className={`h-7 w-7 rounded-full ${page.bg} ${page.color} flex items-center justify-center text-xs font-black shrink-0`}>
                  {idx + 1}
                </span>
                {section.heading}
              </h2>
              <p className="text-slate-600 leading-relaxed text-[15px] pl-10">{section.body}</p>
            </div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-slate-500 text-sm">
            Have more questions?{' '}
            <Link to="/faq" className="text-emerald-600 font-semibold hover:underline">Check our FAQ</Link>
            {' '}or{' '}
            <Link to="/portal/support" className="text-emerald-600 font-semibold hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
