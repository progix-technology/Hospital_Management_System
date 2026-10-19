import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ShieldAlert, Heart, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/Button';

export default function PackagesPage() {
  const packages = [
    {
      id: 1,
      name: 'Basic Wellness',
      target: 'Ideal for healthy individuals under 30',
      price: '₹1,499',
      originalPrice: '₹2,500',
      popular: false,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      icon: Activity,
      tests: 45,
      features: [
        'Complete Blood Count (CBC)',
        'Fasting Blood Sugar',
        'Lipid Profile (Cholesterol)',
        'Kidney Function Test',
        'Liver Function Test',
        'General Physician Consultation'
      ]
    },
    {
      id: 2,
      name: 'Advanced Full Body',
      target: 'Comprehensive screening for ages 30-50',
      price: '₹3,999',
      originalPrice: '₹6,500',
      popular: true,
      color: 'bg-[var(--color-primary)]',
      lightBg: 'bg-[var(--color-primary)]/10',
      icon: ShieldCheck,
      tests: 85,
      features: [
        'Everything in Basic Wellness',
        'Thyroid Profile (T3, T4, TSH)',
        'HbA1c (Diabetes Marker)',
        'Vitamin D & B12 Levels',
        'ECG & Chest X-Ray',
        'Urine Routine & Microscopy',
        'Cardiology & Dietitian Consultation'
      ]
    },
    {
      id: 3,
      name: 'Senior Citizen Care',
      target: 'Specialized care for ages 50 and above',
      price: '₹4,499',
      originalPrice: '₹7,000',
      popular: false,
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      icon: Heart,
      tests: 70,
      features: [
        'Everything in Advanced Full Body',
        'Bone Mineral Density (BMD)',
        'Prostate Specific Antigen (PSA) for Men',
        'Mammography for Women',
        'Eye & Dental Examination',
        'Detailed Cardiac Evaluation (Echo)',
        'Physiotherapy Assessment'
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      
      {/* Hero Section with Stethoscope Banner (Full height on mobile) */}
      <section className="relative w-full min-h-[100dvh] lg:min-h-[520px] flex items-center justify-center text-white overflow-hidden bg-slate-900 pt-28 pb-20">
        {/* Stethoscope Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbp97xecb/image/upload/v1785925419/medisphere/about/healthcheckups.jpg" 
            alt="Preventive Healthcare & Stethoscope" 
            className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000"
          />
        </div>
        {/* Soft Contrast Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/70 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 z-0"></div>
        
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/15 text-[var(--color-accent)] text-xs font-extrabold mb-4 sm:mb-6 border border-white/25 backdrop-blur-sm shadow-sm">
              <ShieldAlert className="h-4 w-4" /> Preventive Care & Diagnostics
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-4 sm:mb-6 text-white drop-shadow-lg tracking-tight">
              Prevention is better <br className="hidden md:block"/> than cure.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-6 leading-relaxed font-medium drop-shadow-md">
              Discover our comprehensive health checkup packages designed to detect potential health issues early. Take control of your health today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing / Packages Section (Compact Height) */}
      <section className="py-8 sm:py-16 bg-slate-50 relative -mt-6 sm:-mt-10 rounded-t-[24px] sm:rounded-t-[40px] z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border flex flex-col justify-between ${pkg.popular ? 'border-[var(--color-primary)] shadow-md sm:shadow-xl lg:scale-105 z-10' : 'border-slate-200 shadow-xs mt-0 sm:mt-2 lg:mt-4'}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider py-1 px-3 sm:px-4 rounded-full shadow-xs">
                    Most Popular
                  </div>
                )}
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${pkg.lightBg}`}>
                      <pkg.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${pkg.popular ? 'text-[var(--color-primary)]' : pkg.color.replace('bg-', 'text-')}`} />
                    </div>
                    <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold py-0.5 px-2.5 rounded-full">
                      {pkg.tests} Tests Included
                    </span>
                  </div>
                  
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-heading)] mb-1">{pkg.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3 line-clamp-1 sm:line-clamp-2">{pkg.target}</p>
                  
                  <div className="flex items-baseline gap-2 mb-3 pb-3 border-b border-slate-100">
                    <span className="text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">{pkg.price}</span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through">{pkg.originalPrice}</span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-6">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-2.5">
                        <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${pkg.popular ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-slate-100 text-slate-500'}`}>
                          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={3} />
                        </div>
                        <span className="text-xs sm:text-sm text-[var(--color-foreground)] leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link to="/book-appointment" className="block mt-auto pt-2">
                  <Button 
                    className={`w-full h-10 sm:h-12 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${pkg.popular ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-xs' : 'bg-slate-100 text-[var(--color-heading)] hover:bg-slate-200 border-none'}`}
                  >
                    Book This Package
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          
        </div>
      </section>

      {/* Corporate Packages Banner */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="rounded-[32px] overflow-hidden relative shadow-xl min-h-[360px] flex items-center">
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbp97xecb/image/upload/v1785925434/medisphere/about/team.jpg')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-black/20"></div>
            
            <div className="relative z-10 p-8 md:p-14 md:w-3/5">
              <div className="inline-block bg-[var(--color-accent)] text-slate-900 text-xs font-extrabold uppercase tracking-widest py-1 px-3 rounded-md mb-4 shadow-sm">
                For Businesses
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 drop-shadow-sm">Corporate Health Plans</h2>
              <p className="text-white/90 text-sm md:text-base mb-8 leading-relaxed font-medium drop-shadow-xs">
                Ensure the well-being of your employees with our tailored corporate health checkup packages. We offer on-site camps and bulk discounts for organizations.
              </p>
              <Link to="/contact">
                <Button className="bg-white hover:bg-emerald-50 text-slate-900 font-bold border-none h-12 px-8 rounded-xl shadow-lg transition-all hover:scale-105">
                  Request a Quote <ArrowRight className="ml-2 h-4 w-4 text-[#0f6c4f]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
