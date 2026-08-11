import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Stethoscope, Phone, Star, Bed, Calendar, Award, HeartPulse, Activity, MapPin, Mail
} from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '../../../components/Button';

export default function HomePage() {
  const stats = [
    { label: 'Happy Patients', value: 50, suffix: ',000+', icon: 'users' },
    { label: 'Hospital Beds', value: 250, suffix: '+', icon: Bed },
    { label: 'Expert Doctors', value: 500, suffix: '+', icon: 'user' },
    { label: 'Years of Excellence', value: 15, suffix: '+', icon: Calendar },
    { label: 'Awards & Accreditations', value: 25, suffix: '+', icon: Award },
    { label: 'Patient Satisfaction', value: 98, suffix: '%', icon: HeartPulse },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">

      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[var(--color-background)] lg:bg-transparent min-h-[550px] lg:min-h-[650px] flex items-center pt-8 pb-16 lg:pt-0 lg:pb-0">

        {/* Full Bleed Right Image */}
        <div className="absolute top-0 right-0 w-full lg:w-[58%] h-full z-0 hidden lg:block">
          <img src="/Hospital.png" alt="Hospital Building" className="w-full h-full object-cover" />
          {/* Subtle overlay to ensure card readability if needed */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Massive Curved Background Overlay on Left */}
        <div className="absolute top-0 left-0 w-full lg:w-[50%] h-full bg-[var(--color-background)] lg:rounded-br-[250px] xl:rounded-br-[350px] z-10 shadow-[10px_0_30px_rgba(0,0,0,0.03)] hidden lg:block"></div>

        <div className="container mx-auto max-w-[1400px] px-4 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[600px] pl-4 lg:pl-10 py-10 lg:py-20"
            >
              <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-[var(--color-card)] text-[var(--color-primary)] text-xs font-semibold mb-6 shadow-sm border border-[var(--color-border)]">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                Excellence in Healthcare
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-bold text-[var(--color-heading)] leading-[1.1] mb-6 tracking-tight">
                World-Class Medical <br />
                <span className="text-[var(--color-primary)]">
                  Care You Can Trust
                </span>
              </h1>

              <p className="text-base text-[var(--color-foreground)] mb-8 leading-relaxed font-medium pr-4">
                Experience unparalleled healthcare with our state-of-the-art facilities, expert specialists, and compassionate approach to healing.
              </p>

              <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-card)] shadow-sm border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <Activity className="h-4 w-4 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-heading)] leading-tight">Advanced<br />Technology</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-card)] shadow-sm border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <Stethoscope className="h-4 w-4 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-heading)] leading-tight">Expert<br />Doctors</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-card)] shadow-sm border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-[var(--color-accent)]" />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-heading)] leading-tight">24/7<br />Emergency</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-card)] shadow-sm border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <HeartPulse className="h-4 w-4 text-[var(--color-success)]" />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-heading)] leading-tight">Patient<br />First Approach</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/book-appointment">
                  <Button variant="primary" className="h-12 px-8 text-sm w-full sm:w-auto">
                    <Calendar className="mr-2 h-4 w-4" /> Book an Appointment
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="secondary" className="h-12 px-8 text-sm w-full sm:w-auto">
                    Find a Doctor <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-background-secondary)] border-2 border-[var(--color-background)] overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=1" alt="Patient" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[var(--color-background-secondary)] border-2 border-[var(--color-background)] overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=2" alt="Patient" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[var(--color-background-secondary)] border-2 border-[var(--color-background)] overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=3" alt="Patient" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[var(--color-foreground)]">Trusted by 50,000+ patients and families</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />)}
                    <span className="text-[11px] font-bold ml-1 text-[var(--color-heading)]">4.9/5</span>
                    <span className="text-[10px] text-[var(--color-muted)] ml-1">(1,200+ Reviews)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side Content (Overlays on Image) */}
            <div className="relative h-[400px] lg:h-full w-full flex items-end justify-end pb-10">

              {/* Mobile Image (Hidden on Desktop) */}
              <div className="absolute inset-0 lg:hidden rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)]">
                <img src="/Hospital.png" alt="Hospital Building" className="w-full h-full object-cover" />
              </div>

              {/* Slider Arrow (Right) */}
              <Link to="/login" className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 h-12 w-12 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full shadow-lg items-center justify-center cursor-pointer hover:bg-[var(--color-background-secondary)] z-20 transition-colors">
                <ArrowRight className="h-5 w-5 text-[var(--color-foreground)]" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Stats Bar */}
      <section className="relative z-30 -mt-16 mb-20 px-4">
        <div className="container mx-auto max-w-[1300px]">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] py-5 px-8 relative overflow-hidden">
            {/* Subtle premium accent line at the top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6 lg:divide-x divide-[var(--color-border)]/60">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-center gap-4 lg:pt-0 group cursor-pointer hover:-translate-y-0.5 transition-transform duration-300">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 bg-[var(--color-background-secondary)] text-[var(--color-primary)] border border-[var(--color-border)] shadow-sm group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300`}>
                    {typeof stat.icon === 'string' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    ) : (
                      <stat.icon className="h-4 w-4 text-inherit transition-colors duration-300" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-[var(--color-heading)] font-serif leading-none tracking-tight">
                      {React.createElement(CountUp.default || CountUp, { end: stat.value, duration: 2.5 })}
                      <span className="text-[var(--color-accent)]">{stat.suffix}</span>
                    </div>
                    <p className="text-[9px] text-[var(--color-foreground)] font-bold mt-1.5 uppercase tracking-[0.1em]">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* 1. Trusted By Logos */}
      <section className="py-12 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="text-center mb-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-heading)] mb-4">Trusted by Leading Organizations</h4>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            {[
              { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925436/medisphere/organizations/unicef.png', alt: 'UNICEF' },
              { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925438/medisphere/organizations/who.png', alt: 'WHO' },
              { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925437/medisphere/organizations/usaid.png', alt: 'USAID' },
              { src: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925435/medisphere/organizations/iso.png', alt: 'ISO' }
            ].map((logo, idx) => (
              <div key={idx} className="h-20 w-36 md:h-24 md:w-48 bg-white rounded-2xl shadow-sm border border-[var(--color-border)] flex items-center justify-center p-4 hover:shadow-md transition-all duration-300 group cursor-pointer">
                <img src={logo.src} alt={logo.alt} className="h-full w-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Quick Action Cards */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Find a Doctor', desc: 'Search by specialty', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925413/medisphere/about/docters.jpg', icon: 'User', link: '/doctors' },
              { title: 'Our Departments', desc: 'Comprehensive care for every need', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925434/medisphere/about/team.jpg', icon: 'Building', link: '/departments' },
              { title: 'Health Checkups', desc: 'Preventive care for a healthier you', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925419/medisphere/about/healthcheckups.jpg', icon: 'Activity', link: '/book-appointment' },
              { title: 'Emergency Care', desc: '24/7 emergency services', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925417/medisphere/about/emergency.jpg', icon: 'Phone', link: '/contact' }
            ].map((card, idx) => (
              <Link key={idx} to={card.link} className="bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group min-h-[240px] flex flex-col justify-end border border-[var(--color-border)] cursor-pointer">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors"></div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="font-serif font-bold text-xl text-white mb-2 flex items-center gap-2">
                    {card.title} <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                  </h3>
                  <p className="text-sm text-white/80 mb-5">{card.desc}</p>
                  <div className="h-10 w-10 rounded-full border border-white/30 text-white flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:border-transparent group-hover:text-black transition-all">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-24 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="text-center mb-16">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-heading)] mb-4">Why Choose Us</h4>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)]">Exceptional Care, Every Time</h2>
            <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6 text-center">
            {[
              { title: 'Advanced Technology', desc: 'State-of-the-art medical equipment for accurate diagnosis.', icon: 'Activity' },
              { title: 'Expert Specialists', desc: 'Highly qualified and experienced doctors across all departments.', icon: 'Stethoscope' },
              { title: 'Patient-Centric', desc: 'Personalized treatment plans with compassionate care.', icon: 'HeartPulse' },
              { title: 'Safe & Hygienic', desc: 'International standards of cleanliness and safety protocols.', icon: 'ShieldCheck' },
              { title: '24/7 Support', desc: 'Round-the-clock care and support whenever you need us.', icon: 'Phone' },
              { title: 'Affordable Care', desc: 'Quality healthcare that is accessible and affordable for all.', icon: 'Award' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center relative">
                <div className="h-12 w-12 rounded-xl bg-[var(--color-background-secondary)] text-[var(--color-primary)] flex items-center justify-center mb-4 relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-accent)] rounded-full border-2 border-[var(--color-background)]"></div>
                  <ShieldCheck className="h-6 w-6" /> {/* Placeholder icon */}
                </div>
                <h3 className="font-serif font-bold text-sm lg:text-base text-[var(--color-heading)] mb-2 leading-tight">{item.title}</h3>
                <p className="text-[11px] text-[var(--color-foreground)] leading-relaxed max-w-[180px]">{item.desc}</p>

                {/* Vertical separator on desktop */}
                {idx !== 5 && (
                  <div className="hidden lg:block absolute right-[-12px] top-[10%] h-[80%] w-px bg-[var(--color-border)]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Medical Specialties */}
      <section className="py-24 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="text-center mb-16">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-heading)] mb-4">Our Medical Specialties</h4>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)]">Comprehensive Medical Services</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { title: 'Cardiology', desc: 'Heart & Vascular Care', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925410/medisphere/about/cardiology.jpg', link: '/departments/cardiology' },
              { title: 'Neurology', desc: 'Brain & Nervous System', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925429/medisphere/about/neurologist.jpg', link: '/departments/neurology' },
              { title: 'Orthopedics', desc: 'Bone & Joint Care', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925432/medisphere/about/orthopedics.jpg', link: '/departments/orthopedics' },
              { title: 'Oncology', desc: 'Cancer Care & Treatment', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925430/medisphere/about/oncology.jpg', link: '/departments/oncology' },
              { title: 'Pediatrics', desc: 'Child Health Care', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925433/medisphere/about/pediatrics.jpg', link: '/departments/pediatrics' },
              { title: 'Emergency Care', desc: '24/7 Critical Care', img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925418/medisphere/about/emergencycare.jpg', link: '/contact' }
            ].map((spec, idx) => (
              <Link key={idx} to={spec.link} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="h-32 bg-slate-200 relative overflow-hidden">
                  <img src={spec.img} alt={spec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-serif font-bold text-[var(--color-heading)] mb-1 flex items-center justify-center gap-1">
                    {spec.title} <span className="text-[var(--color-accent)]">.</span>
                  </h3>
                  <p className="text-[10px] text-[var(--color-foreground)] uppercase tracking-wider">{spec.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Three Column Section */}
      <section className="py-24 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Column 1: Patient Stories */}
            <div className="bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-sm">
              <h3 className="font-serif font-bold text-2xl text-[var(--color-heading)] mb-8">Patient Stories</h3>
              <div className="text-[var(--color-accent)] text-4xl font-serif leading-none mb-4">"</div>
              <p className="text-[var(--color-heading)] font-medium text-sm leading-relaxed mb-8">
                The care and support I received at Medisphere was exceptional. The doctors and staff truly care for their patients.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-[6px] font-mono text-slate-500 text-center">Img:<br />testimonial<br />.jpg</span></div>
                </div>
                <div>
                  <div className="font-bold text-[var(--color-heading)] text-sm">— Sarah Johnson</div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />)}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Latest Articles */}
            <div className="bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-heading)]">Latest Articles</h3>
                <span className="text-xs font-bold text-[var(--color-primary)] cursor-pointer hover:underline">View All &rarr;</span>
              </div>
              <div className="space-y-6">
                {[
                  { title: '10 Tips for a Healthy Heart', category: 'HEART HEALTH', date: 'May 20, 2024', img: 'blog-1' },
                  { title: 'Daily Habits That Improve Mental Health', category: 'WELLNESS', date: 'May 18, 2024', img: 'blog-2' }
                ].map((post, idx) => (
                  <div key={idx} className="flex gap-4 items-center group cursor-pointer">
                    <div className="h-20 w-24 rounded-xl shrink-0 relative overflow-hidden">
                      <img src={`/${post.img}.jpg`} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-[var(--color-muted)] uppercase tracking-wider mb-1">{post.category}</div>
                      <h4 className="font-bold text-[var(--color-heading)] text-sm mb-1 group-hover:text-[var(--color-primary)] transition-colors">{post.title}</h4>
                      <div className="text-[10px] text-[var(--color-foreground)]">{post.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Awards */}
            <div className="bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-heading)]">Awards</h3>
                <span className="text-xs font-bold text-[var(--color-primary)] cursor-pointer hover:underline">View All &rarr;</span>
              </div>
              <div className="space-y-6">
                {[
                  { title: 'Best Multispecialty Hospital', year: '2024 - Healthcare Excellence Awards' },
                  { title: 'Excellence in Patient Care', year: '2023 - National Health Awards' },
                  { title: 'Top Hospital in New York', year: '2023 - City Healthcare Ranking' }
                ].map((award, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                      <Award className="h-5 w-5 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-heading)] text-sm mb-1">{award.title}</h4>
                      <div className="text-[10px] text-[var(--color-foreground)]">{award.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Insurance Partners */}
      <section className="py-12 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="text-center mb-8">
            <h4 className="font-serif font-bold text-xl text-[var(--color-heading)]">Our Insurance & Corporate Partners</h4>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {[
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925421/medisphere/about/Insurancepartners/abchi.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925422/medisphere/about/Insurancepartners/Aetna.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925423/medisphere/about/Insurancepartners/aveanna.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925425/medisphere/about/Insurancepartners/cigna.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925427/medisphere/about/Insurancepartners/starhealtcare.jpg', isTata: false },
              { img: 'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925428/medisphere/about/Insurancepartners/tattaig.jpg', isTata: true }
            ].map((partner, idx) => (
              <div key={idx} className="w-32 h-16 bg-white flex items-center justify-center rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <img
                  src={partner.img}
                  alt="Insurance Partner"
                  className={`w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-300 ${partner.isTata ? 'object-contain p-2' : 'object-cover'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Visit Us Section */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--color-heading)] mb-4">Visit Our Campus</h2>
            <p className="text-[var(--color-foreground)] max-w-2xl mx-auto">Conveniently located in the heart of the city, our state-of-the-art facility is easily accessible for all your healthcare needs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Contact Details Card */}
            <div className="lg:col-span-4 bg-[var(--color-card)] rounded-[24px] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-border)] h-full">
              <h3 className="text-2xl font-serif font-bold text-[var(--color-heading)] mb-8">Get in Touch</h3>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)] mb-1">Our Location</h4>
                    <p className="text-sm text-[var(--color-foreground)] leading-relaxed">
                      Vibhuti Khand<br />
                      Gomtinagar, Lucknow<br />
                      Uttar Pradesh - 226010
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)] mb-1">Contact Numbers</h4>
                    <p className="text-sm text-[var(--color-foreground)]">Emergency: <span className="font-semibold text-[var(--color-danger)]">+91 89532 08952</span></p>
                    <p className="text-sm text-[var(--color-foreground)]">Reception: +91 89532 08952</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)] mb-1">Email Address</h4>
                    <p className="text-sm text-[var(--color-foreground)]">info@progixtechnology.com</p>
                    <p className="text-sm text-[var(--color-foreground)]">sales@progixtechnology.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
                <h4 className="text-sm font-bold text-[var(--color-heading)] mb-3">Visiting Hours</h4>
                <div className="flex justify-between text-sm text-[var(--color-foreground)] mb-2">
                  <span>General Wards</span>
                  <span className="font-semibold text-[var(--color-heading)]">4:00 PM - 7:00 PM</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-foreground)]">
                  <span>ICU</span>
                  <span className="font-semibold text-[var(--color-heading)]">10:00 AM - 11:00 AM</span>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="lg:col-span-8 h-[400px] lg:h-full min-h-[500px] rounded-[24px] overflow-hidden shadow-sm border border-[var(--color-border)] bg-[var(--color-background-secondary)] relative">
              {/* Premium Google Maps Iframe placeholder */}
              <iframe
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Vibhuti%20Khand,%20Gomtinagar,%20Lucknow,%20Uttar%20Pradesh%20226010&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.4) contrast(1.1)' }}
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
