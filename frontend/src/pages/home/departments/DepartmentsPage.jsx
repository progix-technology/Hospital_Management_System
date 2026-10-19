import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Activity, Users, ShieldCheck, ArrowRight, Brain, Bone, Eye, Microscope, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Card, CardContent } from '../../../components/Card';

export default function DepartmentsPage() {
  const departments = [
    { id: 'cardiology', name: 'Cardiology', icon: HeartPulse, desc: 'Advanced heart care, angioplasty, and cardiac surgery by top specialists.', color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'neurology', name: 'Neurology', icon: Brain, desc: 'Comprehensive treatment for brain, spinal cord, and nervous system disorders.', color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'orthopedics', name: 'Orthopedics', icon: Bone, desc: 'Joint replacement, spine surgery, and sports medicine experts.', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'pediatrics', name: 'Pediatrics', icon: ShieldCheck, desc: 'Specialized healthcare for infants, children, and adolescents.', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: Eye, desc: 'Advanced eye care, LASIK, and cataract surgery.', color: 'text-teal-500', bg: 'bg-teal-50' },
    { id: 'general-medicine', name: 'General Medicine', icon: Activity, desc: 'Primary care, diagnostics, and management of chronic conditions.', color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'oncology', name: 'Oncology', icon: Microscope, desc: 'Comprehensive cancer care including chemotherapy, radiation, and surgical oncology.', color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'dermatology', name: 'Dermatology', icon: Zap, desc: 'Expert skin, hair, and nail care with advanced dermatological treatments.', color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Page Header */}
      <section className="relative w-full pt-24 pb-12 sm:pt-28 sm:pb-20 lg:py-24 min-h-[320px] sm:min-h-[400px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785927339/departments_k7dwgb.png')] bg-cover bg-center"></div>
        {/* Subtle gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/30"></div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center sm:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-2.5 sm:mb-4 text-white drop-shadow-lg">Our Medical Departments</h1>
            <p className="text-xs sm:text-base md:text-lg text-white/90 max-w-2xl mb-4 sm:mb-6 drop-shadow-md font-normal leading-relaxed mx-auto sm:mx-0">
              We offer comprehensive specialized clinical departments equipped with state-of-the-art diagnostic and surgical infrastructure.
            </p>
            <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm font-semibold text-emerald-300 drop-shadow-md gap-2">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="text-white">Departments Directory</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Departments Grid (2 per line on mobile, 3 on tablet, 4 on desktop) */}
      <section className="py-6 sm:py-14 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {departments.map((dept, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Card className="border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden h-full flex flex-col justify-between bg-white">
                  <CardContent className="p-3 sm:p-5 lg:p-6 h-full flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl ${dept.bg} flex items-center justify-center mb-2 sm:mb-4 transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                      <dept.icon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 ${dept.color}`} />
                    </div>
                    <h4 className="text-xs sm:text-base lg:text-lg font-bold text-slate-900 mb-1 sm:mb-2 truncate w-full">{dept.name}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-5 leading-relaxed line-clamp-2 flex-grow">{dept.desc}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2.5 w-full mt-auto pt-1">
                      <Link to={`/departments/${dept.id}`} className="flex-1 w-full">
                        <Button variant="outline" className="w-full h-7 sm:h-9 text-[10px] sm:text-xs rounded-lg sm:rounded-xl border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 px-2 font-semibold">
                          Explore
                        </Button>
                      </Link>
                      <Link to={`/book-appointment?dept=${dept.name.toLowerCase()}`} className="flex-1 w-full hidden sm:block">
                        <Button className="w-full h-9 text-xs rounded-xl bg-[var(--color-primary)] text-white shadow-xs font-semibold hover:bg-[var(--color-primary)]/90">
                          Book
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interstitial CTA */}
      <section className="py-20 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbp97xecb/image/upload/v1785928188/Editorial_illustration_cvrrm9.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif italic font-light text-slate-200 mb-6 drop-shadow-lg">Need Help Choosing the Right Specialist?</h2>
          <p className="text-white/90 text-lg mb-8 drop-shadow">Our care coordinators are available 24/7 to help you find the perfect doctor for your specific medical needs.</p>
          <a href="tel:1800123456">
            <Button className="h-14 px-10 text-lg rounded-full bg-white text-slate-900 shadow-xl hover:bg-slate-100 hover:shadow-2xl transition-all">
              Call Care Team
            </Button>
          </a>
        </div>
      </section>

    </div>
  );
}
