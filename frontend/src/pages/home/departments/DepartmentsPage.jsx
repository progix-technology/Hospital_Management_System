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
      <section className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbp97xecb/image/upload/f_auto,q_auto,w_1600/v1785927339/departments_k7dwgb.png')] bg-cover bg-center"></div>
        {/* Only a very subtle gradient at the bottom for text readability, no dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">Our Departments</h1>
            <p className="text-lg text-white max-w-2xl mb-8 drop-shadow-md font-medium">We offer a wide range of specialized medical departments equipped with state-of-the-art technology and staffed by world-renowned experts.</p>
            <div className="flex items-center text-sm font-bold text-white drop-shadow-md gap-2">
              <Link to="/" className="hover:text-slate-200 transition-colors">Home</Link>
              <ArrowRight className="h-4 w-4" />
              <span>Departments</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer rounded-3xl overflow-hidden h-full">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className={`h-16 w-16 rounded-2xl ${dept.bg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                      <dept.icon className={`h-8 w-8 ${dept.color}`} />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-4">{dept.name}</h4>
                    <p className="text-slate-600 mb-8 leading-relaxed flex-grow">{dept.desc}</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <Link to={`/departments/${dept.id}`} className="flex-1">
                        <Button variant="outline" className="w-full rounded-xl border-gray-200 text-slate-700 hover:bg-slate-50">Explore</Button>
                      </Link>
                      <Link to={`/book-appointment?dept=${dept.name.toLowerCase()}`} className="flex-1">
                        <Button className="w-full rounded-xl bg-[var(--color-primary)] text-white shadow-sm">Book</Button>
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
